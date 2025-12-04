"use client";
import { useEffect, useState } from 'react';

export default function ProgressTracker() {
  const [progress, setProgress] = useState({});
  
  useEffect(() => {
    // Load progress từ localStorage
    const saved = localStorage.getItem('translationProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);
  
  const completedExercises = Object.values(progress).filter(p => p.completed).length;
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + (p.attempts || 0), 0);
  const avgScore = Object.values(progress).length > 0 
    ? (Object.values(progress).reduce((sum, p) => sum + (p.score || 0), 0) / Object.values(progress).length).toFixed(1)
    : 0;
  
  return (
    <div className="mt-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Tiến trình học của bạn</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{completedExercises}</div>
          <div className="text-sm text-gray-600">Bài đã hoàn thành</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{avgScore}</div>
          <div className="text-sm text-gray-600">Điểm trung bình</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{totalAttempts}</div>
          <div className="text-sm text-gray-600">Lần thử</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Tiến trình được lưu tự động trong trình duyệt của bạn.</p>
        <p className="mt-1">Xóa cache trình duyệt sẽ làm mất tiến trình.</p>
      </div>
    </div>
  );
}