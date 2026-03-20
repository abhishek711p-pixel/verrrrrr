import Link from 'next/link';
import { ArrowRight, BookOpen, Presentation, Shield, Zap, Globe, Award, Star, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="relative max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 zoom-in-95 mt-16">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
              Pioneering the Future of Learning
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-20 dark:opacity-10 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-300 blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '6s' }}></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-white dark:bg-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-950 dark:text-white mb-6">Why Choose PWIOI?</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">We provide a premium ecosystem for both learners and educators to thrive together.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-8 w-8 text-indigo-600" />,
                  title: "Verified Experts",
                  description: "Every teacher on our platform undergoes a rigorous verification process to ensure quality."
                },
                {
                  icon: <Zap className="h-8 w-8 text-purple-600" />,
                  title: "Instant Access",
                  description: "Start learning immediately with our zero-friction registration and enrollment flow."
                },
                {
                  icon: <Globe className="h-8 w-8 text-cyan-600" />,
                  title: "Global Community",
                  description: "Connect with peers and mentors from around the world in our interactive batches."
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm hover:border-indigo-500 transition-all duration-300 group">
                  <div className="mb-6 p-3 inline-block rounded-2xl bg-white dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-950 dark:text-white mb-6">Trusted by Thousands</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Hear what our community of students and teachers has to say about their experience.</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-indigo-500 text-indigo-500" />)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "The direct connection with experts changed everything for me. I learned more in 3 months here than in a year of self-study.",
                  author: "Sarah J.",
                  role: "Postgrad Student"
                },
                {
                  quote: "As a teacher, the tools provided to manage my batches and track student progress are world-class. It's so easy to focus on teaching.",
                  author: "Dr. Robert M.",
                  role: "Mathematics Lead"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                  <p className="text-xl italic text-slate-800 dark:text-slate-200 mb-8 font-serif">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{testimonial.author}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="p-12 md:p-20 rounded-[40px] bg-slate-900 dark:bg-slate-900 text-center text-white border border-white/10 shadow-2xl overflow-hidden relative">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20"></div>
              
              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">Ready to start your <br /> educational journey?</h2>
                <p className="text-indigo-200 text-lg md:text-xl font-light max-w-2xl mx-auto">Join the premium community of learners and educators today and transform your future.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/login" className="px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
                    Get Started Now
                  </Link>
                  <p className="text-sm text-indigo-300 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    3-day free trial included
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-50 dark:bg-slate-950"></div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
