import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherBatchStudents } from "@/actions/teacher";
import { TeacherSidebar } from "../../teacher-sidebar";
import { TestScoreForm } from "./TestScoreForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";

export default async function TeacherScoresPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const batches = await getTeacherBatchStudents(session.user.email);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-600" />
            Record Test Scores
          </h1>
          <p className="text-slate-500 mt-1">Enter student test results — scores will appear instantly on the student's dashboard.</p>
        </header>

        {batches.length === 0 ? (
          <Card className="border-dashed border-slate-300 dark:border-slate-700">
            <CardContent className="py-20 text-center">
              <Award className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-500">No batches yet. Create a batch and add students first.</p>
            </CardContent>
          </Card>
        ) : (
          <TestScoreForm batches={batches} teacherEmail={session.user.email} />
        )}
    </div>
  );
}
