import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBatchDetailsForStudentV2 } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BatchClientView } from "./BatchClientView";

export default async function StudentBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: batchId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const batch = await getBatchDetailsForStudentV2(session.user.email, batchId);

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-slate-50 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Batch Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">You might not be enrolled in this batch or it doesn't exist.</p>
        <Link href="/student">
          <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const studentProfileId = (batch as any).students?.[0]?.studentId || "";
  const isTeacher = session.user.role === "TEACHER";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Link href="/student" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            RETURN TO STUDENT HUB
          </Link>
        </div>

        <BatchClientView 
          batch={batch} 
          studentEmail={session.user.email} 
          studentId={studentProfileId} 
          isTeacher={isTeacher}
        />
      </div>
    </div>
  );
}
