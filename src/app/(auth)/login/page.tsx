"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Presentation, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'TEACHER' : 'STUDENT';
  
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(defaultRole as 'STUDENT' | 'TEACHER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
        if (result.error === "INVALID_CREDENTIALS" || result.error === "CredentialsSignin") {
          setError("Invalid login credentials. Please check your email and password.");
        } else {
          setError("Access denied. Please ensure your account is pre-registered.");
        }
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
        <div className="flex p-1 mb-8 rounded-lg bg-slate-100 dark:bg-slate-900">
          <button
            onClick={() => setRole('STUDENT')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'STUDENT' ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('TEACHER')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'TEACHER' ? 'bg-white text-cyan-600 shadow-sm dark:bg-slate-800 dark:text-cyan-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
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
            <Input
              id="u_secret"
              name="u_secret"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
              autoComplete="new-password-field"
            />
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-2xl relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        }>
          <LoginForm />
        </Suspense>
        
        <CardFooter className="flex justify-center pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center px-6">
            Access to this platform is restricted to authorized users only. Please contact your administrator if you cannot sign in.
          </p>
        </CardFooter>
      </Card>
      
      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
    </div>
  );
}
