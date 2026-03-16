import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ensureUserExists, getUserProfile } from "@/actions/user";
import { getStudentDashboardData } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Video, LogOut, Award, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Ensure user is seeded in DB for the hackathon purposes based on login
  await ensureUserExists(session.user.email, "STUDENT");
  const userData = await getUserProfile(session.user.email);
  const dashboardData = await getStudentDashboardData(session.user.email);
  
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
            <Button variant="secondary" className="w-full justify-start bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50">
              <BookOpen className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/student/courses" passHref>
            <Button variant="ghost" className="w-full justify-start hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
              <Video className="mr-2 h-4 w-4" /> My Courses
            </Button>
          </Link>
          <Link href="/student/exams" passHref>
            <Button variant="ghost" className="w-full justify-start hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
              <Award className="mr-2 h-4 w-4" /> Test Scores
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, {userData?.name || "Student"}!</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Here's an overview of your learning progress.</p>
          </div>
          <form action="/api/auth/signout" method="POST">
             <Button variant="outline" type="submit" className="border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400">
               <LogOut className="mr-2 h-4 w-4" /> Sign Out
             </Button>
          </form>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-indigo-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Subscriptions</CardTitle>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{dashboardData?.activeSubscriptions || 0}</div>
              <p className="text-xs text-emerald-500 font-medium flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> Active Trial
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Available Courses</CardTitle>
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Video className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{dashboardData?.totalCourses || 0}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Through your subscriptions
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Tests Completed</CardTitle>
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{dashboardData?.totalTests || 0}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Total assessments taken
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Score</CardTitle>
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Award className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">{dashboardData?.averageScore || 0}%</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Across all test submissions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Courses Preview */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Courses Available</CardTitle>
              <CardDescription>Explore recently uploaded content</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.recentCourses && dashboardData.recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentCourses.map((course: any) => (
                    <div key={course.id} className="flex items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-12 h-12 rounded-md bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="ml-4 flex-1 overflow-hidden">
                        <h4 className="text-sm font-semibold truncate text-slate-900 dark:text-white">{course.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">By {course.teacher?.user?.name || "Instructor"}</p>
                      </div>
                      <Link href={`/student/courses`}>
                        <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">View</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500">
                  <BookOpen className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">No courses available right now.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Test Scores Preview */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Test Scores</CardTitle>
              <CardDescription>Your latest achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.recentScores && dashboardData.recentScores.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentScores.map((test: any) => {
                    const percentage = Math.round((test.score / test.totalMarks) * 100);
                    return (
                      <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center">
                          <div className={`w-2 h-12 rounded-full mr-4 ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{test.testName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(test.takenAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{percentage}%</div>
                          <div className="text-xs text-slate-500">{test.score} / {test.totalMarks}</div>
                        </div>
                      </div>
                    );
                  })}
                  <Link href={`/student/exams`} className="block mt-4 text-center w-full">
                    <Button variant="outline" className="w-full text-sm">View All Scores</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500">
                  <Award className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">No test scores recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
