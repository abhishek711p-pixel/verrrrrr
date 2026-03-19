"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, Clock, Send, MessageCircle, Users, Globe } from "lucide-react";
import { createCommunityPost } from "@/actions/teacher";
import { useRouter } from "next/navigation";

export function CommunityManager({ 
  initialPosts, 
  email, 
  batches 
}: { 
  initialPosts: any[], 
  email: string,
  batches: any[]
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"past" | "scheduled">("past");
  const [newPostContent, setNewPostContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  // Group posts by scheduled date
  const now = new Date();
  const pastPosts = initialPosts.filter(p => !p.scheduledFor || new Date(p.scheduledFor) <= now);
  const scheduledPosts = initialPosts.filter(p => p.scheduledFor && new Date(p.scheduledFor) > now);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const scheduledDateObj = scheduledDate ? new Date(scheduledDate) : null;
      const batchId = selectedBatchId === "all" ? null : selectedBatchId;
      
      const result = await createCommunityPost(email, newPostContent, scheduledDateObj, batchId);
      
      if (result.success) {
        setStatusMsg({
          type: 'success', 
          text: scheduledDateObj ? "Post scheduled successfully!" : "Post published successfully!"
        });
        setNewPostContent("");
        setScheduledDate("");
        setSelectedBatchId("all");
        router.refresh();
        // Hide message after 3 seconds
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        setStatusMsg({type: 'error', text: result.error || "Failed to create post"});
      }
    } catch (error) {
      setStatusMsg({type: 'error', text: "An unexpected error occurred"});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Post Creation & Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Post Form */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Create a Post or Announcement</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <select 
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Students</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      Batch: {batch.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {statusMsg && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
              }`}>
                {statusMsg.text}
              </div>
            )}
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={selectedBatchId === "all" ? "Share an announcement with ALL your students..." : `Send a message to ${batches.find(b => b.id === selectedBatchId)?.name} students...`}
                className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center w-full sm:w-auto">
                  <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-transparent text-sm w-full dark:text-white focus:outline-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-6"
                >
                   {isSubmitting ? "Posting..." : scheduledDate ? <><Clock className="w-4 h-4 mr-2" /> Schedule</> : <><Send className="w-4 h-4 mr-2" /> Publish Now</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Feed Tabs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                  activeTab === "past" 
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Past Posts
              </button>
              <button
                onClick={() => setActiveTab("scheduled")}
                className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                  activeTab === "scheduled" 
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                 Scheduled ({scheduledPosts.length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(activeTab === "past" ? pastPosts : scheduledPosts).length > 0 ? (
              (activeTab === "past" ? pastPosts : scheduledPosts).map((post: any) => (
                <Card key={post.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 dark:text-white">You</p>
                            {post.batch ? (
                              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                <Users className="w-2.5 h-2.5" />
                                {post.batch.name}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                                <Globe className="w-2.5 h-2.5" />
                                All Students
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {post.scheduledFor && new Date(post.scheduledFor) > now 
                              ? `Scheduled for: ${new Date(post.scheduledFor).toLocaleString()}`
                              : `Posted: ${new Date(post.createdAt).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      {post.scheduledFor && new Date(post.scheduledFor) > now && (
                         <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                           Upcoming
                         </span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                  No {activeTab === "past" ? "past" : "scheduled"} posts
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {activeTab === "past" ? "Share your first update with your students!" : "You don't have any upcoming posts scheduled."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Messages Sidebar */}
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> 
              Student Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 italic">
              "Connect with your enrolled students. Answer their doubts and questions directly."
            </p>
            <Button 
              onClick={() => setStatusMsg({type: 'info', text: "Student messaging portal is coming soon!"})}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              Open Student Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
