"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, FileJson, Image as ImageIcon, Menu, X, Globe, Phone, Briefcase, Box, ShoppingBag, Layers, Percent, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
            <span className="font-bold text-gray-800 dark:text-gray-100">لوحة التحكم</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 md:translate-x-0 md:static",
        isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">لوحة التحكم</h1>
          <div className="md:hidden">
              <button onClick={() => setIsOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
          </div>
          <div className="hidden md:block">
             <ThemeToggle />
          </div>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            <NavItem href="/" icon={<LayoutDashboard size={20} />} label="نظرة عامة" active={pathname === '/'} onClick={() => setIsOpen(false)} />
            
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                الصفحات
            </div>
            <NavItem href="/data/hero" icon={<Layers size={20} />} label="القسم الرئيسي (Hero)" active={pathname === '/data/hero'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/services" icon={<Briefcase size={20} />} label="الخدمات" active={pathname === '/data/services'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/products" icon={<ShoppingBag size={20} />} label="المنتجات" active={pathname === '/data/products'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/portfolio" icon={<Box size={20} />} label="معرض الأعمال" active={pathname === '/data/portfolio'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/offers" icon={<Percent size={20} />} label="العروض" active={pathname === '/data/offers'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/testimonials" icon={<Heart size={20} />} label="آراء العملاء" active={pathname === '/data/testimonials'} onClick={() => setIsOpen(false)} />

            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                إعدادات عامة
            </div>
            <NavItem href="/data/header" icon={<LayoutDashboard size={20} />} label="رأس الصفحة (Header)" active={pathname === '/data/header'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/footer" icon={<LayoutDashboard size={20} />} label="تذييل الصفحة (Footer)" active={pathname === '/data/footer'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/contact" icon={<Phone size={20} />} label="معلومات التواصل" active={pathname === '/data/contact'} onClick={() => setIsOpen(false)} />
            <NavItem href="/data/site" icon={<Globe size={20} />} label="بيانات الموقع" active={pathname === '/data/site'} onClick={() => setIsOpen(false)} />

            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                الوسائط
            </div>
            <NavItem href="/images" icon={<ImageIcon size={20} />} label="مكتبة الصور" active={pathname.startsWith('/images')} onClick={() => setIsOpen(false)} />
        </nav>

        <div className="p-4 text-xs text-gray-400 dark:text-gray-500 text-center border-t border-gray-200 dark:border-zinc-800">
          بوابة الطباعة الحرارية CMS
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-10 overflow-y-auto pt-16 md:pt-0 p-4 md:p-8 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
        {children}
      </main>
    </div>
  )
}

function NavItem({ href, icon, label, active, onClick }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                active 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
