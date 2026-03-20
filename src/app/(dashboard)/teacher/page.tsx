import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ensureUserExists, getUserProfile } from "@/actions/user";
import { getTeacherAnalytics } from "@/actions/teacher";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  BookOpen,
  UploadCloud,
  Calendar,
  MessageSquare,
  ChevronRight,
  Layers,
} from "lucide-react";
import { SchedulePostButton } from "./schedule-post-button";
import { UploadButton } from "./upload-button";
import { TeacherSidebar } from "./teacher-sidebar";
import Link from "next/link";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  await ensureUserExists(session.user.email, "TEACHER");
  const userData = await getUserProfile(session.user.email);
  const analytics = await getTeacherAnalytics(session.user.email);

  const displayName =
    userData?.name && userData.name !== "undefined"
      ? userData.name
      : session.user.email?.split("@")[0];

  const totalVideos   = analytics?.totalVideos  ?? 0;
  const totalCourses  = analytics?.courses?.length ?? 0;
  const totalBatches  = analytics?.batches?.length ?? 0;

  const stats = [
    {
      label: "Total Videos",
      value: totalVideos,
      icon: Video,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
      border: "border-indigo-100 dark:border-indigo-800",
      gradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      label: "Courses Created",
      value: totalCourses,
      icon: BookOpen,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/30",
      border: "border-violet-100 dark:border-violet-800",
      gradient: "from-violet-500/10 to-purple-500/10",
    },
    {
      label: "Active Batches",
      value: totalBatches,
      icon: Layers,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      border: "border-emerald-100 dark:border-emerald-800",
      gradient: "from-emerald-500/10 to-teal-500/10",
    },
  ];

  const quickLinks = [
    { label: "Content Studio",       desc: "Upload & manage videos", href: "/teacher/studio",                 icon: UploadCloud, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Manage Batches",        desc: "View & edit your batches", href: "/teacher/creativity/batches",  icon: Layers,      color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Attendance",            desc: "Mark student attendance", href: "/teacher/creativity/attendance", icon: Calendar,    color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Community Posts",       desc: "Post announcements",      href: "/teacher/community",             icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
        {/* ── Hero Header ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-8 shadow-xl shadow-indigo-500/20">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge className="bg-white/20 text-white border-none mb-3 text-xs font-bold">
                🎓 Teacher Portal
              </Badge>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Welcome back, {displayName}!
              </h1>
              <p className="text-indigo-200 mt-2 text-base">
                Here&apos;s how your content is performing today.
              </p>
            </div>

            {/* Quick upload CTA */}
            <div className="shrink-0 w-full md:w-56">
              <UploadButton
                courses={analytics?.courses || []}
                batches={analytics?.batches || []}
                userEmail={session.user.email}
              />
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg, border, gradient }) => (
            <Card key={label} className={`border ${border} shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardContent className="p-5 relative">
                <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Quick Access Links ── */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(({ label, desc, href, icon: Icon, color, bg }) => (
              <Link key={href} href={href}>
                <Card className="border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg transition-all group cursor-pointer h-full">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors mt-0.5 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Community Post ── */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Community Announcements</p>
                  <p className="text-sm text-slate-500 mt-0.5">Keep your students updated with new posts.</p>
                </div>
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <SchedulePostButton />
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
