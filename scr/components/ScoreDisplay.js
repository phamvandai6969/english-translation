"use client";
import { useState } from 'react';

export default function ScoreDisplay({ score, feedback, correctTranslation, userTranslation, onTryAgain, onNext }) {
  const [showCorrections, setShowCorrections] = useState(false);
  
  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Kết quả</h3>
        <div className={`px-4 py-2 rounded-full font-bold ${getScoreColor(score)}`}>
          Điểm: {score}/10
        </div>
      </div>
      
      {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-red-700 mb-2">📝 Lỗi ngữ pháp:</h4>
          <ul className="space-y-1">
            {feedback.grammarErrors.map((error, index) => (
              <li key={index} className="text-red-600">• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-blue-700 mb-2">💡 Gợi ý cải thiện:</h4>
          <ul className="space-y-1">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-blue-600">• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-4">
        <button
          onClick={() => setShowCorrections(!showCorrections)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {showCorrections ? 'Ẩn sửa lỗi' : 'Hiện đề xuất chỉnh sửa'}
        </button>
        
        {showCorrections && (
          <div className="mt-2 p-3 bg-white rounded border">
            <p className="font-medium text-gray-700 mb-1">Bản dịch của bạn:</p>
            <p className="text-gray-600 mb-3">{userTranslation}</p>
            
            <p className="font-medium text-gray-700 mb-1">Đề xuất chỉnh sửa:</p>
            <p className="text-green-600 font-medium">{correctTranslation}</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onTryAgain}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Thử lại
        </button>
        
        <button
          onClick={onNext}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Bài tiếp theo →
        </button>
      </div>
    </div>
  );
}