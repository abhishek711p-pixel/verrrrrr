import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherBatches } from "@/actions/teacher";
import { TeacherSidebar } from "../../teacher-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateBatchDialog } from "./BatchForms";
import { BatchHub } from "./BatchHub";

export default async function TeacherBatchesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const batches = await getTeacherBatches(session.user.email);
  
  // Calculate total unique students across all batches
  const uniqueStudentIds = new Set();
  batches.forEach((b: any) => {
    b.students.forEach((s: any) => uniqueStudentIds.add(s.studentId));
  });
  const totalUniqueStudents = uniqueStudentIds.size;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <TeacherSidebar activeTab="creativity" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Batch Management Hub</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Organize students, monitor performance, and launch new cohorts.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/teacher/creativity">
              <Button variant="outline" className="border-slate-300 dark:border-slate-700">Back to Creativity</Button>
            </Link>
            {/* CreateBatchDialog is now integrated into the BatchHub action bar for better context */}
          </div>
        </header>

        {batches.length === 0 ? (
          <Card className="border-dashed border-2 shadow-none bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
             <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <Users className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Start Your First Batch</h3>
                <p className="text-slate-500 mt-2 text-center max-w-sm">Use the "Create New Batch" button to begin organizing your students and tracking their academic journey.</p>
             </CardContent>
          </Card>
        ) : (
          <BatchHub 
            batches={batches} 
            teacherEmail={session.user.email as string} 
            totalUniqueStudents={totalUniqueStudents}
          />
        )}
      </main>
    </div>
  );
}
