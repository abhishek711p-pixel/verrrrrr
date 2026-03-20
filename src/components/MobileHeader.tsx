"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, LogOut, BookOpen, Video, Award, Presentation, MessageSquare, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  type: 'student' | 'teacher';
}

export function MobileHeader({ type }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const studentItems = [
    { href: "/student",         label: "Dashboard",      icon: BookOpen  },
    { href: "/student/courses", label: "My Courses",     icon: Video     },
    { href: "/student/exams",   label: "Test Scores",    icon: Award     },
  ];

  const teacherItems = [
    { href: "/teacher",           label: "Dashboard",       icon: Presentation },
    { href: "/teacher/studio",    label: "Content Studio",  icon: Video },
    { href: "/teacher/community", label: "Community",       icon: MessageSquare },
    { href: "/teacher/creativity", label: "Creativity",      icon: Lightbulb },
  ];

  const items = type === 'student' ? studentItems : teacherItems;
  const brandColor = type === 'student' ? 'text-indigo-600 dark:text-indigo-400' : 'text-cyan-400';
  const bgColor = type === 'student' ? 'bg-indigo-600' : 'bg-cyan-600';

  const isActive = (href: string) => 
    href === `/${type}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="md:hidden sticky top-0 left-0 right-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 font-black text-xl ${brandColor}`}>
          <GraduationCap className="h-6 w-6" />
          <span className="tracking-tighter uppercase">{type}</span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-600 dark:text-slate-400"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.href)
                    ? `${bgColor} text-white shadow-lg`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <form action="/api/auth/signout" method="POST">
                <Button
                  variant="ghost"
                  type="submit"
                  className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-3 px-4 rounded-xl"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-semibold">Sign Out</span>
                </Button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
