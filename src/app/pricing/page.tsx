import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Check, Zap, Shield, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PLANS = [
  {
    name: "Student Starter",
    price: "$29",
    description: "Perfect for students just starting their journey with expert-led learning.",
    features: [
      "Access to 5 basic courses",
      "Community forum access",
      "Standard support",
      "Course completion certificates",
      "3-day free trial"
    ],
    cta: "Start Free Trial",
    popular: false,
    icon: <Zap className="h-6 w-6 text-indigo-600" />
  },
  {
    name: "Premium Learner",
    price: "$79",
    description: "Our most popular plan for serious students who want full access.",
    features: [
      "Unlimited access to all courses",
      "Direct Q&A with instructors",
      "Priority community access",
      "1-on-1 monthly mentorship call",
      "Advanced certification paths",
      "3-day free trial"
    ],
    cta: "Get Premium Access",
    popular: true,
    icon: <Star className="h-6 w-6 text-purple-600" />
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for organizations and large educational cohorts.",
    features: [
      "Bulk student seat licenses",
      "Dedicated account manager",
      "Custom curriculum design",
      "Advanced cohort analytics",
      "API access for LMS integration",
      "24/7 dedicated support"
    ],
    cta: "Contact Sales",
    popular: false,
    icon: <Crown className="h-6 w-6 text-amber-600" />
  }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Simple, Transparent Pricing" 
          description="Choose the plan that's right for you. All student plans start with a 3-day free trial."
          badge="Flexible Plans"
        />

        <section className="w-full py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {PLANS.map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-[40px] border transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-slate-900 text-white border-indigo-500 shadow-2xl scale-105 z-10' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-8 p-3 inline-block rounded-2xl bg-slate-100 dark:bg-slate-800">
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                  
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.price !== "Custom" && "/month"}
                    </span>
                  </div>
                  
                  <Button asChild className={`w-full h-14 rounded-2xl font-bold text-lg mb-8 transition-transform hover:scale-105 active:scale-95 ${
                    plan.popular 
                      ? 'bg-white text-slate-900 hover:bg-indigo-400' 
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-400'
                  }`}>
                    <Link href="/login">{plan.cta}</Link>
                  </Button>
                  
                  <div className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className={`h-5 w-5 mt-0.5 shrink-0 ${plan.popular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <span className={`text-sm ${plan.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing FAQ context */}
            <div className="mt-32 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-12 font-light">
                Have questions about our plans? Check out our <Link href="/faq" className="text-indigo-600 underline font-medium">detailed FAQ</Link> or contact our support team.
              </p>
              
              <div className="grid grid-cols-1 gap-6 text-left">
                {[
                  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time from your dashboard. Your access will continue until the end of your current billing period." },
                  { q: "How does the 3-day free trial work?", a: "When you sign up, you'll get full access to the selected plan's features for 3 days. We won't charge you until the trial ends, and you can cancel anytime before then." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.q}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
