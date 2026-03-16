"use server";

import prisma from "@/lib/prisma";

export async function getTeacherAnalytics(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacherProfile: {
          include: {
            courses: {
              include: {
                videos: {
                  orderBy: { createdAt: 'desc' }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.teacherProfile) return null;

    let totalVideos = 0;
    let totalViews = 0;
    const allVideos: any[] = [];

    user.teacherProfile.courses.forEach((course: any) => {
      course.videos.forEach((video: any) => {
        totalVideos++;
        // Add some mock views if it's 0 for visual demonstration
        const viewsCount = video.views > 0 ? video.views : Math.floor(Math.random() * 5000) + 100;
        totalViews += viewsCount;
        allVideos.push({
          id: video.id,
          title: video.title,
          courseName: course.title,
          views: viewsCount,
          createdAt: video.createdAt,
          thumbnailUrl: video.thumbnailUrl
        });
      });
    });

    // Sort videos by views (descending) for top performing list
    allVideos.sort((a, b) => b.views - a.views);

    // Mock Monthly/Yearly calculations
    const monthlyViews = Math.floor(totalViews * 0.45); // Roughly 45% of total views this month
    const yearlyViews = totalViews;

    return {
      totalVideos,
      totalViews,
      monthlyViews,
      yearlyViews,
      videos: allVideos
    };
  } catch (error) {
    console.error("Failed to fetch teacher analytics", error);
    return null;
  }
}

export async function updateSubscriptionFee(email: string, newFee: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true }
    });

    if (!user || !user.teacherProfile) {
      return { error: "Teacher profile not found" };
    }

    if (newFee < 200 || newFee > 1000) {
      return { error: "Fee must be between ₹200 and ₹1000" };
    }

    const updatedProfile = await prisma.teacherProfile.update({
      where: { id: user.teacherProfile.id },
      data: { subscriptionFee: newFee }
    });

    return { success: true, fee: updatedProfile.subscriptionFee };
  } catch (error) {
    console.error("Failed to update subscription fee", error);
    return { error: "Failed to update fee" };
  }
}

export async function getCommunityPosts(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return [];

    const posts = await prisma.communityPost.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return posts;
  } catch (error) {
    console.error("Failed to fetch community posts", error);
    return [];
  }
}

export async function createCommunityPost(email: string, content: string, scheduledFor: Date | null = null) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return { error: "User not found" };

    const post = await prisma.communityPost.create({
      data: {
        content,
        authorId: user.id,
        scheduledFor
      }
    });

    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post", error);
    return { error: "Failed to create post" };
  }
}

export async function getTeacherBatches(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacherProfile: {
          include: {
            batches: {
              include: {
                assignments: {
                  orderBy: { createdAt: 'desc' }
                },
                students: {
                  include: {
                    student: {
                      include: {
                        user: true,
                        attendance: true,
                        testScores: true,
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

    if (!user || !user.teacherProfile) return [];

    return user.teacherProfile.batches;
  } catch (error) {
    console.error("Failed to fetch teacher batches", error);
    return [];
  }
}

export async function createAssignment(email: string, title: string, description: string, batchId: string, dueDateStr: string | null) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true }
    });

    if (!user || !user.teacherProfile) return { error: "Teacher not found" };

    // Verify teacher owns the batch
    const batch = await prisma.batch.findFirst({
      where: { id: batchId, teacherId: user.teacherProfile.id }
    });

    if (!batch) return { error: "Batch not found or unauthorized" };

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        batchId,
        dueDate: dueDateStr ? new Date(dueDateStr) : null
      }
    });

    return { success: true, assignment };
  } catch (error) {
    console.error("Failed to create assignment", error);
    return { error: "Failed to create assignment" };
  }
}

export async function recordBatchAttendance(
  email: string, 
  batchId: string, 
  dateStr: string, 
  records: { studentId: string; status: string }[]
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true }
    });

    if (!user || !user.teacherProfile) return { error: "Teacher not found" };

    const batch = await prisma.batch.findFirst({
      where: { id: batchId, teacherId: user.teacherProfile.id }
    });

    if (!batch) return { error: "Batch not found or unauthorized" };

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0); // Normalize to start of day

    // Save attendance records in a transaction
    await prisma.$transaction(
      records.map(record => 
        prisma.attendance.upsert({
          where: {
            batchId_studentId_date: {
              batchId,
              studentId: record.studentId,
              date
            }
          },
          update: {
            status: record.status
          },
          create: {
            batchId,
            studentId: record.studentId,
            date,
            status: record.status
          }
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to record attendance", error);
    return { error: "Failed to record attendance." };
  }
}

export async function sendTeacherMessage(email: string, subject: string, content: string, batchId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true }
    });

    if (!user || !user.teacherProfile) return { error: "Teacher not found" };

    const message = await prisma.teacherMessage.create({
      data: {
        subject,
        content,
        teacherId: user.teacherProfile.id,
        batchId: batchId || null
      }
    });

    return { success: true, message };
  } catch (error) {
    console.error("Failed to send message", error);
    return { error: "Failed to send message." };
  }
}

export async function getTeacherMessages(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacherProfile: {
          include: {
            sentMessages: {
              include: { batch: true },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!user || !user.teacherProfile) return [];

    return user.teacherProfile.sentMessages;
  } catch (error) {
    console.error("Failed to fetch teacher messages", error);
    return [];
  }
}
