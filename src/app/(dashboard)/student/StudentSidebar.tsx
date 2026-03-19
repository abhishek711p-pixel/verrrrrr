"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Award, Compass, GraduationCap } from "lucide-react";

const navItems = [
  { href: "/student",         label: "Dashboard",      icon: BookOpen  },
  { href: "/student/courses", label: "My Courses",     icon: Video     },
  { href: "/student/exams",   label: "Test Scores",    icon: Award     },
];

export function StudentSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/student" ? pathname === "/student" : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 hidden md:flex flex-col relative z-20">
      {/* Logo */}
      <div className="p-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl text-indigo-600 dark:text-indigo-400 group">
          <GraduationCap className="h-8 w-8 transition-transform group-hover:scale-110" />
          <span className="tracking-tighter">STUDENT</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} passHref>
            <Button
              variant={isActive(href) ? "secondary" : "ghost"}
              className={`w-full justify-start h-11 px-4 rounded-xl transition-all duration-200 ${
                isActive(href)
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 font-medium"
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive(href) ? "animate-pulse" : ""}`} />
              {label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Sign-out at the bottom */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <form action="/api/auth/signout" method="POST">
          <Button
            variant="ghost"
            type="submit"
            className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
