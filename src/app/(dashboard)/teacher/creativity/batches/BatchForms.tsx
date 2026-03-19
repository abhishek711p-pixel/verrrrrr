"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, UserPlus, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { createBatch, addStudentToBatch, deleteBatch } from "@/actions/teacher";

export function CreateBatchDialog({ 
  teacherEmail, 
  suggestedStudentCount = 0 
}: { 
  teacherEmail: string;
  suggestedStudentCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [autoEnroll, setAutoEnroll] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createBatch(teacherEmail, name, description, autoEnroll);
    
    setLoading(false);
    
    if (res.success) {
      setOpen(false);
      setName("");
      setDescription("");
      setAutoEnroll(false);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Create New Batch</DialogTitle>
          <DialogDescription>
            Group your students into a new session. Professional tracking starts here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">Batch Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. JAVA Mastery 2026" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description (Optional)</Label>
            <Input 
              id="description" 
              placeholder="e.g. Core Java Concepts & Data Structures" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 border-slate-200"
            />
          </div>

          {suggestedStudentCount > 0 && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-3">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  id="autoEnroll" 
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  checked={autoEnroll}
                  onChange={(e) => setAutoEnroll(e.target.checked)}
                />
              </div>
              <Label htmlFor="autoEnroll" className="cursor-pointer">
                <span className="block font-bold text-indigo-900 dark:text-indigo-300">Smart Enrollment Shortcut</span>
                <span className="block text-xs text-indigo-700 dark:text-indigo-400 mt-1">
                  Automatically enroll your <strong>{suggestedStudentCount}</strong> existing students into this new batch immediately. 
                  <span className="block mt-1 italic font-medium">Save time on manual entry!</span>
                </span>
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {loading ? "Optimizing Batch..." : "Create & Launch Batch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddStudentDialog({ teacherEmail, batchId, batchName }: { teacherEmail: string, batchId: string, batchName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await addStudentToBatch(teacherEmail, batchId, studentEmail);
    
    setLoading(false);
    
    if (res.success) {
      setOpen(false);
      setStudentEmail("");
      router.refresh();
    } else {
      alert(res.error || "Failed to add student. Ensure they have signed up.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Student to Batch</DialogTitle>
          <DialogDescription>
            Enroll a student into <strong>{batchName}</strong> by providing their registered email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAdd} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input 
              id="studentEmail" 
              type="email"
              placeholder="student@example.com" 
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Adding..." : "Add to Batch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DismissBatchDialog({
  teacherEmail,
  batchId,
  batchName,
}: {
  teacherEmail: string;
  batchId: string;
  batchName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const isConfirmed = confirm === batchName;

  const handleDismiss = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    const res = await deleteBatch(teacherEmail, batchId);
    setLoading(false);

    if (res.success) {
      setOpen(false);
      setConfirm("");
      router.refresh();
    } else {
      alert(res.error || "Failed to dismiss batch.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setConfirm(""); }}>
      <DialogTrigger asChild>
        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20 flex items-center gap-2 group"
        >
          <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
          🗑️ Dismiss Batch
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] border-rose-200 dark:border-rose-900/60 rounded-2xl overflow-hidden p-0">
        {/* Red accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />

        <div className="p-6 space-y-5">
          {/* Icon + title */}
          <DialogHeader className="text-center">
            <div className="mx-auto w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
              Permanently Dismiss Batch?
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              You are about to permanently delete{" "}
              <span className="font-bold text-rose-600">"{batchName}"</span>.
            </DialogDescription>
          </DialogHeader>

          {/* Warning box */}
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-4 space-y-1.5">
            <p className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              ⚠️ This will permanently delete:
            </p>
            <ul className="text-xs text-rose-700 dark:text-rose-400 space-y-1 pl-2">
              <li>• All <b>student enrollments</b> for this batch</li>
              <li>• All <b>attendance records</b></li>
              <li>• All <b>assignments</b></li>
              <li>• All <b>messages</b> linked to this batch</li>
              <li>• The batch itself — <b>cannot be undone</b></li>
            </ul>
          </div>

          {/* Type-to-confirm */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Type <span className="text-rose-600 font-black">"{batchName}"</span> to confirm
            </label>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={batchName}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none transition-all ${
                confirm.length === 0
                  ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  : isConfirmed
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-700"
                  : "border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-700"
              }`}
            />
            {confirm.length > 0 && !isConfirmed && (
              <p className="text-[11px] text-amber-600 font-semibold">
                Name doesn't match — check spelling
              </p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => { setOpen(false); setConfirm(""); }}
              className="w-full sm:w-auto"
            >
              Cancel, Keep Batch
            </Button>
            <Button
              onClick={handleDismiss}
              disabled={!isConfirmed || loading}
              className={`w-full sm:w-auto transition-all duration-300 ${
                isConfirmed && !loading
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30 scale-100 hover:scale-[1.02]"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dismissing...</>
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" /> Permanently Dismiss</>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
