"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Send, Calendar, Clock, BookOpen } from "lucide-react";
import { createAssignment } from "@/actions/teacher";

export function AssignmentManager({ initialBatches, email }: { initialBatches: any[], email: string }) {
  const [batches, setBatches] = useState(initialBatches);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedBatchId) return;
    
    setIsSubmitting(true);
    const dateObj = dueDate ? new Date(dueDate).toISOString() : null;
    
    const result = await createAssignment(email, title, description, selectedBatchId, dateObj);
    
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
    } else {
      alert(result?.error || "Failed to assign note/homework.");
    }
    setIsSubmitting(false);
  };

  const handleFileUpload = () => {
    alert("File uploads will be supported once the website is live. For now, you can write the assignment in the description.");
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

              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-dashed"
                onClick={handleFileUpload}
              >
                <FileText className="w-4 h-4 mr-2" /> Attach File (PDF/Docs)
              </Button>

              <Button 
                type="submit" 
                disabled={isSubmitting || !title || !selectedBatchId}
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
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">{assignment.title}</h4>
                          <span className="text-xs text-slate-400">{new Date(assignment.createdAt).toLocaleDateString()}</span>
                        </div>
                        {assignment.description && (
                          <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 whitespace-pre-wrap">{assignment.description}</p>
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
                          <Button variant="ghost" size="sm" className="h-7 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">View Submissions</Button>
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
    </div>
  );
}
