'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Image as ImageIcon, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadImageAction, deleteFileAction } from '@/app/actions';
import Link from 'next/link';
import clsx from 'clsx';

interface FileItem {
  name: string;
  path: string;
  type: string;
  sha: string;
  download_url: string | null;
}

interface ImageGalleryProps {
  items: FileItem[];
  currentPath: string;
}

export default function ImageGallery({ items, currentPath }: ImageGalleryProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const targetPath = `${currentPath}/${file.name}`;
    formData.append('path', targetPath);
    
    const existing = items.find(i => i.name === file.name);
    if (existing) {
        if (!confirm(`الملف ${file.name} موجود بالفعل. هل تريد استبداله؟`)) {
            setUploading(false);
            return;
        }
        formData.append('sha', existing.sha);
    }

    await uploadImageAction(formData);
    setUploading(false);
    e.target.value = '';
    router.refresh();
  };

  const handleDelete = async (item: FileItem) => {
    if (!confirm(`هل أنت متأكد من حذف ${item.name}؟`)) return;
    
    setDeleting(item.path);
    await deleteFileAction(item.path, item.sha);
    setDeleting(null);
    router.refresh();
  };

  const parentPath = currentPath.split('/').slice(0, -1).join('/');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">المسار:</span> 
            <span className="font-mono text-blue-600 dark:text-blue-400 text-base" dir="ltr">{currentPath}</span>
        </h2>
        
        <label className={clsx(
            "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors",
            uploading && "opacity-50 cursor-not-allowed"
        )}>
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            <span>{uploading ? 'جاري الرفع...' : 'رفع صورة'}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {currentPath !== 'public/images' && (
         <Link href={`/images?path=${parentPath}`} className="mb-4 inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
             <Folder size={20} /> .. (للأعلى)
         </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.path} className="group relative border dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all">
            {item.type === 'dir' ? (
              <Link href={`/images?path=${item.path}`} className="flex flex-col items-center justify-center h-48 p-4 text-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <Folder size={48} className="text-blue-400 mb-2" />
                <span className="font-medium text-gray-700 dark:text-gray-300 truncate w-full" dir="ltr">{item.name}</span>
              </Link>
            ) : (
              <div className="relative h-48 bg-gray-100 dark:bg-zinc-800">
                {item.download_url && (
                    <div className="relative w-full h-full">
                        <Image 
                            src={item.download_url} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <button 
                     onClick={() => handleDelete(item)}
                     disabled={!!deleting}
                     className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                     title="حذف"
                   >
                     {deleting === item.path ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                   </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 p-2 text-xs truncate text-gray-900 dark:text-gray-100 text-center" dir="ltr">
                    {item.name}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {items.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
                لا توجد ملفات في هذا المجلد.
            </div>
        )}
      </div>
    </div>
  );
}
