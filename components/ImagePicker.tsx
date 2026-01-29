'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

interface ImagePickerProps {
  onSelect: (path: string) => void;
  onClose: () => void;
  images: any[]; // We'll pass the list of images
}

export default function ImagePicker({ onSelect, onClose, images }: ImagePickerProps) {
  const [search, setSearch] = useState('');

  const filteredImages = images.filter(img => 
    img.type !== 'dir' && img.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-zinc-800">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">اختر صورة</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <input 
            type="text" 
            placeholder="ابحث عن صورة..." 
            className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((img) => (
              <button 
                key={img.path} 
                onClick={() => onSelect(img.path)}
                className="group relative aspect-square border dark:border-zinc-800 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 hover:ring-2 hover:ring-blue-500 transition-all text-left"
              >
                {img.download_url && (
                    <Image 
                        src={img.download_url} 
                        alt={img.name} 
                        fill 
                        className="object-cover"
                        unoptimized
                    />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 p-1 text-[10px] truncate text-center text-gray-900 dark:text-gray-100" dir="ltr">
                    {img.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
