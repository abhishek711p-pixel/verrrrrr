"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function SubscribeButton() {
  const handleClick = () => {
    alert("The batch admission will begin shortly. Thank you!");
  };

  return (
    <Button 
      onClick={handleClick}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
    >
      <PlusCircle className="w-4 h-4 mr-2" /> Subscribe at ₹300
    </Button>
  );
}
