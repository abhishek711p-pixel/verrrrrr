"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateSubscriptionFee } from "@/actions/teacher";

interface SubscriptionFeeUpdaterProps {
  initialFee: number;
  email: string;
}

export function SubscriptionFeeUpdater({ initialFee, email }: SubscriptionFeeUpdaterProps) {
  const [fee, setFee] = useState(initialFee);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const result = await updateSubscriptionFee(email, fee);
    if (result && result.success) {
      setFee(result.fee);
      setIsEditing(false);
    } else {
      alert(result?.error || "Failed to update fee");
    }
    setIsUpdating(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 mb-4">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">Current Monthly Fee</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{fee}</p>
        </div>
        {!isEditing && (
          <Button 
            variant="secondary" 
            onClick={() => setIsEditing(true)}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
          >
            Range
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 mb-4 transition-all w-full">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>₹200</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{fee}</span>
            <span>₹1000</span>
          </div>
          <input 
            type="range" 
            min="200" 
            max="1000" 
            step="50" 
            value={fee} 
            onChange={(e) => setFee(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-600"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setFee(initialFee);
                setIsEditing(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Select"}
            </Button>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-500">Allowed range is ₹200 - ₹1000 per month.</p>
    </div>
  );
}
