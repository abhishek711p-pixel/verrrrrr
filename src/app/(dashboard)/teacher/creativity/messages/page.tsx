import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherBatches, getTeacherMessages } from "@/actions/teacher";
import { TeacherSidebar } from "../../teacher-sidebar";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageManager } from "./message-manager";

export default async function TeacherMessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const batches = await getTeacherBatches(session.user.email);
  const messages = await getTeacherMessages(session.user.email);

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
               <Mail className="w-6 h-6 mr-2" />
               <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Teacher Inbox</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Send direct announcements and view message history to your batches.</p>
          </div>
          <Link href="/teacher/creativity">
            <Button variant="outline">Back to Creativity</Button>
          </Link>
        </header>

        <MessageManager 
            initialBatches={batches} 
            initialMessages={messages}
            email={session.user.email} 
        />
    </div>
  );
}
