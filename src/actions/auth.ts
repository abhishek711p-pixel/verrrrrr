"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// In a real app, use bcrypt or similar for password hashing.
// For this playground, we'll store simple passwords as requested.

export async function registerUser(formData: { name: string, email: string, password: string, role: string }) {
  return { error: "Public registration is currently disabled. Please contact your administrator." };
}
