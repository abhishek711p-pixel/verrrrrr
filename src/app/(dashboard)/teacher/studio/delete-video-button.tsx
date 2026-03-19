"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteVideo } from "@/actions/teacher";

interface DeleteVideoButtonProps {
  videoId: string;
  videoTitle: string;
  userEmail: string;
}

export function DeleteVideoButton({ videoId, videoTitle, userEmail }: DeleteVideoButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteVideo(userEmail, videoId);
    setIsDeleting(false);

    if (res.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(res.error || "Failed to delete video.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          title="Delete Video"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-none shadow-2xl rounded-3xl overflow-hidden p-0 dark:bg-slate-950">
        <div className="h-2 bg-gradient-to-r from-rose-500 to-red-600" />
        <div className="p-6 space-y-6">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Lecture Video?</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-white">"{videoTitle}"</span>? This action cannot be undone and students will lose access.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-slate-200 dark:border-slate-800"
              disabled={isDeleting}
            >
              Keep Video
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-500/20"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
