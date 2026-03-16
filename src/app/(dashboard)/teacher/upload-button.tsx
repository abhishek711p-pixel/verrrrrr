"use client";

import { Button } from "@/components/ui/button";

export function UploadButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("YOU MAY ADD THE VIDEO ONCE THE WEBSITE IS LIVE");
  };

  return (
    <Button 
      type="button"
      onClick={handleClick}
      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
    >
      Upload New Video
    </Button>
  );
}
