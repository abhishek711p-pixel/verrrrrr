"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Send, Calendar, Clock, BookOpen, Trash2, CheckCircle, Users } from "lucide-react";
import { createAssignment, deleteAssignment } from "@/actions/teacher";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AssignmentManager({ initialBatches, email }: { initialBatches: any[], email: string }) {
  const [batches, setBatches] = useState(initialBatches);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationQuestion, setValidationQuestion] = useState("");
  const [validationAnswer, setValidationAnswer] = useState("");
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState<any>(null);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);

  const handleDeleteAssignment = async (batchId: string, assignmentId: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    
    try {
      const result = await deleteAssignment(email, assignmentId);
      if (result.success) {
        setBatches(prev => prev.map(batch => {
          if (batch.id === batchId) {
            return {
              ...batch,
              assignments: batch.assignments.filter((a: any) => a.id !== assignmentId)
            };
          }
          return batch;
        }));
      } else {
        alert(result.error || "Failed to delete assignment");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the assignment");
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedBatchId) return;
    
    setIsSubmitting(true);
    const dateObj = dueDate ? new Date(dueDate).toISOString() : null;
    
    const result = await createAssignment(email, title, description, selectedBatchId, dateObj, fileUrl, validationQuestion, validationAnswer);
    
    if (result.success && result.assignment) {
      // Update local state to show new assignment instantly
      setBatches(batches.map(batch => {
        if (batch.id === selectedBatchId) {
          return {
            ...batch,
            assignments: [result.assignment, ...(batch.assignments || [])]
          };
        }
        return batch;
      }));
      
      // Clear form
      setTitle("");
      setDescription("");
      setDueDate("");
      setFileUrl(null);
      setFileName(null);
      setValidationQuestion("");
      setValidationAnswer("");
    } else {
      alert(result?.error || "Failed to assign note/homework.");
    }
    setIsSubmitting(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Starting upload to /api/upload/assignment...");
      const response = await fetch("/api/upload/assignment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload server error:", response.status, errorText);
        alert(`Upload failed (${response.status}): ${errorText || "Internal Server Error"}`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setFileUrl(data.url);
        setFileName(data.name);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Critical upload fetch error:", error);
      alert(`Critical error: ${error.message}. Check if the server is running on port 3000.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Create Form */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
          <CardHeader>
            <CardTitle className="text-lg">Create New Assignment</CardTitle>
            <CardDescription>Distribute notes or assignments to a specific batch.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Batch</label>
                <select 
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                >
                  <option value="" disabled>Choose a batch...</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kinematics Worksheet 1"
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Instructions / Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the homework or paste notes here..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date (Optional)</label>
                <div className="flex items-center w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
                  <Calendar className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-transparent text-sm w-full focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Submission Validation</label>
                <div className="space-y-3 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Validation Question</label>
                    <input
                      type="text"
                      value={validationQuestion}
                      onChange={(e) => setValidationQuestion(e.target.value)}
                      placeholder="e.g. What is the value of G?"
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Correct Answer</label>
                    <input
                      type="text"
                      value={validationAnswer}
                      onChange={(e) => setValidationAnswer(e.target.value)}
                      placeholder="e.g. 6.67"
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Students must answer this correctly before they can submit their assignment.</p>
                </div>
              </div>

              <div className="space-y-2">
                <input 
                  type="file" 
                  id="assignment-file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {fileUrl ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-sm">
                    <div className="flex items-center text-indigo-700 dark:text-indigo-300 truncate mr-2">
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate max-w-[150px]">{fileName}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setFileUrl(null); setFileName(null); }}
                      className="h-6 w-6 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-dashed"
                    disabled={isUploading}
                    onClick={() => document.getElementById('assignment-file')?.click()}
                  >
                    {isUploading ? "Uploading..." : <><FileText className="w-4 h-4 mr-2" /> Attach File (PDF/Docs)</>}
                  </Button>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || isUploading || !title || !selectedBatchId}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
              >
                {isSubmitting ? "Assigning..." : <><Send className="w-4 h-4 mr-2" /> Distribute Assignment</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Feed of Assignments */}
      <div className="lg:col-span-2 space-y-6">
        {batches.length === 0 ? (
           <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
             <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Batches Found</h3>
             <p className="mt-1 text-sm text-slate-500">You must create students batches before you can assign classwork.</p>
           </div>
        ) : (
          batches.map(batch => (
            <div key={batch.id} className="mb-8">
              <h3 className="flex items-center text-lg font-bold text-slate-900 dark:text-white mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                {batch.name} <span className="text-sm font-normal text-slate-500 ml-2">({batch.assignments?.length || 0} Assignments)</span>
              </h3>
              
              <div className="space-y-4">
                {(!batch.assignments || batch.assignments.length === 0) ? (
                  <p className="text-slate-500 text-sm italic">No assignments for this batch yet.</p>
                ) : (
                  batch.assignments.map((assignment: any) => (
                    <Card key={assignment.id} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                      <CardContent className="p-5 pl-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{assignment.title}</h4>
                            <span className="text-xs text-slate-400">{new Date(assignment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8"
                            onClick={() => handleDeleteAssignment(batch.id, assignment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {assignment.description && (
                          <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 whitespace-pre-wrap">{assignment.description}</p>
                        )}
                        {assignment.fileUrl && (
                          <div className="mb-4">
                            <a 
                              href={assignment.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Attachment
                            </a>
                          </div>
                        )}

                        {assignment.validationQuestion && (
                          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Validation Quiz</h5>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">" {assignment.validationQuestion} "</p>
                            <div className="mt-2 flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                              Correct: {assignment.validationAnswer}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 text-xs font-medium">
                          {assignment.dueDate ? (
                            <div className="flex items-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3 mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleString()}
                            </div>
                          ) : (
                            <div className="flex items-center text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              No due date
                            </div>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold"
                            onClick={() => {
                              setSelectedAssignmentForSubmissions(assignment);
                              setIsSubmissionsOpen(true);
                            }}
                          >
                            View Submissions ({assignment.assignmentSubmissions?.length || 0})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── SUBMISSIONS MODAL ── */}
      <Dialog open={isSubmissionsOpen} onOpenChange={setIsSubmissionsOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Submissions
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {selectedAssignmentForSubmissions?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 space-y-3">
            {(!selectedAssignmentForSubmissions?.assignmentSubmissions || selectedAssignmentForSubmissions.assignmentSubmissions.length === 0) ? (
              <div className="py-12 text-center">
                <div className="inline-flex p-3 rounded-full bg-slate-100 dark:bg-slate-900 mb-3">
                  <BookOpen className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No submissions yet.</p>
              </div>
            ) : (
              selectedAssignmentForSubmissions.assignmentSubmissions.map((submission: any) => (
                <div key={submission.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      {submission.student?.user?.name?.[0] || 'S'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {submission.student?.user?.name || 'Anonymous Student'}
                      </h5>
                      <p className="text-[10px] text-slate-500">
                        Submitted on {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsSubmissionsOpen(false)}
              className="px-8 border-slate-200 dark:border-slate-800"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
