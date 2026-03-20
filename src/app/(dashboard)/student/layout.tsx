import { StudentSidebar } from "./StudentSidebar";
import { MobileHeader } from "@/components/MobileHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-slate-950 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl mix-blend-multiply pointer-events-none -z-10" />
      
      <MobileHeader type="student" />
      <StudentSidebar />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
