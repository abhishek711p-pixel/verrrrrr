"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar as CalendarIcon, Save, CheckCircle2, XCircle, Clock, Settings, Search, GraduationCap, ChevronRight, LayoutDashboard, ArrowLeft, CheckCircle } from "lucide-react";
import { recordBatchAttendance } from "@/actions/teacher";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Phase = "SETUP" | "EXECUTION" | "SUMMARY";

export function AttendanceManager({ initialBatches, email }: { initialBatches: any[], email: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("SETUP");
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatches[0]?.id || "");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionResults, setSessionResults] = useState<{ total: number, present: number, absent: number } | null>(null);

  const selectedBatch = initialBatches.find(b => b.id === selectedBatchId);

  // Prefill attendance
  useEffect(() => {
    if (!selectedBatch) return;
    
    const newState: Record<string, string> = {};
    const selectedDateStr = new Date(date).toISOString().split('T')[0];

    selectedBatch.students.forEach((bs: any) => {
      const studentId = bs.student.id;
      const historicalRecord = bs.student.attendance?.find((a: any) => {
        const aDate = new Date(a.date).toISOString().split('T')[0];
        return aDate === selectedDateStr;
      });

      newState[studentId] = historicalRecord ? historicalRecord.status : 'PRESENT';
    });

    setAttendanceState(newState);
  }, [selectedBatchId, date, selectedBatch]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatchId || !date) return;
    
    setIsSaving(true);
    
    const records = Object.keys(attendanceState).map(studentId => ({
      studentId,
      status: attendanceState[studentId]
    }));

    const result = await recordBatchAttendance(email, selectedBatchId, date, records);
    
    if (result.success) {
      // Redirect immediately to the dashboard as per latest user request
      router.push("/teacher/creativity");
    } else {
      alert(result.error || "Failed to save attendance");
    }
    
    setIsSaving(false);
  };

  const handleMarkAllPresent = () => {
    if (!selectedBatch) return;
    const newState = { ...attendanceState };
    selectedBatch.students.forEach((bs: any) => {
      newState[bs.student.id] = 'PRESENT';
    });
    setAttendanceState(newState);
  };

  const filteredStudents = selectedBatch?.students?.filter((bs: any) => 
    bs.student.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bs.student.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (initialBatches.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-700" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No active batches</h3>
          <p className="text-slate-500">You need at least one batch with enrolled students to launch the attendance portal.</p>
          <Link href="/teacher/creativity/batches" className="mt-6 inline-block">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8">Manage Batches First</Button>
          </Link>
        </div>
      </div>
    );
  }

  // --- PHASE 1: SETUP ---
  if (phase === "SETUP") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
        <div className="w-full max-w-xl space-y-12 text-center">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-200 dark:border-indigo-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Guided Session Setup
               </div>
               <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">Attendance <span className="text-indigo-600 italic">Control</span></h1>
               <p className="text-slate-500 dark:text-slate-400 font-medium">Please select the batch and academic date to begin tracking participation.</p>
            </div>

            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
               <div className="h-2 bg-gradient-to-r from-indigo-500 to-emerald-500" />
               <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Cohort</label>
                        <select 
                          value={selectedBatchId}
                          onChange={(e) => setSelectedBatchId(e.target.value)}
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-base transition-all appearance-none cursor-pointer"
                        >
                          {initialBatches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                     </div>

                     <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operation Date</label>
                        <div className="flex items-center w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 group focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all cursor-pointer">
                          <CalendarIcon className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                          <input
                            type="date"
                            value={date}
                            min={new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent text-base w-full focus:outline-none dark:text-white font-bold cursor-pointer"
                          />
                        </div>
                     </div>
                  </div>

                  <Button 
                    onClick={() => setPhase("EXECUTION")}
                    size="lg"
                    className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-[0.98] group"
                  >
                    Launch Immersive Portal
                    <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </CardContent>
            </Card>

            <Link href="/teacher/creativity" className="inline-block">
               <Button variant="ghost" className="text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  Discard Session & Return
               </Button>
            </Link>
        </div>
      </div>
    );
  }

  // --- PHASE 2: EXECUTION ---
  if (phase === "EXECUTION") {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-hidden animate-in slide-in-from-right duration-500">
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-50">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setPhase("SETUP")}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors text-slate-400 hover:text-indigo-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded leading-none italic">PWIOI</span>
                 <h2 className="text-sm font-bold tracking-widest uppercase">{selectedBatch?.name} <span className="text-indigo-500">—</span> {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</h2>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 Synchronizing Live
              </div>
              <Button 
                onClick={handleSaveAttendance}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 font-black px-6 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all h-10"
              >
                {isSaving ? "Uploading..." : "Commit Records"}
              </Button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
               <div className="space-y-1">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Cohort Registry</h3>
                  <p className="text-slate-500 font-medium">Tracking participation for <span className="text-indigo-600 font-bold">{selectedBatch?.students?.length}</span> active members.</p>
               </div>

               <div className="w-full md:w-80 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Quick search identity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium"
                  />
               </div>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="py-20 text-center text-slate-300 dark:text-slate-700 font-black text-2xl uppercase tracking-[0.5em]">No Matches</div>
            ) : (
                <div className="space-y-4 pb-20">
                  {filteredStudents.map((bs: any, idx: number) => {
                    const st = bs.student;
                    const user = st.user;
                    const status = attendanceState[st.id] || 'PRESENT';

                    return (
                      <div key={bs.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-slate-300 text-xs">
                             {(idx + 1).toString().padStart(2, '0')}
                          </div>
                          <div>
                            <p className="text-xl font-black text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{user.name}</p>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-1.5">
                          {[
                            { id: 'PRESENT', label: 'Present', color: 'emerald' },
                            { id: 'ABSENT', label: 'Absent', color: 'rose' },
                            { id: 'LATE', label: 'Late', color: 'amber' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => handleStatusChange(st.id, opt.id)}
                              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none transition-all duration-300 ${
                                status === opt.id 
                                  ? `bg-white dark:bg-slate-800 text-${opt.color}-600 dark:text-${opt.color}-400 shadow-xl shadow-${opt.color}-500/10 transform scale-[1.05]` 
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
            )}
        </main>
      </div>
    );
  }

  // --- PHASE 3: SUMMARY ---
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-950/10 animate-in zoom-in duration-500">
        <div className="w-full max-w-2xl text-center space-y-12">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
               <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <div className="space-y-4">
               <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white italic capitalize">Synchronized Successfully</h1>
               <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Session records for <span className="font-bold text-indigo-600">{selectedBatch?.name}</span> have been committed to the PWIOI registry.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Directory</p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">{sessionResults?.total || 0}</p>
               </div>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-b-4 border-b-emerald-500 border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Present Today</p>
                  <p className="text-4xl font-black text-emerald-600">{sessionResults?.present || 0}</p>
               </div>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-b-4 border-b-rose-500 border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Absent Registry</p>
                  <p className="text-4xl font-black text-rose-600">{sessionResults?.absent || 0}</p>
               </div>
            </div>

            <div className="pt-8">
               <Link href="/teacher/creativity">
                  <Button size="lg" className="h-16 px-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                    <LayoutDashboard className="mr-3 w-6 h-6" />
                    MOVE OUT TO CORE
                  </Button>
               </Link>
            </div>
        </div>
    </div>
  );
}
