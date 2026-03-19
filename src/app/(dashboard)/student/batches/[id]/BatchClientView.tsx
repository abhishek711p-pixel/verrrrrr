"use client";

import { useState, useMemo, useRef } from "react";
import {
  MessageSquare,
  Calendar,
  PlayCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  BookOpen,
  X,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentBatchMessages } from "./StudentBatchMessages";
import { incrementVideoViews } from "@/actions/teacher";
import { submitAssignment } from "@/actions/student";

interface BatchClientViewProps {
  batch: any;
  studentEmail: string;
  studentId: string;
}

type ViewMode = "selection" | "attendance" | "content" | "communications" | "assignments";

export function BatchClientView({ batch, studentEmail, studentId }: BatchClientViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("selection");
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // ── Submission state ────────────────────────────────────────────────────
  const [submittingAssignment, setSubmittingAssignment] = useState<any | null>(null);
  const [validationAnswer, setValidationAnswer] = useState("");
  const [isFinishingSubmission, setIsFinishingSubmission] = useState(false);

  // ── Assignments data ────────────────────────────────────────────────────
  const assignments = batch.assignments || [];
  const latestAssignment = assignments.length > 0 ? assignments[0] : null;

  // ── Attendance history ──────────────────────────────────────────────────
  const attendanceHistory = useMemo(() => {
    const start = new Date(batch.createdAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      const record = batch.attendance.find(
        (a: any) => new Date(a.date).toISOString().split("T")[0] === dateStr
      );
      dates.push({ date: new Date(current), status: record ? record.status : "NOT_RECORDED" });
      current.setDate(current.getDate() + 1);
    }
    return dates.reverse();
  }, [batch.createdAt, batch.attendance]);

  // ── All videos ──────────────────────────────────────────────────────────
  const allVideos = useMemo(() => {
    const videos: any[] = [];
    batch.teacher?.courses?.forEach((course: any) => {
      course.videos?.forEach((video: any) => {
        videos.push({ ...video, courseName: course.title });
      });
    });
    return videos;
  }, [batch.teacher]);

  // ── Open video player ───────────────────────────────────────────────────
  const openVideo = async (video: any) => {
    setActiveVideo(video);
    // Count view only once per session per video
    if (!viewedIds.has(video.id)) {
      setViewedIds((prev) => new Set([...prev, video.id]));
      await incrementVideoViews(video.id);
    }
  };

  const closeVideo = () => {
    videoRef.current?.pause();
    setActiveVideo(null);
  };

  const handleAssignmentSubmit = async () => {
    if (!submittingAssignment || !validationAnswer.trim()) return;
    
    setIsFinishingSubmission(true);
    const result = await submitAssignment(studentEmail, submittingAssignment.id, validationAnswer);
    
    if (result.success) {
      // Refresh local state (simplest is to just alert and close for now, 
      // but ideally we'd update the batch object and show 'Submitted')
      alert("Assignment submitted successfully!");
      // Update local batch data
      if (batch.assignments) {
        const assignment = batch.assignments.find((a: any) => a.id === submittingAssignment.id);
        if (assignment) {
          assignment.assignmentSubmissions = [result.submission];
        }
      }
      setSubmittingAssignment(null);
      setValidationAnswer("");
    } else {
      alert(result.error || "Failed to submit assignment.");
    }
    setIsFinishingSubmission(false);
  };

  // ── SELECTION SCREEN ────────────────────────────────────────────────────
  if (viewMode === "selection") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-indigo-200 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
            Batch Portal
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">{batch.name}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Welcome to your learning dashboard. Select a section below to continue.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance */}
          <Card className="group cursor-pointer hover:border-emerald-500 transition-all hover:shadow-xl border-2 border-transparent bg-white dark:bg-slate-900 overflow-hidden" onClick={() => setViewMode("attendance")}>
            <div className="h-2 bg-emerald-500" />
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                  <Calendar className="w-10 h-10" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Attendance</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Check your daily participation records from the start of the batch.</p>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="group cursor-pointer hover:border-indigo-500 transition-all hover:shadow-xl border-2 border-transparent bg-white dark:bg-slate-900 overflow-hidden" onClick={() => setViewMode("content")}>
            <div className="h-2 bg-indigo-500" />
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                  <PlayCircle className="w-10 h-10" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Batch Content</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Access your lecture videos, course materials, and study resources.
                {allVideos.length > 0 && (
                  <span className="ml-1 font-bold text-indigo-600">{allVideos.length} video{allVideos.length !== 1 ? "s" : ""} available</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Communications */}
          <Card className="group cursor-pointer hover:border-purple-500 transition-all hover:shadow-xl border-2 border-transparent bg-white dark:bg-slate-900 overflow-hidden md:col-span-2" onClick={() => setViewMode("communications")}>
            <div className="h-2 bg-purple-500" />
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-purple-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Batch Communication</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Read teacher announcements and participate in batch discussions.</p>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="group cursor-pointer hover:border-orange-500 transition-all hover:shadow-xl border-2 border-transparent bg-white dark:bg-slate-900 overflow-hidden md:col-span-2" onClick={() => setViewMode("assignments")}>
            <div className="h-2 bg-orange-500" />
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600">
                  <FileText className="w-10 h-10" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assignments & Notes</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {latestAssignment ? (
                  <>Latest: <span className="font-bold text-orange-600">{latestAssignment.title}</span></>
                ) : (
                  "View your class notes, homework, and distribution materials."
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ── Video Player Modal Overlay ── */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
          {/* Header */}
          <div className="w-full max-w-5xl px-4 flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white text-xl font-bold leading-tight">{activeVideo.title}</h2>
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mt-0.5">{activeVideo.courseName}</p>
            </div>
            <button
              onClick={closeVideo}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video element */}
          <div className="w-full max-w-5xl px-4">
            <video
              ref={videoRef}
              src={activeVideo.url}
              controls
              autoPlay
              className="w-full rounded-2xl bg-black shadow-2xl"
              style={{ maxHeight: "70vh" }}
            >
              Your browser does not support HTML5 video.
            </video>
          </div>

          {/* Footer info */}
          <div className="w-full max-w-5xl px-4 mt-4 flex items-center gap-4 text-white/40 text-xs">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {viewedIds.has(activeVideo.id) ? activeVideo.views + 1 : activeVideo.views} views</span>
            <span>Uploaded {new Date(activeVideo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {/* ── Submission Modal Overlay ── */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="h-2 bg-orange-500" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Submit Assignment</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSubmittingAssignment(null)} className="rounded-full w-8 h-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>{submittingAssignment.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-2xl">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-1.5">
                   < BookOpen className="w-3 h-3" /> Validation Question
                </h5>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {submittingAssignment.validationQuestion || "What is the result of the assigned task?"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Your Answer</label>
                <input
                  type="text"
                  value={validationAnswer}
                  onChange={(e) => setValidationAnswer(e.target.value)}
                  placeholder="Type the correct answer to submit..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  onClick={handleAssignmentSubmit}
                  disabled={isFinishingSubmission || !validationAnswer.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-orange-500/20"
                >
                  {isFinishingSubmission ? (
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" /> VALIDATING...
                    </span>
                  ) : (
                    "SUBMIT FOR REVIEW"
                  )}
                </Button>
                <p className="text-[10px] text-center text-slate-400">
                  Matches are case-insensitive. Your submission will be recorded only if the answer is correct.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setViewMode("selection")} className="gap-2 text-slate-600 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Back to Sections
        </Button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{batch.name}</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            {viewMode === "attendance" ? "Attendance Log" : viewMode === "content" ? "Learning Resources" : "Batch Activity"}
          </p>
        </div>
      </div>

      {/* ── ATTENDANCE ── */}
      {viewMode === "attendance" && (
        <div className="space-y-6">
          {/* ── STATS DASHBOARD ── */}
          {(() => {
            const totalScheduled = attendanceHistory.filter(h => h.status !== "NOT_RECORDED").length;
            const totalPresent   = attendanceHistory.filter(h => h.status === "PRESENT").length;
            const totalAbsent    = attendanceHistory.filter(h => h.status === "ABSENT").length;
            const totalDays      = attendanceHistory.length;
            const pct = totalScheduled > 0 ? Math.round((totalPresent / totalScheduled) * 100) : 0;
            const radius = 46;
            const circ  = 2 * Math.PI * radius;
            const dash  = circ * (pct / 100);

            return (
              <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">

                  {/* Attendance Ring */}
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r={radius} fill="transparent" stroke="currentColor" strokeWidth="10" className="text-indigo-100 dark:text-indigo-900/60" />
                      <circle
                        cx="64" cy="64" r={radius}
                        fill="transparent" stroke="currentColor" strokeWidth="10"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeLinecap="round"
                        className={pct >= 75 ? "text-emerald-500" : pct >= 50 ? "text-amber-500" : "text-rose-500"}
                        style={{ transition: "stroke-dasharray 0.6s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-black ${pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"}`}>{pct}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                      <div className="text-3xl font-black text-slate-700 dark:text-slate-200">{totalDays}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Days Since Start</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                      <div className="text-3xl font-black text-indigo-600">{totalScheduled}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Classes Held</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/40 text-center shadow-sm">
                      <div className="text-3xl font-black text-emerald-600">{totalPresent}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">You Attended</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/40 text-center shadow-sm">
                      <div className="text-3xl font-black text-rose-500">{totalAbsent}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">You Missed</div>
                    </div>
                  </div>
                </div>

                {/* Status message */}
                <div className={`mt-4 text-center text-sm font-semibold rounded-2xl py-2 px-4 ${
                  pct >= 75 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : pct >= 50 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  : pct > 0   ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  {pct === 0 && totalScheduled === 0 && "No classes have been recorded yet by the teacher."}
                  {pct === 0 && totalScheduled > 0 && "⚠️ No attendance recorded — please contact your teacher."}
                  {pct > 0 && pct < 50 && `⚠️ Low attendance! You need to attend more classes to stay on track.`}
                  {pct >= 50 && pct < 75 && `📈 You're at ${pct}% — aim for 75%+ to meet attendance requirements.`}
                  {pct >= 75 && `✅ Great! You've maintained ${pct}% attendance — keep it up!`}
                </div>
              </div>
            );
          })()}

          {/* ── DAILY LOG ── */}
          <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl rounded-3xl">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Day-by-Day Log</h3>
                <p className="text-xs text-slate-400">From batch start to today</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Present
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ml-2" /> Absent
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block ml-2" /> Not Recorded
              </div>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceHistory.map((record, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-5 transition-colors ${
                    record.status === "PRESENT" ? "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
                    : record.status === "ABSENT" ? "hover:bg-rose-50/50 dark:hover:bg-rose-900/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}>
                    <div className="flex items-center gap-4">
                      {/* Colour strip */}
                      <div className={`w-1 h-10 rounded-full ${
                        record.status === "PRESENT" ? "bg-emerald-500"
                        : record.status === "ABSENT" ? "bg-rose-500"
                        : "bg-slate-200 dark:bg-slate-700"
                      }`} />
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                          {record.date.toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                        <span className="text-lg font-black text-slate-700 dark:text-slate-300 leading-none mt-0.5">
                          {record.date.getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {record.date.toLocaleDateString("en-IN", { weekday: "long" })}
                        </div>
                        <div className="text-xs text-slate-400">
                          {record.date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      </div>
                    </div>

                    <div>
                      {record.status === "PRESENT" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-800 gap-1.5 px-3 py-1.5 text-xs font-bold ring-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PRESENT
                        </Badge>
                      ) : record.status === "ABSENT" ? (
                        <Badge variant="destructive" className="gap-1.5 px-3 py-1.5 text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" /> ABSENT
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400 border-slate-200 gap-1.5 px-3 py-1.5 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> NOT RECORDED
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── CONTENT / VIDEO GALLERY ── */}
      {viewMode === "content" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allVideos.length > 0 ? (
            allVideos.map((video) => (
              <Card
                key={video.id}
                onClick={() => openVideo(video)}
                className="group border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all rounded-3xl bg-white dark:bg-slate-900 cursor-pointer"
              >
                {/* Thumbnail / Preview */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                      <PlayCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  {/* Thumbnail image if available, else gradient */}
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-80" />
                  )}
                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded z-10">
                    VIDEO
                  </div>
                  {/* Already played indicator */}
                  {viewedIds.has(video.id) && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded z-10 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Watched
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-none">
                      {video.courseName}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {video.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 dark:border-slate-800 pt-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {video.views + (viewedIds.has(video.id) ? 1 : 0)} views
                    </span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Empty Knowledge Base</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">Your teacher hasn't uploaded any videos for this batch yet. Stay tuned!</p>
            </div>
          )}
        </div>
      )}

      {/* ── COMMUNICATIONS ── */}
      {viewMode === "communications" && (
        <StudentBatchMessages
          initialMessages={batch.messages}
          studentEmail={studentEmail}
          studentId={studentId}
        />
      )}

      {/* ── ASSIGNMENTS ── */}
      {viewMode === "assignments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {assignments.length > 0 ? (
              assignments.map((assignment: any) => (
                <Card key={assignment.id} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                  <CardContent className="p-6 pl-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                          {assignment.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Posted on {new Date(assignment.createdAt).toLocaleDateString("en-IN", { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                      </div>
                      
                      {assignment.dueDate && (
                        <div className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-800 h-fit">
                          <Clock className="w-3 h-3 mr-1.5" />
                          DUE: {new Date(assignment.dueDate).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {assignment.description && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6">
                        <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {assignment.description}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {assignment.fileUrl ? (
                        <a 
                          href={assignment.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-colors ring-1 ring-indigo-100 dark:ring-indigo-800"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download Materials
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No attached files</span>
                      )}
                      
                      {assignment.assignmentSubmissions && assignment.assignmentSubmissions.length > 0 ? (
                        <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl ring-1 ring-emerald-100 dark:ring-emerald-800">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Work Submitted
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setSubmittingAssignment(assignment)}
                          className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-widest h-10 px-6 shadow-lg shadow-orange-500/10"
                        >
                          Submit Work
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <FileText className="mx-auto h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Assignments Yet</h3>
                <p className="mt-2 text-slate-500 max-w-xs mx-auto">Your teacher hasn't posted any assignments or notes for this batch yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
