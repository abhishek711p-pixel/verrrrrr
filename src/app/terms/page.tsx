import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Terms of Service" 
          description="Last updated: March 20, 2026. Please read these terms carefully before using our platform."
        />

        <section className="w-full py-16 px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm prose dark:prose-invert">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">1. Acceptance of Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              By accessing or using PWIOI EdTech Platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">2. Use License</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              Permission is granted to temporarily access the materials (information or software) on our platform for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">3. Disclaimer</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              The materials on our platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">4. Limitations</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              In no event shall PWIOI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">5. Governing Law</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the State of California and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
