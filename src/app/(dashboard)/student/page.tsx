import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ensureUserExists, getUserProfile } from "@/actions/user";
import { getStudentDashboardData, getStudentBatches } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Video, Award, TrendingUp, Clock, CheckCircle2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { StudentSidebar } from "./StudentSidebar";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Ensure user is seeded in DB for the hackathon purposes based on login
  await ensureUserExists(session.user.email, "STUDENT");
  const userData = await getUserProfile(session.user.email);
  const dashboardData = await getStudentDashboardData(session.user.email);
  const studentBatches = await getStudentBatches(session.user.email);
  
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <StudentSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {userData?.name && userData.name !== "undefined" ? userData.name : session.user.email?.split('@')[0]}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Here's an overview of your learning progress.</p>
          </div>
        </header>


        {/* My Enrolled Batches Section */}
        {studentBatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              My Learning Batches
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {studentBatches.map((batch: any) => (
                <Card key={batch.id} className="border-indigo-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-indigo-700 dark:text-indigo-400">{batch.name}</CardTitle>
                      {batch.messages?.length > 0 && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" title="New Message" />
                      )}
                    </div>
                    <CardDescription>{batch.teacher?.user?.name ? `Instructor: ${batch.teacher.user.name}` : 'Assigned Batch'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                      {batch.description || 'No description provided for this batch.'}
                    </p>
                    
                    {batch.assignments?.length > 0 && (
                      <div className="mb-4 p-2 rounded bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                        <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">Latest Assignment</p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{batch.assignments[0].title}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated {new Date(batch.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Link href={`/student/batches/${batch.id}`}>
                      <Button variant="outline" size="sm" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
                        View Batch Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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
