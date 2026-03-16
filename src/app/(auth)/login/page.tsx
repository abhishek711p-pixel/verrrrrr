"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Presentation, Loader2 } from "lucide-react";

function LoginForm({ isSignUp, setIsSignUp }: { isSignUp: boolean, setIsSignUp: (val: boolean) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'TEACHER' : 'STUDENT';
  
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(defaultRole as 'STUDENT' | 'TEACHER');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // For sign up, we could hit the /api/auth/register endpoint first, 
      // but since our NextAuth provider automatically registers the user behind the scenes
      // during signIn() if they don't exist, we can just use signIn and pass the name.
      // Note: We need to modify our NextAuth config to accept and pass the 'name' field if we want it preserved during auto-generation.
      // For now, NextAuth will auto-register them with their email prefix as name, but let's pass it anyway.
      
      const result = await signIn("credentials", {
        name: isSignUp ? name : undefined,
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        console.error(result.error);
        setIsLoading(false);
        return;
      }

      router.push(role === 'TEACHER' ? '/teacher' : '/student');
      router.refresh();
    } catch (error) {
      console.error(error);
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
            {isSignUp ? "Create a new account to get started" : "Enter your credentials to access your dashboard"}
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

        <form onSubmit={onSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="h-11"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button 
            className={`w-full h-11 text-base font-semibold ${role === 'TEACHER' ? 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'}`} 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading 
              ? (isSignUp ? "Creating account..." : "Signing in...") 
              : (isSignUp ? "Create Account" : "Sign in")
            }
          </Button>
        </form>
      </CardContent>
    </>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-2xl relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        }>
          <LoginForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
        </Suspense>
        
        <CardFooter className="flex justify-center pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="font-semibold text-slate-900 hover:underline dark:text-white"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </CardFooter>
      </Card>
      
      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
    </div>
  );
}
