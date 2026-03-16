import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherBatches } from "@/actions/teacher";
import { TeacherSidebar } from "../../teacher-sidebar";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AttendanceManager } from "./attendance-manager";

export default async function TeacherAttendancePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const batches = await getTeacherBatches(session.user.email);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <TeacherSidebar activeTab="creativity" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-2">
               <CalendarCheck className="w-6 h-6 mr-2" />
               <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Attendance Portal</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Track and manage daily attendance records for all your students.</p>
          </div>
          <Link href="/teacher/creativity">
            <Button variant="outline">Back to Creativity</Button>
          </Link>
        </header>

        <AttendanceManager initialBatches={batches} email={session.user.email} />
      </main>
    </div>
  );
}
