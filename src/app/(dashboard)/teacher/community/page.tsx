import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCommunityPosts, getTeacherBatches } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Presentation, Video, LogOut, Settings, MessageSquare } from "lucide-react";
import Link from "next/link";
import { CommunityManager } from "./community-manager";
import { TeacherSidebar } from "../teacher-sidebar";

export default async function TeacherCommunityPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const posts = await getCommunityPosts(session.user.email);
  const batches = await getTeacherBatches(session.user.email);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <TeacherSidebar activeTab="community" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Community & Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep your students engaged with updates and schedules.</p>
        </header>

        <CommunityManager initialPosts={posts} email={session.user.email} batches={batches} />
      </main>
    </div>
  );
}
