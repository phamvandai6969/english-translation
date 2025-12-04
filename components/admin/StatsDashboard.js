"use client";
import { useState, useEffect } from 'react';
import { getExercises } from '@/utils/database';

export default function StatsDashboard() {
  const [stats, setStats] = useState({
    totalExercises: 0,
    levelCounts: {},
    categoryCounts: {},
    recentExercises: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const exercises = getExercises();
    
    // Calculate level counts
    const levelCounts = {};
    exercises.forEach(ex => {
      levelCounts[ex.level] = (levelCounts[ex.level] || 0) + 1;
    });
    
    // Calculate category counts
    const categoryCounts = {};
    exercises.forEach(ex => {
      categoryCounts[ex.category] = (categoryCounts[ex.category] || 0) + 1;
    });
    
    // Get recent exercises
    const recentExercises = [...exercises]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    setStats({
      totalExercises: exercises.length,
      levelCounts,
      categoryCounts,
      recentExercises
    });
  };

  const getLevelColor = (level) => {
    return level === 'A1-A2' ? 'bg-green-500' : 'bg-blue-500';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Dashboard Thống kê</h2>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          🔄 Làm mới
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng bài tập</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalExercises}</p>
            </div>
            <div className="text-3xl text-blue-600">📚</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cấp độ A1-A2</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.levelCounts['A1-A2'] || 0}
              </p>
            </div>
            <div className="text-3xl text-green-500">👶</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cấp độ B1</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.levelCounts['B1'] || 0}
              </p>
            </div>
            <div className="text-3xl text-blue-500">💼</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chủ đề</p>
              <p className="text-3xl font-bold text-purple-600">
                {Object.keys(stats.categoryCounts).length}
              </p>
            </div>
            <div className="text-3xl text-purple-500">🏷️</div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Level Distribution */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Phân bổ cấp độ</h3>
          <div className="space-y-3">
            {Object.entries(stats.levelCounts).map(([level, count]) => (
              <div key={level} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">
                  {level === 'A1-A2' ? 'A1-A2 (Cơ bản)' : 'B1 (Trung cấp)'}
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getLevelColor(level)} rounded-full transition-all duration-500`}
                      style={{ 
                        width: `${(count / stats.totalExercises) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right font-bold">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🕐 Bài tập gần đây</h3>
          <div className="space-y-4">
            {stats.recentExercises.map((ex, index) => (
              <div key={ex.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ex.level === 'A1-A2' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ex.level === 'A1-A2' ? 'A' : 'B'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-xs">
                      {ex.vietnamese}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ex.category} • {new Date(ex.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  #{ex.id}
                </span>
              </div>
            ))}
            
            {stats.recentExercises.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                📭 Chưa có bài tập nào
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Phân bổ chủ đề</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats.categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => (
              <div key={category} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800">{category}</span>
                  <span className="text-sm font-bold text-blue-600">{count}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${(count / stats.totalExercises) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          
          {Object.keys(stats.categoryCounts).length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              📭 Chưa có chủ đề nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}