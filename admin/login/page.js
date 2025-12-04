// app/admin/login/AdminLogin.js

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => { // Sử dụng async
    e.preventDefault();
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ⚠️ Gửi request đến API Route an toàn
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // API đã xác thực thành công, lưu cờ xác thực tạm thời
        // 💡 Lý tưởng: API Route sẽ set HTTP-only cookie
        localStorage.setItem('adminAuthenticated', 'true'); 
        router.push('/admin/dashboard');
      } else {
        // API trả về lỗi (ví dụ: 401 Unauthorized)
        const data = await response.json();
        setError(data.message || 'Mật khẩu không đúng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error("Login API Error:", err);
      setError('Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng.');
    } finally {
      // Đảm bảo loading luôn tắt
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Đăng nhập để quản lý bài tập</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu Admin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mật khẩu..."
              required
            />
            {/* ❌ Đã xóa dòng "Mật khẩu mặc định: admin123" */}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-150"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}