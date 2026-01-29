import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ message = "جاري التحميل..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
}
