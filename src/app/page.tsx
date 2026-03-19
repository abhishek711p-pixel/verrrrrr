import Link from 'next/link';
import { ArrowRight, BookOpen, Presentation, GraduationCap, Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="h-6 w-6" />
            <span>PWIOI EdTech</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Courses</Link>
            <Link href="/instructors" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Instructors</Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
            <Link href="/login?role=student">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-9 px-4 rounded-xl font-bold">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
        {/* ... Hero Section ... */}
        <div className="relative max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 zoom-in-95 mt-16 md:mt-12">
          {/* ... Hero Content ... */}
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
            Empowering the Future of Learning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm leading-[1.1]">
            Master your skills with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
              World-Class Educators
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            A premium educational platform connecting passionate students directly with expert teachers. Start your 3-day free trial and experience the difference.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/login?role=student" 
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 font-semibold text-white transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400"
            >
              <BookOpen className="h-5 w-5" />
              Join as Student
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-[800px] opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute inset-x-0 mx-auto w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-300 blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="h-8 w-8" />
                <span>PWIOI EdTech</span>
              </Link>
              <p className="max-w-md text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Empowering the next generation of creators through high-quality, direct-to-student educational experiences with the world&apos;s best instructors.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"><Twitter size={20}/></Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"><Linkedin size={20}/></Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"><Github size={20}/></Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"><Facebook size={20}/></Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-sm tracking-widest">Platform</h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Courses</Link></li>
                <li><Link href="/instructors" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Our Instructors</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing Plans</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-sm tracking-widest">Resource</h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Learning Blog</Link></li>
                <li><Link href="/help" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2026 PWIOI EdTech Platform. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
