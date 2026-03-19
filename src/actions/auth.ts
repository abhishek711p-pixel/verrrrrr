"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// In a real app, use bcrypt or similar for password hashing.
// For this playground, we'll store simple passwords as requested.

export async function registerUser(formData: { name: string, email: string, password: string, role: string }) {
  try {
    const { name, email, password, role } = formData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, hash this!
        role: role as Role,
      },
    });

    if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: { userId: user.id },
      });
    } else if (role === "TEACHER") {
      await prisma.teacherProfile.create({
        data: { userId: user.id },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { error: "Registration failed. Please try again later." };
  }
}

export async function requestTrialAccess(email: string) {
  // Simulate database storage or email notification
  console.log(`Trial access requested for: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return { success: true };
}
