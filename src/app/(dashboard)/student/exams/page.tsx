import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentExams } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Video, LogOut, Award, CheckCircle2, TrendingUp, TrendingDown, Target } from "lucide-react";
import Link from "next/link";

export default async function StudentExamsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const exams = await getStudentExams(session.user.email);
  
  // Calculate analytics
  const totalExams = exams.length;
  let averageScore = 0;
  let highestScore = 0;
  
  if (totalExams > 0) {
    let sumPercentages = 0;
    exams.forEach((exam: any) => {
      const percentage = (exam.score / exam.totalMarks) * 100;
      sumPercentages += percentage;
      if (percentage > highestScore) {
        highestScore = percentage;
      }
    });
    averageScore = Math.round(sumPercentages / totalExams);
    highestScore = Math.round(highestScore);
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:block">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-6 w-6" />
            <span>Student Portal</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/student" passHref>
            <Button variant="ghost" className="w-full justify-start hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/student/courses" passHref>
             <Button variant="ghost" className="w-full justify-start hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
              <Video className="mr-2 h-4 w-4" /> My Courses
            </Button>
          </Link>
          <Link href="/student/exams" passHref>
            <Button variant="secondary" className="w-full justify-start bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50">
              <Award className="mr-2 h-4 w-4" /> Test Scores
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Performance Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Review your test scores and track your overall academic progress.</p>
          </div>
          <form action="/api/auth/signout" method="POST">
             <Button variant="outline" type="submit" className="border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400">
               <LogOut className="mr-2 h-4 w-4" /> Sign Out
             </Button>
          </form>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-indigo-100 bg-white dark:bg-slate-900 border-t-4 border-t-indigo-500 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Score</CardTitle>
              <Award className="w-4 h-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-indigo-700 dark:text-indigo-400">{averageScore}%</div>
              <div className="flex items-center mt-2 text-sm text-slate-500">
                {averageScore >= 75 ? (
                  <><TrendingUp className="w-4 h-4 mr-1 text-emerald-500" /> Excellent tracking</>
                ) : (
                  <><TrendingDown className="w-4 h-4 mr-1 text-amber-500" /> Room for improvement</>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white dark:bg-slate-900 border-t-4 border-t-emerald-500 shadow-sm relative overflow-hidden">
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Highest Score</CardTitle>
              <Target className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{highestScore}%</div>
              <div className="flex items-center mt-2 text-sm text-slate-500">
                 <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" /> Personal best
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white dark:bg-slate-900 border-t-4 border-t-slate-400 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Tests Completed</CardTitle>
              <BookOpen className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-700 dark:text-white">{totalExams}</div>
              <div className="flex items-center mt-2 text-sm text-slate-500">
                 Across all subjects
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg">Detailed Exam History</CardTitle>
            <CardDescription>A complete log of every test you've submitted to date.</CardDescription>
          </CardHeader>
          <div className="p-0">
            {totalExams > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 font-semibold uppercase bg-slate-100 dark:bg-slate-800/80 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Exam Name</th>
                      <th className="px-6 py-4">Submission Date</th>
                      <th className="px-6 py-4 text-center">Raw Score</th>
                      <th className="px-6 py-4 text-center">Max Marks</th>
                      <th className="px-6 py-4 text-right rounded-tr-lg">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {exams.map((exam: any) => {
                      const percentage = Math.round((exam.score / exam.totalMarks) * 100);
                      const isExcellent = percentage >= 85;
                      const isPassing = percentage >= 60 && percentage < 85;
                      const isFailing = percentage < 60;
                      
                      return (
                        <tr key={exam.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${isExcellent ? 'bg-emerald-500' : isPassing ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                              {exam.testName}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(exam.takenAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-center font-medium">
                            {exam.score}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-500">
                            {exam.totalMarks}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              isExcellent ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                              isPassing ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <Target className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No tests yet</h3>
                <p className="max-w-md text-center">You haven't taken any exams or quizzes yet. Once you complete assessments, your data will appear here.</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
