import { getFileContent, getDirectoryContents } from '@/lib/github';
import SchemaForm from '@/components/SchemaForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ path: string }>;
}

export default async function EditPage({ searchParams }: PageProps) {
  const { path } = await searchParams;

  if (!path) {
    return <div>Missing path parameter</div>;
  }

  try {
    const data = await getFileContent(path);
    const jsonData = JSON.parse(data.content);

    // Fetch images for the picker
    let images: any[] = [];
    try {
        // Fetch from multiple potential image directories
        const [rootImages, productImages, serviceImages, portfolioImages] = await Promise.all([
            getDirectoryContents('public/images').catch(() => []),
            getDirectoryContents('public/images/products').catch(() => []),
            getDirectoryContents('public/images/services').catch(() => []),
            getDirectoryContents('public/images/portfolio').catch(() => [])
        ]);
        images = [...rootImages, ...productImages, ...serviceImages, ...portfolioImages];
    } catch (e) {
        console.error("Failed to fetch images", e);
    }

    const repoDetails = {
      owner: process.env.TARGET_REPO_OWNER || '',
      repo: process.env.TARGET_REPO_NAME || '',
      branch: process.env.TARGET_REPO_BRANCH || 'main',
    };

    return (
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mb-6 transition-colors">
            <ArrowLeft size={16} /> العودة للرئيسية
        </Link>
        
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تعديل المحتوى</h1>
            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm" dir="ltr">{path}</p>
        </div>

        <SchemaForm 
            initialData={jsonData} 
            path={path} 
            sha={data.sha} 
            images={images}
            repoDetails={repoDetails}
        />
      </div>
    );
  } catch (error) {
    return (
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">خطأ في تحميل الملف</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">لم نتمكن من جلب الملف {path}. تأكد من صحة إعدادات GitHub وتوفر الملف.</p>
            <Link href="/data" className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                العودة للقائمة
            </Link>
        </div>
    );
  }
}
