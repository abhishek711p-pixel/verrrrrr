"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { sendTeacherMessage } from "@/actions/teacher";

export function MessageManager({ initialBatches, initialMessages, email }: { initialBatches: any[], initialMessages: any[], email: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    
    setIsSending(true);
    setSuccessMsg(false);
    
    // allow empty batchId to mean "All Batches"
    const result = await sendTeacherMessage(email, subject, content, selectedBatchId);
    
    if (result.success && result.message) {
      // Append the new message to the top of the local state
      const newMessage = {
        ...result.message,
        batch: initialBatches.find(b => b.id === selectedBatchId) || null
      };

      setMessages([newMessage, ...messages]);
      setSubject("");
      setContent("");
      setSuccessMsg(true);
      
      setTimeout(() => setSuccessMsg(false), 3000);
    } else {
      alert(result?.error || "Failed to send message.");
    }
    setIsSending(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Compose Section */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
          <CardHeader>
            <CardTitle className="text-lg">Compose Broadcast</CardTitle>
            <CardDescription>Send an announcement to a specific batch or all students.</CardDescription>
          </CardHeader>
          <CardContent>
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Message Sent Successfully
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Audience</label>
                <select 
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="">All My Students</option>
                  {initialBatches.map(b => (
                    <option key={b.id} value={b.id}>Batch: {b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Schedule Change, Exam Prep"
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement here..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm min-h-[150px]"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSending || !subject || !content}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                {isSending ? "Sendinging..." : <><Send className="w-4 h-4 mr-2" /> Broadcast Now</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sent Messages History */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sent History</h3>
        
        {messages.length === 0 ? (
           <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <Mail className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
             <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Messages Sent</h3>
             <p className="mt-1 text-sm text-slate-500">You haven't sent any broadcasts or announcements yet.</p>
           </div>
        ) : (
          messages.map((msg: any) => (
            <Card key={msg.id} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
              <CardContent className="p-5 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{msg.subject}</h4>
                  <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div className="mb-4">
                   <span className="inline-block px-2 text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                     TO: {msg.batchId ? msg.batch?.name : "All Students"}
                   </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{msg.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
