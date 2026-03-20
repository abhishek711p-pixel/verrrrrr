"use client";

import { Button } from "@/components/ui/button";
import { Presentation, Video, LogOut, MessageSquare, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TeacherSidebar() {
  const pathname = usePathname();
  
  const isActive = (href: string) => 
    href === "/teacher" ? pathname === "/teacher" : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 hidden md:flex flex-col relative z-20">
      <div className="p-8 border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl text-cyan-400 group">
          <Presentation className="h-8 w-8 transition-transform group-hover:scale-110" />
          <span className="tracking-tighter">TEACHER</span>
        </Link>
      </div>
      <nav className="flex-1 p-6 space-y-2">
        <Link href="/teacher" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-11 px-4 rounded-xl transition-all duration-200 ${isActive('/teacher') ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-700' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 font-medium'}`}
          >
            <Presentation className={`mr-3 h-5 w-5 ${isActive('/teacher') ? 'animate-pulse' : ''}`} /> Dashboard
          </Button>
        </Link>
        <Link href="/teacher/studio" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-11 px-4 rounded-xl transition-all duration-200 ${isActive('/teacher/studio') ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-700' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 font-medium'}`}
          >
            <Video className={`mr-3 h-5 w-5 ${isActive('/teacher/studio') ? 'animate-pulse' : ''}`} /> Content Studio
          </Button>
        </Link>
        <Link href="/teacher/community" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-11 px-4 rounded-xl transition-all duration-200 ${isActive('/teacher/community') ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-700' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 font-medium'}`}
          >
            <MessageSquare className={`mr-3 h-5 w-5 ${isActive('/teacher/community') ? 'animate-pulse' : ''}`} /> Community Posts
          </Button>
        </Link>
        <Link href="/teacher/creativity" passHref>
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-11 px-4 rounded-xl transition-all duration-200 ${isActive('/teacher/creativity') ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-700' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/30 font-medium'}`}
          >
            <Lightbulb className={`mr-3 h-5 w-5 ${isActive('/teacher/creativity') ? 'animate-pulse' : ''}`} /> Teacher Creativity
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
