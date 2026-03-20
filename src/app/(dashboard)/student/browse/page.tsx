import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAvailableCourses } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Compass, PlayCircle, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { StudentSidebar } from "../StudentSidebar";

export default async function BrowsePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const courses = await getAvailableCourses(session.user.email);
  
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
        <header className="mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Course Catalog</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Browse all available courses from registered teachers.</p>
          </div>
        </header>

        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => (
              <Card key={course.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      course.title.includes('Physics') ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' : 
                      course.title.includes('Math') ? 'bg-red-500/20 text-red-100 border border-red-400/30' : 
                      course.title.includes('Chem') ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' : 
                      'bg-green-500/20 text-green-100 border border-green-400/30'
                    }`}>
                      {course.title.includes('Physics') ? 'Physics' : course.title.includes('Math') ? 'Mathematics' : course.title.includes('Chem') ? 'Chemistry' : 'Biology'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl leading-tight mb-1">{course.title}</h3>
                  </div>
                </div>
                <CardContent className="pt-5 pb-4 flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                    {course.description || "Master this subject with comprehensive video lectures and assignments."}
                  </p>
                  
                  <div className="flex items-center text-sm text-slate-900 dark:text-white font-medium mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <img 
                      src={
                        course.teacherName?.includes('Rajwant') ? 'https://pub-081e3aed421e427ca8e61cb05ccb9fb4.r2.dev/physics_rajwant.jpg' :
                        course.teacherName?.includes('Salim') ? 'https://pub-081e3aed421e427ca8e61cb05ccb9fb4.r2.dev/physics_salim.jpg' :
                        course.teacherName?.includes('Tarun') ? 'https://pub-081e3aed421e427ca8e61cb05ccb9fb4.r2.dev/maths_tarun.jpg' :
                        course.teacherName?.includes('Samapti') ? 'https://pub-081e3aed421e427ca8e61cb05ccb9fb4.r2.dev/biology_samapti.jpg' :
                        `https://api.dicebear.com/7.x/initials/svg?seed=${course.teacherName}`
                      }
                      alt={course.teacherName}
                      className="w-8 h-8 rounded-full object-cover mr-3 border border-slate-200 dark:border-slate-700" 
                    />
                    {course.teacherName}
                    <CheckCircle2 className="w-4 h-4 text-blue-500 ml-1" />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Layers className="w-4 h-4 mr-1 text-slate-400" />
                      {course.videos?.length || 0} Lectures
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-5 px-6">
                  <Link href="/student/courses" className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      <PlayCircle className="w-4 h-4 mr-2" /> View Courses
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500">
            <Compass className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">You're subscribed to everything!</h3>
            <p className="max-w-md text-center">There are no new courses available in the catalog at this moment.</p>
          </div>
        )}
    </div>
  );
}
