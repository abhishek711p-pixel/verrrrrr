import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Briefcase, MapPin, Clock, ArrowRight, Rocket, Users, Heart, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const JOBS = [
  {
    title: "Senior Fullstack Engineer",
    department: "Engineering",
    location: "Remote / Silicon Valley",
    type: "Full-time",
    icon: <Rocket className="h-5 w-5" />
  },
  {
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Curriculum Designer",
    department: "Education",
    location: "New York, NY",
    type: "Full-time",
    icon: <Heart className="h-5 w-5" />
  },
  {
    title: "Technical Support Lead",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    icon: <Coffee className="h-5 w-5" />
  }
];

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="Join the Learning Revolution" 
          description="Help us build the future of education. We're looking for passionate individuals to join our global team."
          badge="We're Hiring!"
        />

        {/* Culture Section */}
        <section className="w-full py-24 px-6 overflow-hidden relative">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -translate-y-1/2"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Life at PWIOI</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-light max-w-2xl mx-auto">
                We're a distributed team of educators, engineers, and designers who believe in the power of direct-to-consumer learning.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Remote-First", desc: "Work from anywhere in the world. We value output over office hours.", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=60" },
                { title: "Lifelong Learning", desc: "Every employee gets a generous budget for books, courses, and conferences.", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60" },
                { title: "Health & Wellness", desc: "Comprehensive health insurance and a focus on mental well-being.", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=60" }
              ].map((item, i) => (
                <div key={i} className="group overflow-hidden rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-video overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-light text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs List */}
        <section className="w-full py-24 bg-slate-900 text-white relative px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Open Positions</h2>
                <p className="text-slate-400 text-lg font-light">Join us in these exciting roles and make an impact.</p>
              </div>
              <Badge className="bg-indigo-600 text-white border-none py-1.5 px-4 rounded-full text-sm">
                4 Openings
              </Badge>
            </div>
            
            <div className="space-y-4">
              {JOBS.map((job, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-white/10 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:scale-110 transition-transform">
                      {job.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-light">
                        <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {job.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-2xl border-white/20 hover:bg-white hover:text-slate-900 font-bold px-8">
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <p className="text-slate-400 italic">Don't see a role for you? Send us your resume at <span className="text-indigo-400 underline font-medium">careers@pwioi.edu</span></p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
