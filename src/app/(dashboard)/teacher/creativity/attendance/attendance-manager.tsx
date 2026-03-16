"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar as CalendarIcon, Save, CheckCircle2, XCircle, Clock } from "lucide-react";
import { recordBatchAttendance } from "@/actions/teacher";

export function AttendanceManager({ initialBatches, email }: { initialBatches: any[], email: string }) {
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatches[0]?.id || "");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const selectedBatch = initialBatches.find(b => b.id === selectedBatchId);

  // When batch or date changes, try to prefill attendance if records exist for that date
  useEffect(() => {
    if (!selectedBatch) return;
    
    const newState: Record<string, string> = {};
    const selectedDateStr = new Date(date).toISOString().split('T')[0];

    selectedBatch.students.forEach((bs: any) => {
      const studentId = bs.student.id;
      // Find historical record for this date
      const historicalRecord = bs.student.attendance?.find((a: any) => {
        const aDate = new Date(a.date).toISOString().split('T')[0];
        return aDate === selectedDateStr;
      });

      if (historicalRecord) {
        newState[studentId] = historicalRecord.status;
      } else {
        newState[studentId] = 'PRESENT'; // default
      }
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
      alert("Attendance saved successfully!");
      // Ideally we would refresh the data here to fetch the new records from the DB,
      // but the local state is already accurate so it's fine for now without a full reload.
    } else {
      alert(result.error || "Failed to save attendance");
    }
    
    setIsSaving(false);
  };

  if (initialBatches.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Batches Available</h3>
        <p className="mt-1 text-sm text-slate-500">You need batches of students to mark attendance.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Class Settings</CardTitle>
            <CardDescription>Select a batch and date to view or mark attendance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Batch</label>
              <select 
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {initialBatches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <div className="flex items-center w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
                <CalendarIcon className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <Button 
                onClick={handleSaveAttendance}
                disabled={isSaving || !selectedBatch?.students?.length}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
            >
              {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Attendance</>}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Roster List */}
      <div className="lg:col-span-3">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <div>
              <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400">Class Roster</CardTitle>
              <CardDescription className="mt-1">{selectedBatch?.name}</CardDescription>
            </div>
            <div className="text-sm text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </CardHeader>
          <CardContent className="p-0">
             {(!selectedBatch?.students || selectedBatch.students.length === 0) ? (
                <div className="p-8 text-center text-slate-500">
                  There are no students enrolled in this batch yet.
                </div>
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">Student Info</th>
                        <th className="px-6 py-4 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedBatch.students.map((bs: any) => {
                        const st = bs.student;
                        const user = st.user;
                        const status = attendanceState[st.id] || 'PRESENT';

                        return (
                          <tr key={bs.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-900 dark:text-white text-base">{user.name}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleStatusChange(st.id, 'PRESENT')}
                                    className={`px-4 py-2 rounded-l-md border text-xs font-medium focus:outline-none transition-colors ${
                                      status === 'PRESENT' 
                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500' 
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Present</div>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleStatusChange(st.id, 'ABSENT')}
                                    className={`px-4 py-2 border-y border-x text-xs font-medium focus:outline-none transition-colors ${
                                      status === 'ABSENT' 
                                        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700 ring-1 ring-rose-500' 
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center"><XCircle className="w-3.5 h-3.5 mr-1" /> Absent</div>
                                  </button>

                                  <button
                                    onClick={() => handleStatusChange(st.id, 'LATE')}
                                    className={`px-4 py-2 rounded-r-md border text-xs font-medium focus:outline-none transition-colors ${
                                      status === 'LATE' 
                                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 ring-1 ring-amber-500' 
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Late</div>
                                  </button>
                               </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
