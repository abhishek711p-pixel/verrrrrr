"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser, requestTrialAccess } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Presentation, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'TEACHER' : 'STUDENT';
  
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(defaultRole as 'STUDENT' | 'TEACHER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid login credentials. Please check your email and password.");
        setIsLoading(false);
        return;
      }

      router.push(role === 'TEACHER' ? '/teacher' : '/student');
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${role === 'TEACHER' ? 'bg-cyan-500' : 'bg-indigo-600'}`}></div>
      
      <CardHeader className="space-y-4 pt-8">
        <div className="flex justify-center mb-2">
          <div className={`p-4 rounded-full ${role === 'TEACHER' ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
            {role === 'TEACHER' ? <Presentation size={32} /> : <BookOpen size={32} />}
          </div>
        </div>
        <div className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {role === 'TEACHER' ? 'Teacher Portal' : 'Student Portal'}
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative flex p-1 mb-8 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-all duration-300 ease-out z-0 ${role === 'TEACHER' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
          />
          <button
            onClick={() => setRole('STUDENT')}
            className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10 ${role === 'STUDENT' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('TEACHER')}
            className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors z-10 ${role === 'TEACHER' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
          >
            Teacher
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 animate-pulse" />
             {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
          {/* Dummy inputs to trick browser autofill */}
          <input type="text" style={{ display: 'none' }} name="fake_email" />
          <input type="password" style={{ display: 'none' }} name="fake_password" />
          
          <div className="space-y-2">
            <Label htmlFor="u_identity">Email address</Label>
              <Input
                id="u_identity"
                name="u_identity"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                autoComplete="new-user-id"
              />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="u_secret"
                name="u_secret"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                autoComplete="new-password-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button 
            className={`w-full h-11 text-base font-semibold ${role === 'TEACHER' ? 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'}`} 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRequest(true);
    try {
      await requestTrialAccess(requestEmail);
      setIsRequestingAccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 selection:bg-indigo-500/30">
      <Card className="w-full max-w-md shadow-3xl relative overflow-hidden border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl transition-all duration-300 hover:shadow-indigo-500/10">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        }>
          <LoginForm />
        </Suspense>
        
        <CardFooter className="flex flex-col gap-4 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center px-6">
            Join thousands of students and teachers on our world-class learning platform.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/register')}
              className="w-full h-10 text-sm font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              New here? Create an account
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                  Or request 3-day trial access <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">Request Trial Access</DialogTitle>
                <DialogDescription className="pt-2">
                  Want to explore the platform before creating a full account? Enter your email below to request a 3-day free trial.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {!isRequestingAccess ? (
                    <form onSubmit={handleRequestAccess} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="request-email">Work Email</Label>
                        <Input 
                          id="request-email" 
                          type="email" 
                          placeholder="you@company.com" 
                          value={requestEmail}
                          onChange={(e) => setRequestEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmittingRequest}>
                        {isSubmittingRequest ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSubmittingRequest ? "Sending..." : "Request Access"}
                      </Button>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                      <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={40} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Request Sent!</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 pt-1">
                          We&apos;ve received your request. Our team will review it and get back to you within 24 hours.
                        </p>
                      </div>
                      <Button onClick={() => setIsRequestingAccess(false)} variant="outline" className="mt-2">Done</Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
      
      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
    </div>
  );
}
