import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ensureUserExists, getUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, Users, Video, DollarSign, LogOut, Settings, MessageSquare } from "lucide-react";
import { SchedulePostButton } from "./schedule-post-button";
import { UploadButton } from "./upload-button";
import { SubscriptionFeeUpdater } from "./subscription-fee-updater";
import { TeacherSidebar } from "./teacher-sidebar";
import Link from "next/link";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Ensure user is seeded in DB
  await ensureUserExists(session.user.email, "TEACHER");
  const userData = await getUserProfile(session.user.email);
  const teacherProfile = userData?.teacherProfile;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <TeacherSidebar activeTab="dashboard" />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome, Educator {userData?.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your courses, students, and earnings.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">₹0</div>
              <p className="text-xs text-slate-500 mt-1">Based on active subscriptions</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
               <CardTitle>Content Studio</CardTitle>
               <CardDescription>Upload new recorded lectures or schedule a live class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton />
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
               <CardTitle>Subscription Fee</CardTitle>
               <CardDescription>Set your monthly fee for full access to your content.</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionFeeUpdater 
                initialFee={teacherProfile?.subscriptionFee || 500} 
                email={session.user.email} 
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm mt-6">
          <CardHeader>
             <CardTitle>Community Engagement</CardTitle>
             <CardDescription>Keep your students updated by scheduling a new post or announcement to your followers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
               <div className="mb-4 sm:mb-0">
                 <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Next Scheduled Post</p>
                 <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">No upcoming posts scheduled.</p>
               </div>
               <div className="w-full sm:w-auto">
                  <SchedulePostButton />
               </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
