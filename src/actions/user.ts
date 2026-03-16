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
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          role,
          name: email.split('@')[0],
          ...(role === 'STUDENT' 
            ? { studentProfile: { create: {} } }
            : { teacherProfile: { create: {} } }
          )
        }
      });
    }
    return user;
  } catch (error) {
    console.error("Failed to ensure user exists", error);
    return null;
  }
}
