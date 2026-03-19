import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherBatches } from "@/actions/teacher";
import { TeacherSidebar } from "../../teacher-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, LayoutDashboard, Database, TrendingUp, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AttendanceManager } from "./attendance-manager";

export default async function TeacherAttendancePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const batches = await getTeacherBatches(session.user.email);

  // Calculate Dynamic Stats
  let totalPresenceRecords = 0;
  let totalAttendanceRecords = 0;
  let pendingToday = 0;
  let absenceAlerts = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  batches.forEach((batch: any) => {
    let hasRecordToday = false;
    
    batch.students.forEach((bs: any) => {
      const studentAttendance = bs.student.attendance || [];
      
      studentAttendance.forEach((record: any) => {
        totalAttendanceRecords++;
        if (record.status === 'PRESENT') totalPresenceRecords++;
        
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        if (recordDate.getTime() === today.getTime()) {
          hasRecordToday = true;
        }
      });

      // Absence alert: if student was absent in their most recent record
      if (studentAttendance.length > 0) {
        const sortedAttendance = [...studentAttendance].sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (sortedAttendance[0].status === 'ABSENT') {
          absenceAlerts++;
        }
      }
    });

    if (!hasRecordToday && batch.students.length > 0) {
      pendingToday++;
    }
  });

  const avgParticipation = totalAttendanceRecords > 0 
    ? ((totalPresenceRecords / totalAttendanceRecords) * 100).toFixed(1) 
    : "0";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      <AttendanceManager initialBatches={batches} email={session.user.email} />
    </div>
  );
}
