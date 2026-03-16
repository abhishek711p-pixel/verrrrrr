"use server";

import prisma from "@/lib/prisma";

export async function getCoursesByTeacher(teacherId: string) {
  try {
    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: { videos: true }
    });
    return courses;
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return [];
  }
}

export async function getAllCourses() {
   try {
    const courses = await prisma.course.findMany({
      include: { 
          teacher: {
              include: { user: true }
          },
          videos: true 
      }
    });
    return courses;
  } catch (error) {
    console.error("Failed to fetch all courses", error);
    return [];
  }
}
