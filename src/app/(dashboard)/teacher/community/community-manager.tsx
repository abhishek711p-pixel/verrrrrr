"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, Clock, Send, MessageCircle } from "lucide-react";
import { createCommunityPost } from "@/actions/teacher";

export function CommunityManager({ initialPosts, email }: { initialPosts: any[], email: string }) {
  const [activeTab, setActiveTab] = useState<"past" | "scheduled">("past");
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  
  const pastPosts = posts.filter(p => !p.scheduledFor || new Date(p.scheduledFor) <= now);
  const scheduledPosts = posts.filter(p => p.scheduledFor && new Date(p.scheduledFor) > now);

  const handleStudentMessagesClick = () => {
    alert("Let the website be live then you may see student message");
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    alert("YOU MAY PUBLISH IT AFTER WEBSITE IS LIVE");
    
    // Clear the form
    setNewPostContent("");
    setScheduledDate("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Post Creation & Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Post Form */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Create a Post or Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your schedule for the week or a new announcement..."
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
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                   {isSubmitting ? "Posting..." : scheduledDate ? <><Clock className="w-4 h-4 mr-2" /> Schedule Post</> : <><Send className="w-4 h-4 mr-2" /> Publish Now</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Feed Tabs */}
        <div>
          <div className="flex space-x-1 mb-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg inline-flex">
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

          <div className="space-y-4">
            {(activeTab === "past" ? pastPosts : scheduledPosts).length > 0 ? (
              (activeTab === "past" ? pastPosts : scheduledPosts).map((post: any) => (
                <Card key={post.id} className="border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">You</p>
                          <p className="text-xs text-slate-500">
                            {post.scheduledFor && new Date(post.scheduledFor) > now 
                              ? `Scheduled for: ${new Date(post.scheduledFor).toLocaleString()}`
                              : `Posted on: ${new Date(post.createdAt).toLocaleDateString()}`
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
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>
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
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> 
              Student Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Connect with your enrolled students. Answer their doubts and questions directly.
            </p>
            <Button 
              onClick={handleStudentMessagesClick}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 cursor-pointer"
            >
              See Student Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
