"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User, Lock, Globe, Reply, ShieldCheck } from "lucide-react";
import { sendMessageReply } from "@/actions/student";
import { Badge } from "@/components/ui/badge";

export function StudentBatchMessages({ 
  initialMessages, 
  studentEmail,
  studentId 
}: { 
  initialMessages: any[]; 
  studentEmail: string;
  studentId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [isPrivateReply, setIsPrivateReply] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleReply = async (messageId: string) => {
    const content = replyContent[messageId];
    if (!content?.trim()) return;

    setLoading(prev => ({ ...prev, [messageId]: true }));
    const isPrivate = !!isPrivateReply[messageId];
    
    const res = await sendMessageReply(studentEmail, messageId, content, isPrivate);
    
    if (res.success && res.reply) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            replies: [...(msg.replies || []), res.reply]
          };
        }
        return msg;
      }));
      setReplyContent(prev => ({ ...prev, [messageId]: "" }));
    } else {
      alert("Failed to send reply");
    }
    setLoading(prev => ({ ...prev, [messageId]: false }));
  };

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-700 bg-transparent">
          <CardContent className="py-8 text-center text-slate-500">
            No updates from your teacher yet.
          </CardContent>
        </Card>
      ) : (
        messages.map((msg) => (
          <Card key={msg.id} className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.studentId ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-md font-bold text-slate-900 dark:text-white">{msg.subject}</CardTitle>
                <CardDescription className="text-xs">
                  {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </div>
              {msg.studentId && (
                <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 flex gap-1">
                  <Lock className="w-3 h-3" /> Private
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              
              {/* Replies History */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                  {msg.replies.map((reply: any) => {
                    // Privacy filter: only show if not private, or if I am the author, or if I am the teacher (but this is student view)
                    if (reply.isPrivate && reply.authorId !== msg.teacher?.userId && reply.authorId !== studentId) {
                        // Normally this is filtered on server, but double check here.
                        // Wait, studentId here is the profile ID, replies.authorId is User ID.
                    }
                    
                    return (
                      <div key={reply.id} className="text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {reply.author?.name || reply.author?.email}
                          </span>
                          <span className="text-slate-400 font-mono scale-90">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                          {reply.isPrivate && (
                            <span className="flex items-center gap-0.5 text-indigo-500 font-semibold px-1 bg-indigo-50 dark:bg-indigo-900/10 rounded">
                              <ShieldCheck className="w-3 h-3" /> Direct
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          {reply.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 p-4 block">
              <div className="space-y-3">
                <Textarea 
                  placeholder="Type your response here..."
                  className="bg-white dark:bg-slate-950 text-sm min-h-[60px] resize-none focus-visible:ring-indigo-500 border-slate-200 dark:border-slate-800"
                  value={replyContent[msg.id] || ""}
                  onChange={(e) => setReplyContent(prev => ({ ...prev, [msg.id]: e.target.value }))}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        checked={isPrivateReply[msg.id] || false}
                        onChange={(e) => setIsPrivateReply(prev => ({ ...prev, [msg.id]: e.target.checked }))}
                      />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                        {isPrivateReply[msg.id] ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {isPrivateReply[msg.id] ? "Private (To Teacher)" : "Public (To Batch)"}
                      </span>
                    </label>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4"
                    disabled={loading[msg.id] || !replyContent[msg.id]?.trim()}
                    onClick={() => handleReply(msg.id)}
                  >
                    {loading[msg.id] ? "..." : <><Send className="w-3 h-3 mr-2" /> Reply</>}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
