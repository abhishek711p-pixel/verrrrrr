import Link from 'next/link';
import { ArrowRight, BookOpen, Presentation } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Hero Section */}
        <div className="relative max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 zoom-in-95 mt-16 md:mt-24">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
            Empowering the Future of Learning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
            Master your skills with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
              World-Class Educators
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            A premium D2C educational platform connecting passionate students directly with expert teachers. Start your 3-day free trial today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {/* Student CTA */}
            <Link 
              href="/login?role=student" 
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 font-semibold text-white transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400"
            >
              <BookOpen className="h-5 w-5" />
              Join as Student
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Teacher CTA */}
            <Link 
              href="/login?role=teacher" 
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm px-8 font-semibold text-slate-900 transition-all hover:border-indigo-500 hover:bg-slate-50 hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:hover:border-cyan-400 dark:hover:bg-slate-900"
            >
              <Presentation className="h-5 w-5" />
              Teach on Platform
            </Link>
          </div>
        </div>
        
        {/* Decorative modern background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-300 blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>
      </main>
    </div>
  );
}
