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
      // Access is restricted to pre-registered users only
      console.warn(`ensureUserExists: Unauthorized access attempt by ${email}`);
      return null;
    }

    // Ensure profile exists if user was pre-registered but profile was not created
    const profile = role === 'STUDENT' ? user.studentProfile : user.teacherProfile;
    if (!profile) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
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
    }
    
    return user;
  } catch (error) {
    console.error("Failed to ensure user exists", error);
    return null;
  }
}
