'use client';

import { useState } from 'react';
import { saveJsonFile } from '@/app/actions';
import { Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface JsonEditorProps {
  initialContent: string;
  path: string;
  sha: string;
}

export default function JsonEditor({ initialContent, path, sha }: JsonEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    const result = await saveJsonFile(path, content, sha);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'File saved successfully!' });
      // In a real app, we might want to update the SHA here if we stay on the page, 
      // but for now a refresh or re-fetch would be ideal. 
      // Since server action revalidates, a router.refresh() might be needed if we tracked SHA in state.
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to save' });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Editing: <span className="text-blue-600 font-mono text-base">{path}</span></h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            isSaving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={clsx(
          "p-4 rounded-lg flex items-center gap-2",
          message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {message.text}
        </div>
      )}

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[600px] p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
