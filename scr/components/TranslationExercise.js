"use client";
import { useState, useEffect } from 'react';
import ScoreDisplay from './ScoreDisplay';
import ProgressTracker from './ProgressTracker';

export default function TranslationExercise({ exercise, onNext, onSaveProgress }) {
  const [userTranslation, setUserTranslation] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async () => {
    if (!userTranslation.trim()) return;
    
    setIsChecking(true);
    setAttempts(prev => prev + 1);
    
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTranslation,
          correctTranslation: exercise.correctTranslation,
          alternatives: exercise.alternatives || [],
          level: exercise.level
        })
      });
      
      const result = await response.json();
      setScore(result.score);
      setFeedback(result.feedback);
      
      // Lưu tiến trình
      if (result.score >= 7) {
        onSaveProgress(exercise.id, {
          score: result.score,
          attempts,
          completed: true,
          lastTry: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Lỗi khi chấm điểm:', error);
      setFeedback({ 
        grammarErrors: ['Không thể kết nối đến server. Vui lòng thử lại.'],
        suggestions: ['Hãy kiểm tra kết nối internet của bạn.']
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleTryAgain = () => {
    setScore(null);
    setFeedback(null);
    setShowHint(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {exercise.level} • {exercise.category}
        </span>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Câu tiếng Việt:</h3>
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-xl text-gray-800">{exercise.vietnamese}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
            Bản dịch của bạn:
        </label>
        <textarea
          value={userTranslation}
          onChange={(e) => setUserTranslation(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập bản dịch tiếng Anh của bạn ở đây..."
          disabled={isChecking}
        />
      </div>
      
      {exercise.hints && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="mb-4 text-sm text-blue-600 hover:text-blue-800"
        >
          {showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
        </button>
      )}
      
      {showHint && exercise.hints && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="font-medium text-yellow-800">💡 Gợi ý:</p>
          <ul className="mt-1 text-yellow-700">
            {exercise.hints.map((hint, index) => (
              <li key={index}>• {hint}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSubmit}
          disabled={isChecking || !userTranslation.trim()}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isChecking ? 'Đang chấm điểm...' : 'Kiểm tra dịch'}
        </button>
        
        <button
          onClick={() => setUserTranslation(exercise.correctTranslation)}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Xem đáp án
        </button>
      </div>
      
      {score !== null && feedback && (
        <ScoreDisplay 
          score={score}
          feedback={feedback}
          correctTranslation={exercise.correctTranslation}
          userTranslation={userTranslation}
          onTryAgain={handleTryAgain}
          onNext={onNext}
        />
      )}
      
      <ProgressTracker />
    </div>
  );
}