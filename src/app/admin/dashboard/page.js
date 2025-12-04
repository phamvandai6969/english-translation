"use client";
// Bổ sung các lệnh export để buộc Next.js render trang này một cách động.
// Điều này ngăn chặn quá trình prerendering (Static Generation) trên Server, 
// nơi gây ra lỗi ReferenceError: localStorage is not defined.
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Vô hiệu hóa cache cho trang này (tùy chọn nhưng an toàn)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ExerciseList from '@/components/admin/ExerciseList';
import ExerciseForm from '@/components/admin/ExerciseForm';
import StatsDashboard from '@/components/admin/StatsDashboard';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('exercises');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false); // Thêm cờ để kiểm tra đã mount trên client chưa
  const router = useRouter();

  // Kiểm tra xác thực VÀ đảm bảo code chạy trên Client
  useEffect(() => {
    // 1. Đánh dấu component đã mount và đang chạy trên trình duyệt
    setIsClient(true); 

    // 2. Chỉ thực hiện logic localStorage khi đã chắc chắn trên client
    if (typeof window !== 'undefined') { 
      const authStatus = localStorage.getItem('adminAuthenticated') === 'true';
      setIsAuthenticated(authStatus);

      if (!authStatus) {
        // Chuyển hướng nếu chưa đăng nhập
        router.push('/admin/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    // CHỈ CHẠY CODE NÀY TRÊN BROWSER
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuthenticated');
    }
    router.push('/admin/login');
  };

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setActiveTab('edit');
  };

  const handleCreateNew = () => {
    setSelectedExercise(null);
    setActiveTab('edit');
  };

  // Hiển thị trạng thái Loading cho đến khi xác thực hoàn tất trên Client
  // 1. isClient === false: Đang ở Server (prerender) hoặc chưa mount -> Hiển thị loading an toàn
  // 2. isAuthenticated === false: Đã mount, đã kiểm tra localStorage, nhưng chưa đăng nhập -> Chờ chuyển hướng
  if (!isClient || !isAuthenticated) {
     // Dùng isClient để tránh Server render ra HTML bị lỗi xác thực
     // Chỉ hiển thị loading nếu đang ở Client và chưa xác thực
     if (isClient && !isAuthenticated) {
        // Nếu đã kiểm tra xong trên client nhưng chưa xác thực, sẽ chuyển hướng
        // (Đây là fallback nếu router.push chưa kịp hoạt động)
        return <div className="flex justify-center items-center h-screen text-lg">Đang chuyển hướng...</div>;
     }
     
     // Nếu đang ở Server (isClient=false), trả về null hoặc loading an toàn
     // (Giúp Vercel Prerender một trang rỗng an toàn)
     return <div className="flex justify-center items-center h-screen text-lg">Đang tải...</div>;
  }
  
  // Nếu đã xác thực (isAuthenticated === true), hiển thị nội dung chính
  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'exercises', label: '📝 Bài tập', icon: '📝' },
              { id: 'edit', label: selectedExercise ? '✏️ Sửa bài' : '➕ Thêm mới', icon: selectedExercise ? '✏️' : '➕' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <StatsDashboard />}
          {activeTab === 'exercises' && (
            <ExerciseList 
              onEdit={handleEditExercise}
              onCreateNew={handleCreateNew}
            />
          )}
          {activeTab === 'edit' && (
            <ExerciseForm 
              exercise={selectedExercise}
              onSuccess={() => setActiveTab('exercises')}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}