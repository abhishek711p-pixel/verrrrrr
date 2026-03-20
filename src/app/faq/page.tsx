"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Plus, Minus, Search, HelpCircle, MessageCircle, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQS = [
  {
    category: "General",
    questions: [
      { q: "What is PWIOI EdTech?", a: "PWIOI is a premium direct-to-consumer educational platform that connects students with world-class educators for high-impact learning experiences." },
      { q: "How do I get started?", a: "Simply click on the 'Get Started' button on our landing page, choose your role (Student or Teacher), and follow the registration process. Students get a 3-day free trial on most plans." },
      { q: "Is there a mobile app?", a: "Our platform is fully responsive and works perfectly on mobile browsers. We are currently developing native iOS and Android apps, set to launch later this year." }
    ]
  },
  {
    category: "Courses & Enrollment",
    questions: [
      { q: "How long do I have access to a course?", a: "If you purchase a single course, you get lifetime access. If you are on a subscription plan, you have access as long as your subscription is active." },
      { q: "Can I switch courses after enrolling?", a: "Yes, within the first 7 days of enrollment, you can request to switch to a different course of equal or lesser value." },
      { q: "Do I get a certificate upon completion?", a: "Yes, every course on PWIOI comes with a verified digital certificate that you can share on LinkedIn or include in your resume." }
    ]
  },
  {
    category: "Payments & Refunds",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and various regional payment methods through our secure processor." },
      { q: "How does the 3-day free trial work?", a: "Your trial starts the moment you sign up. You won't be charged until the 3rd day. You can cancel anytime before then from your account settings." },
      { q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee for single course purchases if you are not satisfied with the content." }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const id = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Frequently Asked Questions" 
          description="Everything you need to know about the platform, courses, and more. Can't find an answer? Contact our support team."
          badge="Help Center"
        />

        <section className="w-full py-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Box */}
            <div className="relative mb-20 max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search for answers..." 
                className="h-16 pl-16 pr-6 rounded-[24px] border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg shadow-xl shadow-indigo-500/5 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-16">
              {FAQS.map((category, catIdx) => (
                <div key={catIdx}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 ml-2 flex items-center gap-3">
                    <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, qIdx) => {
                      const isOpen = openIndex === `${catIdx}-${qIdx}`;
                      return (
                        <div 
                          key={qIdx} 
                          className={`rounded-3xl border transition-all duration-300 ${
                            isOpen 
                              ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 shadow-lg' 
                              : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <button 
                            onClick={() => toggleFAQ(catIdx, qIdx)}
                            className="w-full px-8 py-6 flex items-center justify-between text-left"
                          >
                            <span className={`text-lg font-bold ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <Minus className="h-5 w-5 text-indigo-600 shrink-0" />
                            ) : (
                              <Plus className="h-5 w-5 text-slate-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                              <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Support CTA */}
            <div className="mt-32 p-12 rounded-[40px] bg-slate-900 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px]"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
                <p className="text-slate-400 mb-10 max-w-xl mx-auto">We're here to help. Reach out to our support team and we'll get back to you within 24 hours.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-bold underline">Chat with us</span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-400">
                    <HelpCircle className="h-6 w-6" />
                    <span className="font-bold underline">Visit Support Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
