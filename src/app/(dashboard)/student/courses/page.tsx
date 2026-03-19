import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentCourses } from "@/actions/student";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, PlayCircle, Layers, Calendar, Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentSidebar } from "../StudentSidebar";

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const courses = await getStudentCourses(session.user.email);
  
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <StudentSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Learning Queue</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Pick up where you left off and finish your courses.</p>
          </div>
        </header>

        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course: any) => (
              <Card key={course.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl truncate">{course.title}</h3>
                    <p className="text-sm text-indigo-100 opacity-90 truncate">{course.description || "Learn and master the fundamentals."}</p>
                  </div>
                </div>
                <CardContent className="pt-6 pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 font-bold text-slate-700 dark:text-slate-300">
                        {course.teacherName?.charAt(0) || "I"}
                      </div>
                      <span className="font-medium">{course.teacherName || "Instructor"}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Layers className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{course.videos?.length || 0} Lessons</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Course Progress</span>
                      <span className="text-indigo-600 dark:text-indigo-400">0%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 pb-6">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 dark:group-hover:text-white transition-colors">
                    <PlayCircle className="w-4 h-4 mr-2" /> Start Learning
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500">
            <Video className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No courses found</h3>
            <p className="max-w-md text-center mb-6">It looks like the teachers you are subscribed to haven't uploaded any courses yet, or you don't have active subscriptions.</p>
          </div>
        )}
      </main>
    </div>
  );
}
