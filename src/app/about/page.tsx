import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Award, Target, Users, Heart, GraduationCap, Microscope } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 px-6 sm:px-12">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Our Story & Mission" 
          description="We're on a mission to democratize premium education by connecting passionate students directly with world-class experts."
          badge="About PWIOI"
        />

        {/* Mission & Vision Section */}
        <section className="w-full py-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Pioneering the Next <br/> 
                <span className="text-indigo-600 dark:text-indigo-400">Generation of Learning</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                Founded in 2024, PWIOI was born out of a simple observation: the best teachers are often the hardest to reach. We built a platform that bridges this gap, creating a seamless, interactive, and premium learning environment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Target className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Our Mission</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light">To make expert-led education accessible to anyone, anywhere.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Award className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Our Vision</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light">To become the global gold standard for direct-to-consumer learning.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl z-10">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60" 
                  alt="Team collaboration"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-indigo-600 rounded-[40px] -z-10 translate-x-4 translate-y-4 opacity-20"></div>
              {/* Floating Stat Card */}
              <div className="absolute -top-10 -left-10 p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 z-20 animate-bounce duration-[3000ms]">
                <div className="text-3xl font-black text-indigo-600">50k+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Students</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-24 bg-slate-900 text-white rounded-[60px] my-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[120px]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Values That Drive Us</h2>
              <p className="text-indigo-200 text-lg font-light max-w-2xl mx-auto">Our culture is built on a foundation of excellence, empathy, and innovation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: <Heart className="h-6 w-6" />, title: "Student First", desc: "Every decision we make starts with how it benefits the learner." },
                { icon: <GraduationCap className="h-6 w-6" />, title: "Quality Always", desc: "We never compromise on the depth and accuracy of our content." },
                { icon: <Users className="h-6 w-6" />, title: "Inclusivity", desc: "We believe diverse perspectives lead to better learning outcomes." },
                { icon: <Microscope className="h-6 w-6" />, title: "Relentless R&D", desc: "We're constantly experimenting with new ways to teach online." }
              ].map((val, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="mb-6 text-indigo-400">{val.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-32">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-20 leading-tight">
              Leading the <span className="text-indigo-600">Revolution</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { name: "John Doe", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60" },
                { name: "Jane Smith", role: "Head of Content", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60" },
                { name: "Alex Johnson", role: "CTO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60" }
              ].map((member, i) => (
                <div key={i} className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="h-64 w-64 rounded-[40px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src={member.img} alt={member.name} className="object-cover w-full h-full" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
