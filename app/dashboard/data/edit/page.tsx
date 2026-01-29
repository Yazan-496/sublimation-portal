import { getFileContent } from '@/lib/github';
import JsonEditor from '@/components/JsonEditor';
import { ArrowLeft } from 'lucide-react';
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

    // Pretty print JSON
    const formattedContent = JSON.stringify(JSON.parse(data.content), null, 2);

    return (
      <div>
        <Link href="/dashboard/data" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Files
        </Link>
        <JsonEditor initialContent={formattedContent} path={path} sha={data.sha} />
      </div>
    );
  } catch (error) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading File</h2>
            <p className="text-gray-600">Could not fetch {path}. Make sure the file exists and your token is valid.</p>
            <Link href="/dashboard/data" className="mt-4 inline-block text-blue-600 underline">Go back</Link>
        </div>
    );
  }
}
