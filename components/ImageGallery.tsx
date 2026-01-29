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
    // Construct path: currentPath + filename
    // Ensure currentPath doesn't end with slash unless it's just root (rare)
    const targetPath = `${currentPath}/${file.name}`;
    formData.append('path', targetPath);
    
    // Check if replacing (find sha)
    const existing = items.find(i => i.name === file.name);
    if (existing) {
        if (!confirm(`File ${file.name} already exists. Replace it?`)) {
            setUploading(false);
            return;
        }
        formData.append('sha', existing.sha);
    }

    await uploadImageAction(formData);
    setUploading(false);
    // Reset input
    e.target.value = '';
    router.refresh();
  };

  const handleDelete = async (item: FileItem) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    
    setDeleting(item.path);
    await deleteFileAction(item.path, item.sha);
    setDeleting(null);
    router.refresh();
  };

  const parentPath = currentPath.split('/').slice(0, -1).join('/');
  const isRoot = currentPath === 'public/images' || currentPath === 'public'; // Adjust based on base path

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-gray-500">Path:</span> 
            <span className="font-mono text-blue-600">{currentPath}</span>
        </h2>
        
        <label className={clsx(
            "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors",
            uploading && "opacity-50 cursor-not-allowed"
        )}>
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {currentPath !== 'public/images' && (
         <Link href={`/dashboard/images?path=${parentPath}`} className="mb-4 inline-flex items-center gap-2 text-gray-500 hover:text-gray-800">
             <Folder size={20} /> .. (Up one level)
         </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.path} className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
            {item.type === 'dir' ? (
              <Link href={`/dashboard/images?path=${item.path}`} className="flex flex-col items-center justify-center h-48 p-4 text-center hover:bg-gray-50">
                <Folder size={48} className="text-blue-400 mb-2" />
                <span className="font-medium text-gray-700 truncate w-full">{item.name}</span>
              </Link>
            ) : (
              <div className="relative h-48 bg-gray-100">
                {item.download_url && (
                    <div className="relative w-full h-full">
                         {/* We use unoptimized because we are fetching raw from GitHub */}
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
                     title="Delete"
                   >
                     {deleting === item.path ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                   </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs truncate">
                    {item.name}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {items.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-lg">
                No files in this directory.
            </div>
        )}
      </div>
    </div>
  );
}
