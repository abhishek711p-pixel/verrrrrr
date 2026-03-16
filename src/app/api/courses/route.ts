import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized. Only teachers can create courses.' }, { status: 401 });
    }

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
    }

    const userData = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { teacherProfile: true }
    });

    if (!userData?.teacherProfile?.id) {
         return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherId: userData.teacherProfile.id,
      },
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');

    let courses;

    if (teacherId) {
      courses = await prisma.course.findMany({
        where: { teacherId },
        include: { videos: true, teacher: { include: { user: true } } }
      });
    } else {
      courses = await prisma.course.findMany({
        include: { videos: true, teacher: { include: { user: true } } }
      });
    }

    return NextResponse.json({ success: true, courses }, { status: 200 });
  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
