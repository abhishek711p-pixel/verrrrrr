import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  console.log('Seeding creativity data...');

  // Get a teacher (Rajwant Sir, or the first teacher profile available)
  const teacher = await prismaClient.user.findFirst({
    where: { role: 'TEACHER', teacherProfile: { isNot: null } },
    include: { teacherProfile: true },
  });

  if (!teacher || !teacher.teacherProfile) {
    console.log('No teacher found. Run the marketplace seed first.');
    return;
  }

  // Create a few dummy students
  const student1 = await prismaClient.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      name: 'Rohan Sharma',
      role: 'STUDENT',
      studentProfile: {
        create: {}
      }
    },
    include: { studentProfile: true }
  });

  const student2 = await prismaClient.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      name: 'Meera Patel',
      role: 'STUDENT',
      studentProfile: {
        create: {}
      }
    },
    include: { studentProfile: true }
  });

  const student3 = await prismaClient.user.upsert({
    where: { email: 'student3@example.com' },
    update: {},
    create: {
      email: 'student3@example.com',
      name: 'Aditya Kumar',
      role: 'STUDENT',
      studentProfile: {
        create: {}
      }
    },
    include: { studentProfile: true }
  });

  if (!student1.studentProfile || !student2.studentProfile || !student3.studentProfile) {
    console.error('Failed to create student profiles');
    return;
  }

  // Create two Batches for the teacher
  const batch1 = await prismaClient.batch.create({
    data: {
      name: 'JEE Mains Accelerated 2026',
      description: 'Morning batch focusing on high-weightage topics.',
      teacherId: teacher.teacherProfile.id,
      students: {
        create: [
          { studentId: student1.studentProfile.id },
          { studentId: student2.studentProfile.id }
        ]
      }
    }
  });

  const batch2 = await prismaClient.batch.create({
    data: {
      name: 'NEET Foundation 2026',
      description: 'Evening batch for comprehensive biology and chemistry.',
      teacherId: teacher.teacherProfile.id,
      students: {
        create: [
          { studentId: student3.studentProfile.id },
          { studentId: student2.studentProfile.id }
        ]
      }
    }
  });

  // Create Assignments for the Batches
  await prismaClient.assignment.create({
    data: {
      title: 'Kinematics Worksheet 1',
      description: 'Solve questions 1-20 from HC Verma.',
      batchId: batch1.id,
      dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  });

  await prismaClient.assignment.create({
    data: {
      title: 'Human Physiology Diagram Practice',
      description: 'Draw and label the human digestive system.',
      batchId: batch2.id,
      dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000) 
    }
  });

  // Create Past Attendance records for today
  await prismaClient.attendance.create({
    data: {
      status: 'PRESENT',
      batchId: batch1.id,
      studentId: student1.studentProfile.id,
      date: new Date()
    }
  });
  
  await prismaClient.attendance.create({
    data: {
      status: 'ABSENT',
      batchId: batch1.id,
      studentId: student2.studentProfile.id,
      date: new Date()
    }
  });

  // Create a Teacher Message
  await prismaClient.teacherMessage.create({
    data: {
      subject: 'Welcome to the New Batch!',
      content: 'I am excited to start this journey with you all. Please check the assignment section for your first task.',
      teacherId: teacher.teacherProfile.id,
      batchId: batch1.id
    }
  });

  console.log('Successfully seeded Creativity Section data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
