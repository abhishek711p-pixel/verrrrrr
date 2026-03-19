import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const teacherEmail = "teacher@example.com";
  const studentEmail = "student@example.com";
  
  console.log("Seeding users...");
  const teacherUser = await prisma.user.upsert({
    where: { email: teacherEmail },
    update: {},
    create: {
      email: teacherEmail,
      name: "Prof. Anderson",
      role: "TEACHER",
      password: "password123", // In a real app, this would be hashed
      teacherProfile: {
        create: {
          bio: "Expert in Fullstack Development and React.",
          subscriptionFee: 499.0
        }
      }
    },
    include: { teacherProfile: true }
  });

  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      email: studentEmail,
      name: "Abhishek Student",
      role: "STUDENT",
      password: "password123",
      studentProfile: {
        create: {}
      }
    },
    include: { studentProfile: true }
  });

  if (!teacherUser.teacherProfile) return console.log("Failed to create teacher profile");
  if (!studentUser.studentProfile) return console.log("Failed to create student profile");

  const teacherProfileId = teacherUser.teacherProfile.id;
  const studentProfileId = studentUser.studentProfile.id;

  // Create some courses
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    console.log("Seeding courses...");
    await prisma.course.create({
      data: {
        title: "Introduction to Advanced React",
        description: "Master React server components and advanced patterns.",
        teacherId: teacherProfileId,
        videos: {
          create: [
            { title: "Server Components 101", url: "https://example.com/video1" },
            { title: "Server Actions Deep Dive", url: "https://example.com/video2" }
          ]
        }
      }
    });
    await prisma.course.create({
      data: {
        title: "Node.js Backend Architecture",
        description: "Building scalable backends with Express and Prisma.",
        teacherId: teacherProfileId,
        videos: {
          create: [
            { title: "Express Basics", url: "https://example.com/video3" }
          ]
        }
      }
    });
  }

  // Create a subscription
  const subCount = await prisma.subscription.count({ where: { studentId: studentProfileId }});
  if (subCount === 0) {
    console.log("Seeding subscription...");
    await prisma.subscription.create({
      data: {
        studentId: studentProfileId,
        teacherId: teacherProfileId,
        status: "ACTIVE",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });
  }

  // Create test scores
  const scoreCount = await prisma.testScore.count({ where: { studentId: studentProfileId }});
  if (scoreCount === 0) {
    console.log("Seeding test scores...");
    await prisma.testScore.createMany({
      data: [
        { studentId: studentProfileId, testName: "React Basics Quiz", score: 85, totalMarks: 100 },
        { studentId: studentProfileId, testName: "Node.js Midterm", score: 92, totalMarks: 100 },
        { studentId: studentProfileId, testName: "Database Schema Design", score: 78, totalMarks: 100 },
      ]
    });
  }

  console.log("Database seeded with sample data!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
