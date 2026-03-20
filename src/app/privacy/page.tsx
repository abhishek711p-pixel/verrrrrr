import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Privacy Policy" 
          description="Last updated: March 20, 2026. We value your privacy and are committed to protecting your personal data."
        />

        <section className="w-full py-16 px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-12 md:p-20 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm prose dark:prose-invert">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">1. Information We Collect</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              We collect information you provide directly to us when you create an account, enroll in a course, or communicate with our support team. This may include your name, email address, payment information, and educational preferences.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">2. How We Use Your Information</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, and respond to your comments and questions.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">3. Data Security</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">4. Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
              We use cookies and similar technologies to track activity on our service and hold certain information to improve your user experience.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">5. Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <span className="text-indigo-600 underline">privacy@pwioi.edu</span>.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
