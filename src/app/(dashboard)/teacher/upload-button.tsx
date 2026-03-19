"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  FileVideo,
  X,
  CheckCircle2,
  ChevronRight,
  Play,
  Zap,
  Layers,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addVideo } from "@/actions/teacher";
import { useRouter } from "next/navigation";

interface UploadButtonProps {
  courses: { id: string; title: string }[];
  batches?: { id: string; name: string }[];
  userEmail: string;
}

export function UploadButton({ courses, batches = [], userEmail }: UploadButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadMode, setUploadMode] = useState<"course" | "batch">("batch");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const isFormValid =
    title.trim().length > 0 &&
    (uploadMode === "batch" ? selectedBatch : selectedCourse);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      setErrorMsg("");
      setStep(2);
    }
  };

  const startUpload = async () => {
    if (!isFormValid || !file) return;
    setIsUploading(true);
    setProgress(0);
    setErrorMsg("");

    try {
      // ── Real file upload via XHR so we get progress events ──
      const publicUrl = await new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if (data.url) resolve(data.url);
            else reject(new Error(data.error || "Upload failed"));
          } else {
            reject(new Error(`Server error: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      // ── Save video metadata + real URL to database ──
      const courseId = uploadMode === "course" ? selectedCourse : (courses[0]?.id || "");
      const res = await addVideo(userEmail, title, courseId, publicUrl);

      if (res.success) {
        setProgress(100);
        setIsCompleted(true);
        setIsUploading(false);
        router.refresh();
      } else {
        throw new Error(res.error || "Failed to save video");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed. Please try again.");
      setIsUploading(false);
      setProgress(0);
    }
  };

  const reset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setFile(null);
      setTitle("");
      setSelectedCourse("");
      setSelectedBatch("");
      setProgress(0);
      setIsUploading(false);
      setIsCompleted(false);
      setErrorMsg("");
    }, 300);
  };

  const btnLabel = !title
    ? "Enter a title first..."
    : uploadMode === "batch" && !selectedBatch
    ? "Select a batch..."
    : uploadMode === "course" && !selectedCourse
    ? "Select a course..."
    : "🚀 Confirm Upload";

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 font-bold group"
      >
        <UploadCloud className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
        Upload New Video
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !isUploading && !isCompleted && setIsOpen(open)}>
        <DialogContent className="sm:max-w-[520px] border-none shadow-2xl rounded-3xl overflow-hidden p-0 dark:bg-slate-950">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

          <div className="p-8">
            {/* ── STEP 1: Pick file ── */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Select Video</DialogTitle>
                  <DialogDescription>Choose a video file from your device to upload.</DialogDescription>
                </DialogHeader>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group"
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileVideo className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200">Tap to browse files</h4>
                  <p className="text-xs text-slate-500 mt-1">MP4, MOV or AVI — from PC, Mac, or Phone</p>
                </div>
              </div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === 2 && !isUploading && !isCompleted && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Content Details</DialogTitle>
                  <DialogDescription>Give your video a title and choose where to publish it.</DialogDescription>
                </DialogHeader>

                {/* Mode toggle */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 gap-1">
                  <button onClick={() => setUploadMode("batch")} className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${uploadMode === "batch" ? "bg-white dark:bg-slate-800 shadow text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700"}`}>
                    <Layers className="w-4 h-4" /> For a Batch
                  </button>
                  <button onClick={() => setUploadMode("course")} className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${uploadMode === "course" ? "bg-white dark:bg-slate-800 shadow text-purple-600 dark:text-purple-400" : "text-slate-500 hover:text-slate-700"}`}>
                    <Zap className="w-4 h-4" /> For a Course
                  </button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-500">Video Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Calculus – Lecture 1" className="rounded-xl border-slate-200 h-12" />
                </div>

                {/* Batch or Course selector */}
                {uploadMode === "batch" ? (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Target Batch</Label>
                    <Select onValueChange={setSelectedBatch} value={selectedBatch}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12"><SelectValue placeholder="Choose which batch to upload to…" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        {batches.length === 0 && <p className="p-3 text-xs text-slate-500">No batches yet.</p>}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Target Course</Label>
                    <Select onValueChange={setSelectedCourse} value={selectedCourse}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12"><SelectValue placeholder="Choose which course to upload to…" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                        {courses.length === 0 && <p className="p-3 text-xs text-slate-500">No courses yet.</p>}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* File chip */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{file?.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      {(file?.size || 0) / (1024 * 1024) > 1 ? `${((file?.size || 0) / (1024 * 1024)).toFixed(1)} MB` : `${((file?.size || 0) / 1024).toFixed(0)} KB`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="text-slate-400 h-8 w-8"><X className="w-4 h-4" /></Button>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                  </div>
                )}

                <DialogFooter className="pt-2">
                  <button
                    onClick={isFormValid ? startUpload : undefined}
                    className={`w-full h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isFormValid
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02]"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {btnLabel}
                    {isFormValid && <ChevronRight className="w-4 h-4" />}
                  </button>
                </DialogFooter>
              </div>
            )}

            {/* ── UPLOADING ── */}
            {isUploading && (
              <div className="py-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="relative w-28 h-28 mx-auto">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                    <circle
                      cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={50 * 2 * Math.PI}
                      strokeDashoffset={50 * 2 * Math.PI * (1 - progress / 100)}
                      strokeLinecap="round"
                      className="text-indigo-600 transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-indigo-700">{Math.round(progress)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Uploading your video…</h3>
                  <p className="text-sm text-slate-500">Please keep this window open.</p>
                </div>
              </div>
            )}

            {/* ── COMPLETED ── */}
            {isCompleted && (
              <div className="py-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Upload Successful! 🎉</h3>
                  <p className="text-sm text-slate-500">Students can now watch this video in their Batch Content section.</p>
                </div>
                <Button className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold" onClick={reset}>Done ✓</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
