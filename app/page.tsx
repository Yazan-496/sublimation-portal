import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">مرحباً بك في لوحة التحكم</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        قم بإدارة محتوى موقعك وملفات الوسائط مباشرة من هنا.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">إدارة المحتوى</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">تعديل ملفات البيانات الخاصة بصفحات الموقع.</p>
          <Link href="/data/hero" className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1">الذهاب إلى البيانات &larr;</Link>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">مكتبة الوسائط</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">رفع وإدارة الصور والملفات.</p>
          <Link href="/images" className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1">الذهاب إلى الصور &larr;</Link>
        </div>
      </div>
    </div>
  );
}
