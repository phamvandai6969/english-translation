"use client";
import { useState } from 'react';

export default function AdminLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                ☰
              </button>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Quản lý bài tập
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('vi-VN')}
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-gray-900 text-white min-h-[calc(100vh-73px)] p-6">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">📚 Quản lý</h2>
              <ul className="space-y-2">
                <li>
                  <a href="/admin/dashboard" className="block p-3 rounded-lg hover:bg-gray-800">
                    📊 Dashboard
                  </a>
                </li>
                <li>
                  <a href="/admin/dashboard?tab=exercises" className="block p-3 rounded-lg hover:bg-gray-800">
                    📝 Bài tập
                  </a>
                </li>
                <li>
                  <a href="/admin/dashboard?tab=edit" className="block p-3 rounded-lg hover:bg-gray-800">
                    ➕ Thêm bài mới
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">⚙️ Cài đặt</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="block p-3 rounded-lg hover:bg-gray-800">
                    🔧 Cấu hình
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 rounded-lg hover:bg-gray-800">
                    👥 Người dùng
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm">
                💡 <strong>Mẹo:</strong> Nhấp vào bài tập để sửa hoặc xóa
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={`flex-1 p-6 ${sidebarOpen ? 'ml-0' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}