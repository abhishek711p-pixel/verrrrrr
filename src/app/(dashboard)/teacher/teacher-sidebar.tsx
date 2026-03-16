import { Button } from "@/components/ui/button";
import { Presentation, Video, LogOut, Settings, MessageSquare, Lightbulb } from "lucide-react";
import Link from "next/link";

export function TeacherSidebar({ activeTab = "dashboard" }: { activeTab?: "dashboard" | "studio" | "settings" | "community" | "creativity" }) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 font-bold text-xl text-cyan-400">
          <Presentation className="h-6 w-6" />
          <span>Teacher Portal</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/teacher" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start cursor-pointer hover:bg-slate-800 hover:text-white ${activeTab === 'dashboard' ? 'bg-slate-800 text-cyan-400' : ''}`}
          >
            <Presentation className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>
        <Link href="/teacher/studio" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start cursor-pointer hover:bg-slate-800 hover:text-white ${activeTab === 'studio' ? 'bg-slate-800 text-cyan-400' : ''}`}
          >
            <Video className="mr-2 h-4 w-4" /> Content Studio
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className={`w-full justify-start cursor-pointer hover:bg-slate-800 hover:text-white ${activeTab === 'settings' ? 'bg-slate-800 text-cyan-400' : ''}`}
        >
          <Settings className="mr-2 h-4 w-4" /> Revenue Settings
        </Button>
        <Link href="/teacher/community" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start cursor-pointer hover:bg-slate-800 hover:text-white ${activeTab === 'community' ? 'bg-slate-800 text-cyan-400' : ''}`}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Community Posts
          </Button>
        </Link>
        <Link href="/teacher/creativity" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start cursor-pointer hover:bg-slate-800 hover:text-white ${activeTab === 'creativity' ? 'bg-slate-800 text-cyan-400' : ''}`}
          >
            <Lightbulb className="mr-2 h-4 w-4" /> Teacher Creativity
          </Button>
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <form action="/api/auth/signout" method="POST">
          <Button variant="ghost" type="submit" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
