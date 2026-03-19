"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Presentation, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await registerUser({ name, email, password, role });
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/login?email=${email}&role=${role.toLowerCase()}`);
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 selection:bg-indigo-500/30">
      <Card className="w-full max-w-md shadow-3xl relative overflow-hidden border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl transition-all duration-300 hover:shadow-indigo-500/10">
        <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${role === 'TEACHER' ? 'bg-cyan-500' : 'bg-indigo-600'}`}></div>
        
        <CardHeader className="space-y-4 pt-8 text-center">
          <div className="flex justify-center mb-2">
            <div className={`p-4 rounded-xl ${role === 'TEACHER' ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
              {role === 'TEACHER' ? <Presentation size={32} /> : <BookOpen size={32} />}
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            Create Account
          </CardTitle>
          <CardDescription>
            Join our premium learning community
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Role Switcher */}
          <div className="relative flex p-1 mb-8 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-all duration-300 ease-out z-0 ${role === 'TEACHER' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
            />
            <button
              onClick={() => setRole('STUDENT')}
              className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10 ${role === 'STUDENT' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
            >
              As Student
            </button>
            <button
              onClick={() => setRole('TEACHER')}
              className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10 ${role === 'TEACHER' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
            >
              As Teacher
            </button>
          </div>
 
           {error && (
             <div className="mb-6 p-3 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 animate-pulse" />
                {error}
             </div>
           )}
 
           {success && (
             <div className="mb-6 p-4 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 flex flex-col items-center gap-3 text-center animate-in fade-in zoom-in duration-300">
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-base">Account created successfully!</p>
                  <p className="opacity-80 pt-1 text-xs">Redirecting you to login...</p>
                </div>
             </div>
           )}
 
           {!success && (
             <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-white/50 dark:bg-slate-900/50" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white/50 dark:bg-slate-900/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10 bg-white/50 dark:bg-slate-900/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

              <Button 
                type="submit" 
                className={`w-full h-11 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${role === 'TEACHER' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-inner">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Button variant="link" onClick={() => router.push('/login')} className="p-0 h-auto font-bold text-indigo-600 dark:text-indigo-400">
              Sign In
            </Button>
          </p>
        </CardFooter>
      </Card>

      {/* Decorative Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
    </div>
  );
}
