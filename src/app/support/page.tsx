import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Mail, MessageSquare, Phone, MapPin, Send, HelpCircle, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1">
        <PageHeader 
          title="How can we help?" 
          description="Our support team is available 24/7 to assist you with any questions or issues you may have."
          badge="Support Center"
        />

        <section className="w-full py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-light mb-8">
                    Choose the most convenient way to reach us. We're always here to listen.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: <Mail className="h-5 w-5" />, title: "Email Us", detail: "support@pwioi.edu", sub: "Response within 24h" },
                    { icon: <MessageSquare className="h-5 w-5" />, title: "Live Chat", detail: "Available 24/7", sub: "Instant response" },
                    { icon: <Phone className="h-5 w-5" />, title: "Call Us", detail: "+1 (555) 123-4567", sub: "Mon-Fri, 9am-6pm EST" },
                    { icon: <MapPin className="h-5 w-5" />, title: "Our Office", detail: "123 Education Way", sub: "Silicon Valley, CA" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">{item.detail}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 p-10 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-[60px]"></div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send us a Message</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Full Name</label>
                      <Input placeholder="John Doe" className="h-12 rounded-xl focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Email Address</label>
                      <Input placeholder="john@example.com" type="email" className="h-12 rounded-xl focus:ring-indigo-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Subject</label>
                    <Input placeholder="How can we help?" className="h-12 rounded-xl focus:ring-indigo-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">Message</label>
                    <Textarea placeholder="Tell us more about your issue..." className="min-h-[150px] rounded-xl focus:ring-indigo-500 py-4" />
                  </div>
                  
                  <Button className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Send className="h-5 w-5 mr-3" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Quick Resources */}
            <div className="mt-32">
              <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">Quick Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: <HelpCircle className="h-8 w-8" />, title: "Knowledge Base", desc: "Detailed articles on how to use every feature of the platform." },
                  { icon: <Video className="h-8 w-8" />, title: "Video Tutorials", desc: "Step-by-step video guides for students and teachers." },
                  { icon: <FileText className="h-8 w-8" />, title: "User Manuals", desc: "Downloadable PDF guides for offline reference." }
                ].map((res, i) => (
                  <div key={i} className="p-8 rounded-[32px] bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all group cursor-pointer">
                    <div className="mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      {res.icon}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{res.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-light text-sm">{res.desc}</p>
                    <div className="mt-8 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      Explore Resources <Send className="h-3 w-3" />
                    </div>
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
