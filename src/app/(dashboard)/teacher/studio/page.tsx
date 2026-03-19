import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherAnalytics } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Presentation, Video, LogOut, Settings, BarChart, Eye, Calendar, Clock, UploadCloud } from "lucide-react";
import Link from "next/link";
import { UploadButton } from "../upload-button";
import { TeacherSidebar } from "../teacher-sidebar";

export default async function TeacherContentStudio() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const analytics = await getTeacherAnalytics(session.user.email);
  if (!analytics) {
    redirect("/teacher");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <TeacherSidebar activeTab="studio" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Content Studio</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track your video performance and viewership analytics.</p>
          </div>
          <div className="w-48">
             <UploadButton courses={analytics.courses || []} batches={analytics.batches || []} userEmail={session.user.email} />
          </div>
        </header>

        {/* Top Analytics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Uploaded Videos</CardTitle>
              <Video className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalVideos}</div>
              <p className="text-xs text-slate-500 mt-1">Across all courses</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Lifetime Views</CardTitle>
              <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                <BarChart className="h-3 w-3 mr-1" /> Trending upwards
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Views</CardTitle>
              <Calendar className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.monthlyViews.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Current Month (Estimated)</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Yearly Views</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.yearlyViews.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Total this Year</p>
            </CardContent>
          </Card>
        </div>

        {/* Video Performance Table */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Video Performance Breakdown</CardTitle>
            <CardDescription>Detailed views per uploaded video.</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.videos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 hidden md:table-header-group">
                    <tr>
                      <th className="px-6 py-3 font-medium">Video Title</th>
                      <th className="px-6 py-3 font-medium">Course</th>
                      <th className="px-6 py-3 font-medium text-right">Total Views</th>
                      <th className="px-6 py-3 font-medium text-right">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {analytics.videos.map((video: any) => (
                      <tr key={video.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex flex-col md:table-row py-4 md:py-0">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-3 text-cyan-500" />
                            {video.title}
                          </div>
                        </td>
                        <td className="px-6 py-2 md:py-4 text-slate-600 dark:text-slate-400">
                           <span className="md:hidden font-semibold mr-2">Course:</span>
                           {video.courseName}
                        </td>
                        <td className="px-6 py-2 md:py-4 text-slate-900 dark:text-white font-bold md:text-right">
                           <span className="md:hidden font-semibold mr-2 text-slate-600">Views:</span>
                           {video.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-2 md:py-4 text-slate-500 md:text-right">
                           <span className="md:hidden font-semibold mr-2 text-slate-600">Uploaded:</span>
                           {new Date(video.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No videos uploaded yet</h3>
                <p className="mt-2 text-sm text-slate-500">When you start uploading lectures, their view statistics will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
