export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Payment Header */}
        <div className="bg-indigo-600 p-6 text-white text-center">
           <h2 className="text-2xl font-bold mb-1">Complete Subscription</h2>
           <p className="text-indigo-100 text-sm">You are subscribing to secure platform access.</p>
        </div>
        
        {/* Order Summary */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 font-medium">Monthly Access Pass</span>
            <span className="text-slate-900 dark:text-white font-bold">₹500.00</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-400">
             <span>Platform Fee</span>
             <span>₹0.00</span>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 flex justify-between items-center">
             <span className="font-bold text-slate-700 dark:text-slate-300">Total Due Today</span>
             <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">₹500.00</span>
          </div>
        </div>

         {/* Mock Stripe Element */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Information</label>
               <div className="h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-500 flex items-center justify-between shadow-sm">
                  <span>•••• •••• •••• 4242</span>
                  <div className="flex gap-2">
                     <span className="bg-slate-200 dark:bg-slate-800 px-2 rounded text-xs">MM/YY</span>
                     <span className="bg-slate-200 dark:bg-slate-800 px-2 rounded text-xs">CVC</span>
                  </div>
               </div>
             </div>
             <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400 font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform flex justify-center items-center gap-2">
               Pay ₹500.00
             </button>
             <p className="text-center text-xs text-slate-400 mt-4 flex justify-center items-center gap-1">
                🔒 Secured by Mock Stripe Gateway
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
