"use server";

import prisma from "@/lib/prisma";

export async function getStudentDashboardData(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            subscriptions: true,
            testScores: {
              orderBy: { takenAt: 'desc' }
            }
          }
        }
      }
    });

    if (!user || !user.studentProfile) return null;

    const studentId = user.studentProfile.id;

    // Get enrolled courses count (unique teachers subscribed -> unique courses or just all courses by subscribed teachers)
    // For simplicity, we just count all courses from all subscribed teachers
    const activeSubscriptions = user.studentProfile.subscriptions.filter((s: any) => s.status === 'ACTIVE');
    const teacherIds = activeSubscriptions.map((s: any) => s.teacherId);
    
    let totalCourses = 0;
    let recentCourses: any[] = [];
    if (teacherIds.length > 0) {
      totalCourses = await prisma.course.count({
        where: {
          teacherId: { in: teacherIds }
        }
      });
      recentCourses = await prisma.course.findMany({
        where: {
          teacherId: { in: teacherIds }
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { teacher: { include: { user: true } } }
      });
    }

    // Get test score stats
    const testScores = user.studentProfile.testScores;
    const totalTests = testScores.length;
    const averageScore = totalTests > 0 
      ? Math.round(testScores.reduce((acc: number, test: any) => acc + (test.score / test.totalMarks) * 100, 0) / totalTests)
      : 0;

    return {
      activeSubscriptions: activeSubscriptions.length,
      totalCourses,
      recentCourses,
      totalTests,
      averageScore,
      recentScores: testScores.slice(0, 3)
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    return null;
  }
}

export async function getStudentCourses(email: string) {
  if (!email) return [];

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            // ── Courses via active subscriptions ──
            subscriptions: {
              where: { status: "ACTIVE" },
              include: {
                teacher: {
                  include: {
                    user: true,
                    courses: { include: { videos: true } }
                  }
                }
              }
            },
            // ── Courses via enrolled batches ──
            batches: {
              include: {
                batch: {
                  include: {
                    teacher: {
                      include: {
                        user: true,
                        courses: { include: { videos: true } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user?.studentProfile) return [];

    const courseMap = new Map<string, any>();

    // From subscriptions
    user.studentProfile.subscriptions.forEach((sub: any) => {
      sub.teacher?.courses?.forEach((c: any) => {
        if (!courseMap.has(c.id)) {
          courseMap.set(c.id, { ...c, teacherName: sub.teacher.user.name });
        }
      });
    });

    // From batches (deduplicated)
    user.studentProfile.batches.forEach((bs: any) => {
      const teacher = bs.batch?.teacher;
      teacher?.courses?.forEach((c: any) => {
        if (!courseMap.has(c.id)) {
          courseMap.set(c.id, { ...c, teacherName: teacher.user.name });
        }
      });
    });

    return Array.from(courseMap.values());
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return [];
  }
}


export async function getStudentExams(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            testScores: {
              orderBy: { takenAt: 'desc' }
            }
          }
        }
      }
    });

    if (!user || !user.studentProfile) return [];
    return user.studentProfile.testScores;
  } catch (error) {
    console.error("Failed to fetch exams", error);
    return [];
  }
}

export async function getAvailableCourses(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            subscriptions: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      }
    });

    if (!user || !user.studentProfile) return [];

    // Find all teachers the student is NOT subscribed to
    const activeTeacherIds = user.studentProfile.subscriptions.map((s: any) => s.teacherId);

    const availableTeachers = await prisma.teacherProfile.findMany({
      where: {
        id: {
          notIn: activeTeacherIds
        }
      },
      include: {
        user: true,
        courses: {
          include: {
            videos: true
          }
        }
      }
    });

    let availableCourses: any[] = [];
    availableTeachers.forEach((teacher: any) => {
      if (teacher.courses) {
        availableCourses = [
          ...availableCourses,
          ...teacher.courses.map((c: any) => ({
             ...c,
             teacherName: teacher.user.name,
             teacherEmail: teacher.user.email
          }))
        ];
      }
    });

    return availableCourses;
  } catch (error) {
    console.error("Failed to fetch available courses", error);
    return [];
  }
}

export async function subscribeToTeacher(teacherId: string, studentEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: studentEmail },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) return { error: "User not found" };

    // Set the renewal date to 30 days from now
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        studentId: user.studentProfile.id,
        teacherId: teacherId,
        status: 'ACTIVE',
        endDate: renewalDate
      }
    });

    return { success: true, subscription };
  } catch (error) {
    console.error("Failed to subscribe", error);
    return { error: "Failed to subscribe" };
  }
}

export async function getStudentBatches(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            batches: {
              include: {
                batch: {
                  include: {
                    teacher: {
                      include: {
                        user: true
                      }
                    },
                    assignments: {
                      orderBy: { createdAt: 'desc' },
                      take: 2 // Just high-level preview
                    },
                    messages: {
                      orderBy: { createdAt: 'desc' },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.studentProfile) return [];

    return user.studentProfile.batches.map(bs => bs.batch);
  } catch (error) {
    console.error("Failed to fetch student batches", error);
    return [];
  }
}

export async function getBatchDetailsForStudentV2(email: string, batchId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) return null;

    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        teacher: {
          include: { 
            user: true,
            courses: {
              include: {
                videos: true
              }
            }
          }
        },
        assignments: {
          include: {
            assignmentSubmissions: {
              where: { studentId: user.studentProfile.id }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        messages: {
          where: {
            OR: [
              { studentId: null }, // Broadcast to batch
              { studentId: user.studentProfile.id } // Private to this student
            ]
          },
          include: {
            replies: {
              include: { author: true },
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attendance: {
          where: { studentId: user.studentProfile.id },
          orderBy: { date: 'desc' }
        },
        students: {
          where: { studentId: user.studentProfile.id }
        }
      }
    });

    if (!batch) {
      console.log("Batch not found for ID:", batchId);
      return null;
    }

    return batch;
  } catch (error) {
    console.error("DEBUG: Failed to get batch details for student:", error);
    return null;
  }
}

export async function sendMessageReply(email: string, messageId: string, content: string, isPrivate: boolean = false) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return { error: "User not found" };

    const reply = await prisma.messageReply.create({
      data: {
        content,
        messageId,
        authorId: user.id,
        isPrivate
      },
      include: {
        author: true
      }
    });

    return { success: true, reply };
  } catch (error) {
    console.error("Failed to send reply", error);
    return { error: "Failed to send reply" };
  }
}
export async function submitAssignment(
  studentEmail: string,
  assignmentId: string,
  providedAnswer: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: studentEmail },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) return { error: "Student not found" };

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) return { error: "Assignment not found" };

    // Validate answer (case insensitive and trimmed)
    if ((assignment as any).validationAnswer) {
      const normalizedProvided = providedAnswer.trim().toLowerCase();
      const normalizedCorrect = (assignment as any).validationAnswer.trim().toLowerCase();

      if (normalizedProvided !== normalizedCorrect) {
        return { error: "Incorrect validation answer. Please try again." };
      }
    }

    // Record submission
    const submission = await (prisma as any).assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: assignmentId,
          studentId: user.studentProfile.id
        }
      },
      update: {
        submittedAt: new Date(),
        status: "SUBMITTED"
      },
      create: {
        assignmentId: assignmentId,
        studentId: user.studentProfile.id,
        status: "SUBMITTED"
      }
    });

    return { success: true, submission };
  } catch (error) {
    console.error("Failed to submit assignment", error);
    return { error: "Failed to submit assignment. Please try again." };
  }
}
