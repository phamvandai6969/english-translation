"use client";
import { useState, useEffect } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Load từ localStorage
    const progressData = localStorage.getItem('translationProgress');
    const progress = progressData ? JSON.parse(progressData) : {};
    
    const userList = Object.entries(progress).map(([userId, data]) => ({
      id: userId,
      exercisesCompleted: Object.values(data).filter(ex => ex.completed).length,
      totalAttempts: Object.values(data).reduce((sum, ex) => sum + (ex.attempts || 0), 0),
      avgScore: Object.values(data).length > 0 
        ? (Object.values(data).reduce((sum, ex) => sum + (ex.score || 0), 0) / Object.values(data).length).toFixed(1)
        : 0,
      lastActive: data.lastUpdated || 'Chưa có',
      level: Object.values(data).length >= 10 ? 'B1' : 'A1-A2'
    }));
    
    setUsers(userList);
  };

  const filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level) => {
    return level === 'B1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Quản lý người dùng</h2>
          <p className="text-gray-600">Tổng số: {users.length} người dùng</p>
        </div>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bài đã hoàn thành</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lần thử</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm TB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cấp độ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lần cuối</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    User #{index + 1}
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {user.id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-lg font-bold text-blue-600">
                    {user.exercisesCompleted}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-lg font-bold text-green-600">
                    {user.totalAttempts}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-lg font-bold ${
                    user.avgScore >= 8 ? 'text-green-600' : 
                    user.avgScore >= 6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {user.avgScore}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                    {user.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.lastActive).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  📭 Không có dữ liệu người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Người dùng tích cực</p>
          <p className="text-2xl font-bold text-blue-700">
            {users.filter(u => u.exercisesCompleted >= 5).length}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Tổng bài hoàn thành</p>
          <p className="text-2xl font-bold text-green-700">
            {users.reduce((sum, u) => sum + u.exercisesCompleted, 0)}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Điểm trung bình</p>
          <p className="text-2xl font-bold text-yellow-700">
            {users.length > 0 
              ? (users.reduce((sum, u) => sum + parseFloat(u.avgScore), 0) / users.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600">Tổng lượt thực hành</p>
          <p className="text-2xl font-bold text-purple-700">
            {users.reduce((sum, u) => sum + u.totalAttempts, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}