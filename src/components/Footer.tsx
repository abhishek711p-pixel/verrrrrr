import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, GraduationCap, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                PWIOI <span className="text-indigo-600 dark:text-indigo-400">EdTech</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Pioneering the next generation of education with premium, expert-led learning experiences.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/pricing" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">General FAQ</Link></li>
              <li><Link href="/support" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Support Center</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="h-4 w-4 text-indigo-600" />
                hello@pwioi.edu
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Phone className="h-4 w-4 text-indigo-600" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 PWIOI EdTech Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-400">Security Verified</span>
            <span className="text-xs text-slate-400">SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
