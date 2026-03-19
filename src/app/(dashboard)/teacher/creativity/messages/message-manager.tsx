"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail, Send, CheckCircle2, User, Lock, ShieldCheck, MessageSquare } from "lucide-react";
import { sendTeacherMessage, sendMessageReply } from "@/actions/teacher";
import { Textarea } from "@/components/ui/textarea";

export function MessageManager({ initialBatches, initialMessages, email }: { initialBatches: any[], initialMessages: any[], email: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [isReplying, setIsReplying] = useState<{ [key: string]: boolean }>({});

  const selectedBatch = initialBatches.find(b => b.id === selectedBatchId);
  const studentsInBatch = selectedBatch?.students || [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    
    setIsSending(true);
    setSuccessMsg(false);
    
    const result = await sendTeacherMessage(email, subject, content, selectedBatchId, selectedStudentId);
    
    if (result.success && result.message) {
      const newMessage = {
        ...result.message,
        batch: selectedBatch || null,
        student: studentsInBatch.find((bs: any) => bs.studentId === selectedStudentId)?.student || null,
        replies: []
      };

      setMessages([newMessage, ...messages]);
      setSubject("");
      setContent("");
      setSelectedStudentId("");
      setSuccessMsg(true);
      
      setTimeout(() => setSuccessMsg(false), 3000);
    } else {
      alert(result?.error || "Failed to send message.");
    }
    setIsSending(false);
  };

  const handleReplyToStudent = async (messageId: string) => {
    const text = replyContent[messageId];
    if (!text?.trim()) return;

    setIsReplying(prev => ({ ...prev, [messageId]: true }));
    const result = await sendMessageReply(email, messageId, text, false);

    if (result.success && result.reply) {
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          return { ...m, replies: [...(m.replies || []), result.reply] };
        }
        return m;
      }));
      setReplyContent(prev => ({ ...prev, [messageId]: "" }));
    } else {
      alert("Failed to send reply");
    }
    setIsReplying(prev => ({ ...prev, [messageId]: false }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Compose Section */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">Compose Message</CardTitle>
            <CardDescription>Target a batch or a personal student privately.</CardDescription>
          </CardHeader>
          <CardContent>
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Message Sent Successfully
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Batch</label>
                <select 
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    setSelectedStudentId(""); 
                  }}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All My Students (Broadcast)</option>
                  {initialBatches.map(b => (
                    <option key={b.id} value={b.id}>Batch: {b.name}</option>
                  ))}
                </select>
              </div>

              {selectedBatchId && studentsInBatch.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Personal Student (Optional)</label>
                  <select 
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900 dark:text-white"
                  >
                    <option value="">Entire Batch Broadcast</option>
                    {studentsInBatch.map((bs: any) => (
                      <option key={bs.studentId} value={bs.studentId}>
                        👤 {bs.student.user.name || bs.student.user.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 italic">Leave empty to send to everyone in "{selectedBatch.name}"</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Schedule Change, Exam Prep"
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement here..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm min-h-[150px] text-slate-900 dark:text-white"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSending || !subject || !content}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer h-12 text-base font-bold"
              >
                {isSending ? "Processing..." : selectedStudentId ? <><Send className="w-4 h-4 mr-2" /> Send Private Message</> : <><Send className="w-4 h-4 mr-2" /> Broadcast Now</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sent Messages History */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Communication History</h3>
        
        {messages.length === 0 ? (
           <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <Mail className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
             <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Messages Sent</h3>
             <p className="mt-1 text-sm text-slate-500">You haven't sent any broadcasts or private messages yet.</p>
           </div>
        ) : (
          messages.map((msg: any) => (
            <Card key={msg.id} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.studentId ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
              <CardContent className="p-5 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{msg.subject}</h4>
                  <span className="text-xs text-slate-400 font-mono">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                   {msg.studentId ? (
                     <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-800">
                       👤 PRIVATE TO: {msg.student?.user?.name || msg.student?.user?.email}
                     </span>
                   ) : (
                     <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded border border-purple-100 dark:border-purple-800">
                       📢 BROADCAST: {msg.batchId ? msg.batch?.name : "All Students"}
                     </span>
                   )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed mb-4">{msg.content}</p>

                {/* Replies Section */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="mt-6 space-y-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                    <h5 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mb-2">Discussion Thread</h5>
                    {msg.replies.map((reply: any) => (
                      <div key={reply.id} className="text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                            {reply.author?.email === email ? <ShieldCheck className="w-3 h-3 text-purple-500" /> : <User className="w-3 h-3 text-indigo-500" />}
                            {reply.author?.name || reply.author?.email}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{reply.content}</p>
                        {reply.isPrivate && (
                          <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-[9px] font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-sm">
                            <Lock className="w-2.5 h-2.5" /> DIRECT
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 p-4">
                <div className="flex w-full gap-2">
                  <Textarea 
                    placeholder="Reply to this thread..."
                    value={replyContent[msg.id] || ""}
                    onChange={(e) => setReplyContent(prev => ({ ...prev, [msg.id]: e.target.value }))}
                    className="flex-1 min-h-[40px] h-[40px] resize-none text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                  <Button 
                    size="sm"
                    disabled={isReplying[msg.id] || !replyContent[msg.id]?.trim()}
                    onClick={() => handleReplyToStudent(msg.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-[40px] px-3 font-bold"
                  >
                    {isReplying[msg.id] ? "..." : <MessageSquare className="w-4 h-4" />}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
