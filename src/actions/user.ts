"use server";

import prisma from "@/lib/prisma";

export async function getUserProfile(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true,
      }
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return null;
  }
}

// Additional mock action to seed a user if missing
export async function ensureUserExists(email: string, role: "STUDENT" | "TEACHER") {
  try {
    let user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true
      }
    });
    
    if (!user) {
      // Create user on the fly if it's "open for all"
      user = await prisma.user.create({
        data: {
          email,
          role,
          name: email.split('@')[0],
          ...(role === 'STUDENT' 
            ? { studentProfile: { create: {} } }
            : { teacherProfile: { create: {} } }
          )
        },
        include: {
          studentProfile: true,
          teacherProfile: true
        }
      });

      // DYNAMIC BATCH AUTO-ENROLLMENT
      if (role === 'STUDENT' && user.studentProfile) {
        const studentId = user.studentProfile.id;
        const allBatches = await prisma.batch.findMany();
        
        const batchesToJoin = allBatches.filter(b => {
          const batchNameLower = b.name.toLowerCase();
          const emailLower = email.toLowerCase();
          
          // Match 'sot25' keyword
          if (batchNameLower.includes('sot25') && emailLower.includes('sot25')) return true;
          
          // Match Global batches
          if (batchNameLower.includes('maths') || batchNameLower.includes('english')) return true;
          
          return false;
        });

        if (batchesToJoin.length > 0) {
          await prisma.batchStudent.createMany({
            data: batchesToJoin.map(b => ({
              batchId: b.id,
              studentId: studentId
            })),
            skipDuplicates: true
          });
        }
      }

      return user;
    }

    // DYNAMIC BATCH AUTO-ENROLLMENT (for anyone with no batches)
    if (role === 'STUDENT' && user.studentProfile) {
      const studentProfile = user.studentProfile;
      // Check if they already have batches to avoid re-enrolling (or just use createMany skipDuplicates)
      const existingBatchCount = await prisma.batchStudent.count({
        where: { studentId: studentProfile.id }
      });

      if (existingBatchCount === 0) {
        const allBatches = await prisma.batch.findMany();
        const batchesToJoin = allBatches.filter(b => {
          const batchNameLower = b.name.toLowerCase();
          const emailLower = email.toLowerCase();
          
          if (batchNameLower.includes('sot25') && emailLower.includes('sot25')) return true;
          if (batchNameLower.includes('maths') || batchNameLower.includes('english')) return true;
          return false;
        });

        if (batchesToJoin.length > 0) {
          await prisma.batchStudent.createMany({
            data: batchesToJoin.map(b => ({
              batchId: b.id,
              studentId: studentProfile.id
            })),
            skipDuplicates: true
          });
        }
      }
    }
    
    return user;
  } catch (error) {
    console.error("Failed to ensure user exists", error);
    return null;
  }
}
