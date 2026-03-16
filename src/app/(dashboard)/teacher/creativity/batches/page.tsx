import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherBatches } from "@/actions/teacher";
import { TeacherSidebar } from "../../teacher-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TeacherBatchesPage() {
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
            <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
               <Users className="w-6 h-6 mr-2" />
               <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Batches & Students</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">View your assigned batches and monitor individual student performance.</p>
          </div>
          <Link href="/teacher/creativity">
            <Button variant="outline">Back to Creativity</Button>
          </Link>
        </header>

        {batches.length === 0 ? (
          <Card className="border-dashed border-2 shadow-none bg-transparent">
             <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Batches Assigned</h3>
                <p className="text-slate-500 mt-2 text-center max-w-sm">You have not been assigned to any student batches yet.</p>
             </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {batches.map((batch: any) => (
              <Card key={batch.id} className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-indigo-700 dark:text-indigo-400">{batch.name}</CardTitle>
                      <CardDescription className="mt-1">{batch.description}</CardDescription>
                    </div>
                    <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-indigo-500" />
                      {batch.students.length} Students Enrolled
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {batch.students.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/20">
                          <tr>
                            <th className="px-6 py-4 font-medium">Student Name</th>
                            <th className="px-6 py-4 font-medium">Email Address</th>
                            <th className="px-6 py-4 font-medium text-center">Attendance (Last 30 Days)</th>
                            <th className="px-6 py-4 font-medium text-right">Avg Test Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {batch.students.map((bs: any) => {
                            const st = bs.student;
                            const user = st.user;
                            
                            // Calculate simple attendance logic
                            const totalDays = st.attendance?.length || 0;
                            const presentDays = st.attendance?.filter((a: any) => a.status === 'PRESENT').length || 0;
                            const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
                            
                            // Calculate avg test score
                            const totalScores = st.testScores?.length || 0;
                            const sumScores = st.testScores?.reduce((sum: number, t: any) => sum + (t.score / t.totalMarks) * 100, 0) || 0;
                            const avgScore = totalScores > 0 ? Math.round(sumScores / totalScores) : 0;

                            return (
                              <tr key={bs.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                  {user.name || "Unknown Student"}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center">
                                    {totalDays > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full ${attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                            style={{ width: `${attendancePercentage}%` }}
                                          ></div>
                                        </div>
                                        <span className={`font-medium ${attendancePercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                          {attendancePercentage}%
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 italic">No records</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {totalScores > 0 ? (
                                     <span className="font-bold text-slate-700 dark:text-slate-300">{avgScore}%</span>
                                  ) : (
                                     <span className="text-slate-400 italic">No tests taken</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      No students currently enrolled in this batch.
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
