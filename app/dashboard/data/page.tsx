import Link from "next/link";
import { FileJson, AlertCircle } from "lucide-react";
import { getDirectoryContents } from "@/lib/github";

export const dynamic = 'force-dynamic';

export default async function DataFilesPage() {
  try {
    const files = await getDirectoryContents("data");
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Data Files</h1>
        <div className="grid gap-4">
          {jsonFiles.map((file) => (
            <Link
              key={file.path}
              href={`/dashboard/data/edit?path=${encodeURIComponent(file.path)}`}
              className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                  <FileJson size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{file.path}</p>
                </div>
              </div>
            </Link>
          ))}
          {jsonFiles.length === 0 && (
            <p className="text-gray-500">No JSON files found in data folder.</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <div>
          <p className="font-bold">Error loading files</p>
          <p className="text-sm">Check if your .env variables are set correctly.</p>
        </div>
      </div>
    );
  }
}
