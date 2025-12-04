"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ExerciseList from '@/components/admin/ExerciseList';
import ExerciseForm from '@/components/admin/ExerciseForm';
import StatsDashboard from '@/components/admin/StatsDashboard';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('exercises');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
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