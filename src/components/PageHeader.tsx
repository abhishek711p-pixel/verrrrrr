import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

export default function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <section className="relative w-full py-20 px-6 flex flex-col items-center justify-center text-center overflow-hidden bg-slate-50 dark:bg-slate-950 mt-16">
      <div className="relative max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {badge && (
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
            {badge}
          </div>
        )}
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
          {description}
        </p>
      </div>
      
      {/* Decorative modern background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-300 blur-[80px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>
    </section>
  );
}
