"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTestScore } from "@/actions/teacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Award } from "lucide-react";

interface Props {
  batches: any[];
  teacherEmail: string;
}

export function TestScoreForm({ batches, teacherEmail }: Props) {
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || "");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [testName, setTestName] = useState("");
  const [score, setScore] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const batch = batches.find((b) => b.id === selectedBatch);
  const students = batch?.students || [];

  const isValid =
    selectedStudent && testName.trim() && score && totalMarks &&
    Number(score) >= 0 && Number(totalMarks) > 0 && Number(score) <= Number(totalMarks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");

    const studentEmail = students.find((s: any) => s.student.id === selectedStudent)?.student?.user?.email;
    if (!studentEmail) { setError("Student email not found"); setLoading(false); return; }

    const res = await addTestScore(teacherEmail, studentEmail, testName.trim(), Number(score), Number(totalMarks));
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTestName("");
      setScore("");
      setTotalMarks("");
      setSelectedStudent("");
      setTimeout(() => { setSuccess(false); router.refresh(); }, 2000);
    } else {
      setError(res.error || "Failed to record score");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <CardTitle className="text-lg font-bold">Enter Score</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Batch */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Batch</Label>
              <Select value={selectedBatch} onValueChange={(v) => { setSelectedBatch(v); setSelectedStudent(""); }}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Choose batch..." /></SelectTrigger>
                <SelectContent>
                  {batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Student */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Choose student..." /></SelectTrigger>
                <SelectContent>
                  {students.map((bs: any) => (
                    <SelectItem key={bs.student.id} value={bs.student.id}>
                      {bs.student.user.name || bs.student.user.email}
                    </SelectItem>
                  ))}
                  {students.length === 0 && <p className="p-3 text-xs text-slate-500">No students in this batch.</p>}
                </SelectContent>
              </Select>
            </div>

            {/* Test Name */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Test / Exam Name</Label>
              <Input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="e.g. Chapter 5 — Newton's Laws" className="rounded-xl h-11" />
            </div>

            {/* Score & Total */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Score</Label>
                <Input type="number" min={0} value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 85" className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Out of</Label>
                <Input type="number" min={1} value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g. 100" className="rounded-xl h-11" />
              </div>
            </div>

            {/* Preview percentage */}
            {score && totalMarks && Number(totalMarks) > 0 && (
              <div className={`p-3 rounded-xl text-center font-black text-lg ${
                Number(score) / Number(totalMarks) >= 0.75 ? "bg-emerald-50 text-emerald-700" :
                Number(score) / Number(totalMarks) >= 0.5 ? "bg-amber-50 text-amber-700" :
                "bg-rose-50 text-rose-700"
              }`}>
                {Math.round((Number(score) / Number(totalMarks)) * 100)}% &nbsp;
                <span className="text-sm font-semibold opacity-70">score preview</span>
              </div>
            )}

            {error && <p className="text-rose-600 text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isValid && !loading
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:scale-[1.02]"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              {loading ? "Saving..." : success ? "Saved!" : "Record Score"}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Student roster preview */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader>
          <CardTitle className="text-lg font-bold">Students in {batch?.name || "Batch"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {students.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((bs: any, i: number) => (
                <div key={bs.student.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm shrink-0">
                    {(i + 1).toString().padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{bs.student.user.name || "—"}</p>
                    <p className="text-xs text-slate-500">{bs.student.user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-slate-500 text-sm">No students enrolled in this batch yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
