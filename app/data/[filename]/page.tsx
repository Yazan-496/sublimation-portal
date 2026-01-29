import { getFileContent, getDirectoryContents } from '@/lib/github';
import SchemaForm from '@/components/SchemaForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ filename: string }>;
}

async function getAllImages() {
  const paths = [
    'public/images',
    'public/images/services',
    'public/images/products',
    'public/images/portfolio'
  ];

  let allImages: any[] = [];

  for (const path of paths) {
    try {
      const items = await getDirectoryContents(path);
      const images = items.filter(item => item.type !== 'dir');
      allImages = [...allImages, ...images];
    } catch (e) {
      // Ignore errors (e.g. folder doesn't exist)
    }
  }

  // Remove duplicates based on path
  return Array.from(new Map(allImages.map(item => [item.path, item])).values());
}

export default async function DataFilePage({ params }: PageProps) {
  const { filename } = await params;
  const path = `data/${filename}.json`;

  const repoDetails = {
    owner: process.env.TARGET_REPO_OWNER!,
    repo: process.env.TARGET_REPO_NAME!,
    branch: process.env.TARGET_REPO_BRANCH || 'main',
  };

  try {
    const [fileData, images] = await Promise.all([
      getFileContent(path),
      getAllImages()
    ]);

    const initialData = JSON.parse(fileData.content);

    return (
      <div>
        <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                <ArrowLeft size={16} /> العودة للرئيسية
            </Link>
        </div>
        
        <SchemaForm 
            initialData={initialData} 
            path={path} 
            sha={fileData.sha} 
            images={images}
            repoDetails={repoDetails}
        />
      </div>
    );
  } catch (error) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading File</h2>
            <p className="text-gray-600 dark:text-gray-400">Could not fetch {path}. Make sure the file exists.</p>
            <Link href="/data" className="mt-4 inline-block text-blue-600 underline">Go back</Link>
        </div>
    );
  }
}
