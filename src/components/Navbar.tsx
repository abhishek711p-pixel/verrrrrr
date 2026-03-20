"use client";

import Link from 'next/link';
import { BookOpen, GraduationCap, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-800/50'
        : 'py-5 bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:bg-indigo-500 transition-colors">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              PWIOI <span className="text-indigo-600 dark:text-indigo-400">EdTech</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 dark:text-slate-300">Home</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 dark:text-slate-300">About</Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
