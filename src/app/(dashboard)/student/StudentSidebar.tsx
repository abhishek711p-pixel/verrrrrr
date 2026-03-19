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
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 font-extrabold text-xl text-indigo-600 dark:text-indigo-400">
          <GraduationCap className="h-6 w-6" />
          <span>Student Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} passHref>
            <Button
              variant={isActive(href) ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                isActive(href)
                  ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
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
