import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, ClipboardList, CalendarCheck, Mail, Award } from "lucide-react";
import Link from "next/link";
import { TeacherSidebar } from "../teacher-sidebar";

export default async function TeacherCreativityPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <TeacherSidebar activeTab="creativity" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
             <Lightbulb className="w-6 h-6 mr-2" />
             <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Teacher Creativity</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Your advanced classroom management system. Manage batches, assignments, and individual student progress.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Batches Card */}
          <Link href="/teacher/creativity/batches" className="group">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-slate-900 group-hover:border-indigo-400 dark:group-hover:border-indigo-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                 <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Users className="w-8 h-8" />
                 </div>
                 <div>
                   <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Batches &amp; Students</CardTitle>
                   <CardDescription>View performance per student</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage all your active student batches. Click into any batch to see individual test scores, attendance rates, and progress for every enrolled student.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Assignments Card */}
          <Link href="/teacher/creativity/assignments" className="group">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-slate-900 group-hover:border-indigo-400 dark:group-hover:border-indigo-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                 <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    <ClipboardList className="w-8 h-8" />
                 </div>
                 <div>
                   <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Notes &amp; Assignments</CardTitle>
                   <CardDescription>Distribute content per batch</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Upload study materials, homework, and class notes. You can restrict assignments to specific student batches and set due dates.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Attendance Card */}
          <Link href="/teacher/creativity/attendance" className="group">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-slate-900 group-hover:border-indigo-400 dark:group-hover:border-indigo-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                 <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <CalendarCheck className="w-8 h-8" />
                 </div>
                 <div>
                   <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Attendance Portal</CardTitle>
                   <CardDescription>Track daily presence</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Record daily attendance for each of your batches. Keep track of who is present, absent, or late to ensure students aren&apos;t falling behind.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Messages Card */}
          <Link href="/teacher/creativity/messages" className="group">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-slate-900 group-hover:border-indigo-400 dark:group-hover:border-indigo-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                 <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <Mail className="w-8 h-8" />
                 </div>
                 <div>
                   <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Teacher Inbox</CardTitle>
                   <CardDescription>Teacher-controlled messaging</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Send direct, one-way messages and announcements to specific student batches. Students will receive them in their dashboard but cannot reply, keeping you in full control.</p>
              </CardContent>
            </Card>
          </Link>

          {/* ── NEW: Test Scores Card ── */}
          <Link href="/teacher/creativity/scores" className="group">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-slate-900 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 md:col-span-2">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                 <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <Award className="w-8 h-8" />
                 </div>
                 <div>
                   <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Record Test Scores</CardTitle>
                   <CardDescription>Enter marks per student per exam</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Select a batch, pick a student, and enter their exam marks. Scores are saved to the database instantly and visible on the student&apos;s Performance Analytics page.</p>
              </CardContent>
            </Card>
          </Link>

        </div>
      </main>
    </div>
  );
}

