import { getDirectoryContents } from '@/lib/github';
import ImageGallery from '@/components/ImageGallery';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ path?: string }>;
}

export default async function ImagesPage({ searchParams }: PageProps) {
  const { path } = await searchParams;
  const currentPath = path || 'public/images';

  try {
    const items = await getDirectoryContents(currentPath);
    
    // Sort: directories first, then files
    const sortedItems = items.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
    });

    return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Media Library</h1>
         <ImageGallery items={sortedItems as any} currentPath={currentPath} />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <div>
          <p className="font-bold">Error loading images</p>
          <p className="text-sm">Could not fetch {currentPath}. Check permissions or if path exists.</p>
        </div>
      </div>
    );
  }
}
