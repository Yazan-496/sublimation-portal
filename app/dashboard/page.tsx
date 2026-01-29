export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to the Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Manage your website content and media files directly from here. 
        Changes are committed to the GitHub repository automatically.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-gray-500 mb-4">Edit JSON data files for your site pages.</p>
          <a href="/dashboard/data" className="text-blue-600 hover:underline font-medium">Go to Data &rarr;</a>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Media Library</h2>
          <p className="text-gray-500 mb-4">Upload and manage images.</p>
          <a href="/dashboard/images" className="text-blue-600 hover:underline font-medium">Go to Images &rarr;</a>
        </div>
      </div>
    </div>
  );
}
