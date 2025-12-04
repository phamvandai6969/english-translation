"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isAdminPage = pathname?.includes('/admin');
  
  // Navigation items for user
  const navItems = [
    { name: 'Trang chủ', path: '/', icon: '🏠' },
    { name: 'Luyện dịch', path: '/practice', icon: '✍️' },
    { name: 'Tiến trình', path: '/progress', icon: '📊' },
    { name: 'Hướng dẫn', path: '/guide', icon: '📖' },
  ];
  
  // Navigation items for admin
  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Bài tập', path: '/admin/dashboard?tab=exercises', icon: '📝' },
    { name: 'Người dùng', path: '/admin/dashboard?tab=users', icon: '👥' },
    { name: 'Cài đặt', path: '/admin/dashboard?tab=settings', icon: '⚙️' },
  ];
  
  const currentNavItems = isAdminPage ? adminNavItems : navItems;
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-xl">🌐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">English Translation</h1>
                <p className="text-xs text-gray-500">Practice makes perfect</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {currentNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  pathname === item.path || 
                  (item.path.includes('?') && pathname?.includes(item.path.split('?')[0]))
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Admin link if not on admin page */}
            {!isAdminPage && (
              <Link
                href="/admin/login"
                className="ml-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
              >
                <span>🔒</span>
                Admin
              </Link>
            )}
            
            {/* Toggle dark mode (future feature) */}
            <button className="ml-4 p-2 rounded-lg hover:bg-gray-100">
              <span className="text-xl">🌙</span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-1">
              {currentNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-4 py-3 rounded-lg flex items-center gap-3 ${
                    pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {!isAdminPage && (
                <Link
                  href="/admin/login"
                  className="block px-4 py-3 bg-gray-800 text-white rounded-lg mt-2 flex items-center gap-3"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-xl">🔒</span>
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}