import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAvailableCourses, subscribeToTeacher } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, LogOut, Award, Compass, PlayCircle, Layers, PlusCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { SubscribeButton } from "./subscribe-button";

export default async function BrowsePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const courses = await getAvailableCourses(session.user.email);
  
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
            <Button variant="ghost" className="w-full justify-start hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
              <Award className="mr-2 h-4 w-4" /> Test Scores
            </Button>
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <Link href="/student/browse" passHref>
              <Button variant="secondary" className="w-full justify-start bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/50">
                <Compass className="mr-2 h-4 w-4" /> Browse Catalog
              </Button>
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">JEE & NEET Marketplace</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Discover expert educators for Physics, Chemistry, Maths, and Biology.</p>
          </div>
          <form action="/api/auth/signout" method="POST">
             <Button variant="outline" type="submit" className="border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400">
               <LogOut className="mr-2 h-4 w-4" /> Sign Out
             </Button>
          </form>
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
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500 line-through">₹2,000/mo</span>
                      <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                        ₹300<span className="text-xs font-normal text-slate-500">/mo</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-5 px-6">
                  <SubscribeButton />
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
      </main>
    </div>
  );
}
