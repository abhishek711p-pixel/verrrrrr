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
            subscriptions: {
              where: { status: 'ACTIVE' },
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
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.studentProfile) return [];

    let courses: any[] = [];
    user.studentProfile.subscriptions.forEach((sub: any) => {
      if (sub.teacher && sub.teacher.courses) {
        courses = [...courses, ...sub.teacher.courses.map((c: any) => ({
          ...c,
          teacherName: sub.teacher.user.name
        }))];
      }
    });

    return courses;
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
