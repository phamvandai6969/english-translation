"use client";
import { useState, useEffect } from 'react';
import { addExercise, updateExercise, getCategories, addCategory } from '@/utils/database';

export default function ExerciseForm({ exercise, onSuccess }) {
  const [formData, setFormData] = useState({
    level: 'A1-A2',
    category: '',
    vietnamese: '',
    correctTranslation: '',
    alternatives: '',
    hints: '',
    order: 0
  });
  
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load categories
    setCategories(getCategories());
    
    // If editing, load exercise data
    if (exercise) {
      setFormData({
        level: exercise.level,
        category: exercise.category,
        vietnamese: exercise.vietnamese,
        correctTranslation: exercise.correctTranslation,
        alternatives: exercise.alternatives ? exercise.alternatives.join('\n') : '',
        hints: exercise.hints ? exercise.hints.join('\n') : '',
        order: exercise.order || 0
      });
    } else {
      // Set default order
      const exercises = JSON.parse(localStorage.getItem('translation_app_db'))?.exercises || [];
      const maxOrder = Math.max(...exercises.map(e => e.order || 0), 0);
      setFormData(prev => ({ ...prev, order: maxOrder + 1 }));
    }
  }, [exercise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = addCategory(newCategory.trim());
      setCategories(updatedCategories);
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare data
      const exerciseData = {
        ...formData,
        alternatives: formData.alternatives
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0),
        hints: formData.hints
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0),
        order: parseInt(formData.order) || 0
      };

      // Save to database
      let result;
      if (exercise) {
        result = updateExercise(exercise.id, exerciseData);
        setMessage({ type: 'success', text: '✅ Cập nhật bài tập thành công!' });
      } else {
        result = addExercise(exerciseData);
        setMessage({ type: 'success', text: '✅ Thêm bài tập mới thành công!' });
      }

      // Reset form if adding new
      if (!exercise) {
        setFormData({
          level: 'A1-A2',
          category: '',
          vietnamese: '',
          correctTranslation: '',
          alternatives: '',
          hints: '',
          order: formData.order + 1
        });
      }

      // Show success message
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (error) {
      setMessage({ type: 'error', text: '❌ Có lỗi xảy ra: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {exercise ? '✏️ Sửa Bài Tập' : '➕ Thêm Bài Tập Mới'}
        </h2>
        <p className="text-gray-600">
          {exercise 
            ? `Chỉnh sửa bài tập #${exercise.id}` 
            : 'Thêm bài tập dịch mới vào hệ thống'}
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Level & Category */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ *
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="A1-A2">A1-A2 (Cơ bản)</option>
              <option value="B1">B1 (Trung cấp)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề *
            </label>
            <div className="flex gap-2">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Chọn chủ đề...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Thêm mới"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vietnamese Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Câu tiếng Việt *
          </label>
          <textarea
            name="vietnamese"
            value={formData.vietnamese}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Nhập câu tiếng Việt cần dịch..."
            required
          />
        </div>

        {/* Correct Translation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Câu dịch đúng (tiếng Anh) *
          </label>
          <textarea
            name="correctTranslation"
            value={formData.correctTranslation}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Nhập bản dịch chính xác..."
            required
          />
        </div>

        {/* Alternative Translations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Câu dịch thay thế (mỗi dòng một câu)
          </label>
          <textarea
            name="alternatives"
            value={formData.alternatives}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Các cách dịch khác cũng đúng...\nMỗi cách dịch trên một dòng"
          />
          <p className="text-sm text-gray-500 mt-1">
            Người dùng dịch giống các câu này vẫn được tính là đúng
          </p>
        </div>

        {/* Hints */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gợi ý cho người học (mỗi dòng một gợi ý)
          </label>
          <textarea
            name="hints"
            value={formData.hints}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Các gợi ý giúp người học...\nMỗi gợi ý trên một dòng"
          />
        </div>

        {/* Order */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thứ tự hiển thị
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-1">Số nhỏ hiển thị trước</p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Đang lưu...' : exercise ? '💾 Cập nhật' : '➕ Thêm bài tập'}
          </button>
          
          <button
            type="button"
            onClick={onSuccess}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Quay lại
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">👁️ Xem trước</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {formData.level} • {formData.category || 'Chưa có chủ đề'}
            </span>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700">Câu tiếng Việt:</h4>
            <p className="text-gray-800 mt-1">{formData.vietnamese || 'Chưa có nội dung'}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Câu dịch đúng:</h4>
            <p className="text-gray-800 mt-1">{formData.correctTranslation || 'Chưa có nội dung'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}