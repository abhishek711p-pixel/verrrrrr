"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ChevronDown, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddStudentDialog, DismissBatchDialog, CreateBatchDialog } from "./BatchForms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Batch {
  id: string;
  name: string;
  description: string | null;
  students: any[];
}

export function BatchHub({ batches, teacherEmail, totalUniqueStudents }: { batches: any[], teacherEmail: string, totalUniqueStudents: number }) {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(
    batches.length > 0 ? batches[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  const filteredStudents = selectedBatch?.students.filter((bs: any) => {
    const name = bs.student.user.name || "";
    const email = bs.student.user.email || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           email.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      {/* Selection Control */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-tight">Active Batch:</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-[300px] justify-between h-11 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <span className="flex items-center gap-2 truncate">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  {selectedBatch?.name || "Select a Batch"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto">
              {batches.map((batch) => (
                <DropdownMenuItem 
                  key={batch.id} 
                  onClick={() => setSelectedBatchId(batch.id)}
                  className="flex justify-between items-center py-2 focus:bg-indigo-50 dark:focus:bg-indigo-900/30"
                >
                  <span className="font-semibold">{batch.name}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                    {batch.students.length} Students
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search student name or email..." 
            className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {selectedBatch ? (
        <>
        <Card className="border-slate-200 dark:border-slate-800 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* ── Batch Header ── */}
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 space-y-4">
            {/* Title row */}
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-3">
                {selectedBatch.name}
                <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Active Session
                </span>
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                {selectedBatch.description || "Management view for this cohort."}
              </CardDescription>
            </div>

            {/* ── Action bar (clearly separated, full-width) ── */}
            <div className="flex flex-wrap items-center gap-3 w-full pt-4 border-t border-slate-200 dark:border-slate-800">
              <AddStudentDialog
                teacherEmail={teacherEmail}
                batchId={selectedBatch.id}
                batchName={selectedBatch.name}
              />
              
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

              <CreateBatchDialog 
                teacherEmail={teacherEmail} 
                suggestedStudentCount={totalUniqueStudents}
              />

              <div className="sm:ml-auto flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <DismissBatchDialog
                  teacherEmail={teacherEmail}
                  batchId={selectedBatch.id}
                  batchName={selectedBatch.name}
                />
              </div>
            </div>

            {/* Stats mini-row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Enrolled</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{selectedBatch.students.length}</div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Attendance</div>
                <div className="text-xl font-bold text-emerald-600">--%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/20">
                    <tr>
                      <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">No.</th>
                      <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">Student Identity</th>
                      <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">Contact Details</th>
                      <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((bs: any, index: number) => (
                      <tr key={bs.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {bs.student.user.name || "Anonymous Student"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {bs.student.user.email}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Match Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search query or verify if the student is enrolled in this batch.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── DANGER ZONE — always visible below the card ── */}
        <div className="mt-4 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">⚠️ Danger Zone</p>
            <p className="text-xs text-rose-600/70 dark:text-rose-500 mt-0.5">
              Permanently delete <strong>{selectedBatch.name}</strong> and all its records. This cannot be undone.
            </p>
          </div>
          <DismissBatchDialog
            teacherEmail={teacherEmail}
            batchId={selectedBatch.id}
            batchName={selectedBatch.name}
          />
        </div>
        </>
      ) : null}
    </div>
  );
}
