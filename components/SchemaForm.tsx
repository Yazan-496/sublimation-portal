'use client';

import { useState } from 'react';
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { saveJsonFile } from '@/app/actions';
import ImagePicker from './ImagePicker';
import clsx from 'clsx';

interface SchemaFormProps {
  initialData: any;
  path: string;
  sha: string;
  images: any[]; // Available images for picker
  repoDetails: {
    owner: string;
    repo: string;
    branch: string;
  };
}

export default function SchemaForm({ initialData, path, sha, images, repoDetails }: SchemaFormProps) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  
  // Use a ref to store the current callback for image selection
  const onImageSelectRef = useState<{ current: ((val: string) => void) | null }>({ current: null })[0];

  const getImageUrl = (value: string) => {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    const cleanValue = value.startsWith('/') ? value.substring(1) : value;
    const repoPath = cleanValue.startsWith('public/') ? cleanValue : `public/${cleanValue}`;
    return `https://raw.githubusercontent.com/${repoDetails.owner}/${repoDetails.repo}/${repoDetails.branch}/${repoPath}`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    const content = JSON.stringify(data, null, 2);
    const result = await saveJsonFile(path, content, sha);
    if (result.success) {
      setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'فشل الحفظ' });
    }
    setIsSaving(false);
  };

  const handleChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (arrayKey: string, index: number, fieldKey: string, value: any) => {
    setData((prev: any) => {
      const newArray = [...prev[arrayKey]];
      newArray[index] = { ...newArray[index], [fieldKey]: value };
      return { ...prev, [arrayKey]: newArray };
    });
  };

  const handleArrayChangePrimitive = (arrayKey: string, index: number, value: any) => {
    setData((prev: any) => {
      const newArray = [...prev[arrayKey]];
      newArray[index] = value;
      return { ...prev, [arrayKey]: newArray };
    });
  };

  const [focusTarget, setFocusTarget] = useState<{ key: string, index: number } | null>(null);

  const handleAddItem = (arrayKey: string) => {
    setData((prev: any) => {
      const existingArray = prev[arrayKey] || [];
      const firstItem = existingArray.length > 0 ? existingArray[0] : null;
      const isPrimitive = firstItem !== null && typeof firstItem !== 'object';
      
      let newItem;
      if (isPrimitive) {
        newItem = "";
      } else if (existingArray.length > 0) {
        newItem = Object.keys(firstItem).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
      } else {
        // Fallback for empty array
        const isList = arrayKey.toLowerCase().includes('keywords') || arrayKey.toLowerCase().includes('tags') || arrayKey.toLowerCase().includes('list');
        newItem = isList ? "" : { title: '', description: '' };
      }
      
      setFocusTarget({ key: arrayKey, index: existingArray.length });
      return { ...prev, [arrayKey]: [...existingArray, newItem] };
    });
  };

  const handleRemoveItem = (arrayKey: string, index: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    setData((prev: any) => {
      const newArray = [...prev[arrayKey]];
      newArray.splice(index, 1);
      return { ...prev, [arrayKey]: newArray };
    });
  };
  
  const handlePickImage = (onChange: (val: string) => void) => {
    onImageSelectRef.current = onChange;
    setShowPicker(true);
  };

  const handleImageSelected = (path: string) => {
    const storedPath = path.startsWith('public/') ? path.replace('public', '') : path;
    if (onImageSelectRef.current) {
        onImageSelectRef.current(storedPath);
    }
    setShowPicker(false);
  };

  const renderField = (key: string, value: any, onChange: (val: any) => void, isArrayItem = false, showLabel = true, disabled = false, autoFocus = false) => {
    const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('src') || (typeof value === 'string' && value.match(/\.(webp|jpg|png|jpeg)$/));
    const isLongText = key.toLowerCase().includes('description') || (typeof value === 'string' && value.length > 50);

    // Translation helper (simple mapping, can be expanded)
    const labelMap: Record<string, string> = {
      title: 'العنوان',
      subtitle: 'العنوان الفرعي',
      description: 'الوصف',
      image: 'الصورة',
      imageAlt: 'نص بديل للصورة',
      cta: 'نص الزر (CTA)',
      ctaLink: 'رابط الزر',
      secondaryCta: 'نص الزر الثانوي',
      secondaryCtaLink: 'رابط الزر الثانوي',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      whatsapp: 'رابط واتساب',
      location: 'الموقع',
      price: 'السعر',
      items: 'العناصر',
      keywords: 'الكلمات المفتاحية'
    };

    const label = labelMap[key.toLowerCase()] || key;

    if (isImage) {
      return (
        <div className="space-y-2">
          {showLabel && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{label}</label>}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 flex-shrink-0">
               {value ? (
                 <Image src={getImageUrl(value)} alt="Preview" fill className="object-cover" unoptimized />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">
                   <ImageIcon size={24} />
                 </div>
               )}
            </div>
            <div className="flex-1">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => onChange(e.target.value)}
                        className={clsx(
                            "flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-gray-100 text-left ltr",
                            disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800"
                        )}
                        placeholder="/images/..."
                        dir="ltr"
                        disabled={disabled}
                    />
                    <button 
                        onClick={() => handlePickImage(onChange)} 
                        className={clsx(
                            "px-3 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 whitespace-nowrap",
                            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                        disabled={disabled}
                    >
                        اختر صورة
                    </button>
                </div>
            </div>
          </div>
        </div>
      );
    }

    if (isLongText) {
      return (
        <div className="space-y-2">
          {showLabel && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{label}</label>}
          <textarea 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            autoFocus={autoFocus}
            className={clsx(
                "w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors text-gray-900 dark:text-gray-100",
                disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800"
            )}
            disabled={disabled}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {showLabel && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{label}</label>}
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className={clsx(
              "w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors text-gray-900 dark:text-gray-100",
              disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800"
          )}
          disabled={disabled}
        />
      </div>
    );
  };

  const renderArray = (key: string, items: any[]) => {
    const labelMap: Record<string, string> = {
        items: 'العناصر',
        features: 'المميزات',
        keywords: 'الكلمات المفتاحية'
    };
    const label = labelMap[key.toLowerCase()] || key;

    const isPrimitive = items.length > 0 && typeof items[0] !== 'object';

    return (
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 capitalize">قائمة {label}</h3>
            <button 
                onClick={() => handleAddItem(key)}
                className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
                <Plus size={16} /> إضافة عنصر
            </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
            {items.map((item, index) => {
                const isNewItem = focusTarget?.key === key && focusTarget?.index === index;
                
                return (
                <div key={index} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm relative group">
                    <button 
                        onClick={() => handleRemoveItem(key, index)}
                        className="absolute top-4 left-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="حذف العنصر"
                    >
                        <Trash2 size={18} />
                    </button>
                    
                    {isPrimitive ? (
                        <div className="pl-12">
                            {renderField(key, item, (val) => handleArrayChangePrimitive(key, index, val), true, false, false, isNewItem)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                            {Object.entries(item).map(([fieldKey, fieldValue], fieldIndex) => (
                                 <div key={fieldKey}>
                                    {renderField(fieldKey, fieldValue, (val) => handleArrayChange(key, index, fieldKey, val), true, true, false, isNewItem && fieldIndex === 0)}
                                 </div>
                            ))}
                        </div>
                    )}
                </div>
            )})}
        </div>
      </div>
    );
  };

  // Page title mapping based on path
  const pageTitles: Record<string, string> = {
    'data/hero.json': 'القسم الرئيسي (Hero)',
    'data/services.json': 'الخدمات',
    'data/products.json': 'المنتجات',
    'data/portfolio.json': 'معرض الأعمال',
    'data/contact.json': 'معلومات التواصل',
    'data/header.json': 'رأس الصفحة (Header)',
    'data/footer.json': 'تذييل الصفحة (Footer)',
    'data/offers.json': 'العروض',
    'data/testimonials.json': 'آراء العملاء',
    'data/site.json': 'إعدادات الموقع'
  };

  const pageTitle = pageTitles[path] || path.replace('data/', '').replace('.json', '');

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 mb-6 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{pageTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">إدارة محتوى هذا القسم</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={clsx(
            "flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg",
            isSaving ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {message && (
        <div className={clsx(
          "mb-6 p-4 rounded-lg text-center font-medium",
          message.type === 'success' ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
        )}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Render Top Level Fields */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800 grid grid-cols-1 gap-6">
            {Object.entries(data).map(([key, value]) => {
                if (Array.isArray(value)) return null; // Skip arrays here
                
                // Hide specific fields based on path
                if (path.includes('site.json') && ['robots', 'contact', 'social'].includes(key.toLowerCase())) {
                    return null;
                }

                // Disable specific fields based on path
                const isDisabled = path.includes('site.json') && !['robots', 'contact', 'social'].includes(key.toLowerCase());

                return <div key={key}>{renderField(key, value, (val) => handleChange(key, val), false, true, isDisabled)}</div>;
            })}
        </div>

        {/* Render Arrays */}
        {Object.entries(data).map(([key, value]) => {
            if (!Array.isArray(value)) return null;
            return <div key={key}>{renderArray(key, value)}</div>;
        })}
      </div>

      {showPicker && (
        <ImagePicker 
            images={images} 
            onClose={() => setShowPicker(false)} 
            onSelect={handleImageSelected}
        />
      )}
    </div>
  );
}
