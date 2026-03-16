"use client";

import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function SchedulePostButton() {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/teacher/community");
  };

  return (
    <Button 
      type="button"
      onClick={handleClick}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
    >
      <MessageSquarePlus className="w-4 h-4 mr-2" /> Schedule a Post
    </Button>
  );
}
