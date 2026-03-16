import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized. Only students can subscribe.' }, { status: 401 });
    }

    const { teacherId } = await req.json();

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required for subscription' }, { status: 400 });
    }

    const userData = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { studentProfile: true }
    });

    if (!userData?.studentProfile?.id) {
         return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    // Mocking a 30-day subscription creation
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        studentId: userData.studentProfile.id,
        teacherId: teacherId,
        status: 'ACTIVE',
        startDate,
        endDate
      },
    });

    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { 
        studentProfile: { include: { subscriptions: true } },
        teacherProfile: true 
      }
    });

    if (session.user.role === 'STUDENT') {
       return NextResponse.json({ 
         success: true, 
         subscriptions: userData?.studentProfile?.subscriptions || [] 
       }, { status: 200 });
    } else if (session.user.role === 'TEACHER' && userData?.teacherProfile?.id) {
       // Teachers fetching their active subscribers
       const subscribers = await prisma.subscription.findMany({
         where: { 
            teacherId: userData.teacherProfile.id,
            status: 'ACTIVE'
         },
         include: {
            student: { include: { user: true } }
         }
       });
       return NextResponse.json({ success: true, subscribers }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid role for this action' }, { status: 400 });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
