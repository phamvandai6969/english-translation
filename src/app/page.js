"use client";
import { useState, useEffect } from 'react';
import TranslationExercise from '@/components/TranslationExercise';
import { exercises } from '@/data/exercises';

export default function Home() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [started, setStarted] = useState(false);

  // Load progress từ localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('translationProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    
    // Kiểm tra xem user đã học bài nào chưa
    const lastExerciseId = localStorage.getItem('lastExerciseId');
    if (lastExerciseId) {
      const index = exercises.findIndex(e => e.id === parseInt(lastExerciseId));
      if (index !== -1) {
        setCurrentExerciseIndex(index);
        setStarted(true);
      }
    }
  }, []);

  // Lưu progress vào localStorage
  const saveProgress = (exerciseId, data) => {
    const newProgress = {
      ...progress,
      [exerciseId]: {
        ...progress[exerciseId],
        ...data,
        lastUpdated: new Date().toISOString()
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem('translationProgress', JSON.stringify(newProgress));
    localStorage.setItem('lastExerciseId', exerciseId);
  };

  const nextExercise = () => {
    const nextIndex = (currentExerciseIndex + 1) % exercises.length;
    setCurrentExerciseIndex(nextIndex);
    setStarted(true);
  };

  const selectExercise = (index) => {
    setCurrentExerciseIndex(index);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            🎯 Luyện Dịch Tiếng Anh
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Cải thiện kỹ năng dịch Anh-Việt với bài tập thực tế và chấm điểm tự động
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-bold text-lg mb-2">Chấm điểm chi tiết</h3>
              <p className="text-gray-600">Phân tích lỗi và gợi ý cải thiện</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="font-bold text-lg mb-2">Theo dõi tiến trình</h3>
              <p className="text-gray-600">Xem thống kê và mức độ tiến bộ</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="font-bold text-lg mb-2">Gợi ý thông minh</h3>
              <p className="text-gray-600">Học từ lỗi sai và cải thiện nhanh</p>
            </div>
          </div>
          
          <button 
            onClick={() => setStarted(true)}
            className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 shadow-lg"
          >
            Bắt đầu học ngay →
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">🌐 Luyện Dịch Tiếng Anh</h1>
          <div className="text-sm text-gray-600">
            Bài {currentExerciseIndex + 1}/{exercises.length}
          </div>
        </div>
        
        <nav className="mt-4">
          <div className="flex flex-wrap gap-2">
            {exercises.map((ex, index) => (
              <button
                key={ex.id}
                onClick={() => selectExercise(index)}
                className={`px-3 py-1 rounded-full text-sm ${
                  index === currentExerciseIndex
                    ? 'bg-blue-600 text-white'
                    : progress[ex.id]?.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bài {index + 1}
                {progress[ex.id]?.completed && ' ✓'}
              </button>
            ))}
          </div>
        </nav>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <TranslationExercise
          exercise={currentExercise}
          onNext={nextExercise}
          onSaveProgress={saveProgress}
        />
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 Tiến trình được tự động lưu trong trình duyệt của bạn</p>
          <p className="mt-1"> F5 để tải lại trang hoặc chọn bài khác từ menu trên</p>
        </div>
      </main>
    </div>
  );
}