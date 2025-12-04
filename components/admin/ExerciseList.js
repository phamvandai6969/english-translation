"use client";
import { useState, useEffect } from 'react';
import { getExercises, deleteExercise } from '@/utils/database';

export default function ExerciseList({ onEdit, onCreateNew }) {
  const [exercises, setExercises] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = () => {
    const allExercises = getExercises();
    setExercises(allExercises);
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesLevel = filterLevel === 'all' || ex.level === filterLevel;
    const matchesSearch = ex.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ex.correctTranslation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteExercise(id);
      loadExercises();
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const getLevelColor = (level) => {
    return level === 'A1-A2' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài tập</h2>
          <p className="text-gray-600">Tổng số: {exercises.length} bài tập</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <span>➕</span> Thêm bài mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="A1-A2">A1-A2</option>
            <option value="B1">B1</option>
          </select>
          
          <button
            onClick={loadExercises}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Exercises Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiếng Việt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiếng Anh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cấp độ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExercises.map((exercise) => (
              <tr key={exercise.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{exercise.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                  {exercise.vietnamese}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exercise.correctTranslation}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(exercise.level)}`}>
                    {exercise.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exercise.category}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => onEdit(exercise)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    ✏️ Sửa
                  </button>
                  
                  {confirmDelete === exercise.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(exercise.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        ✅ Xóa
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        ❌ Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(exercise.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      🗑️ Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            📭 Không tìm thấy bài tập nào
          </div>
        )}
      </div>
    </div>
  );
}