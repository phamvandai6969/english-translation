"use client";
import { useState, useEffect } from 'react';
import { getDatabase, updateSettings, verifyAdminPassword } from '@/utils/database';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    adminPassword: '',
    maxExercises: 100,
    enableAutoBackup: true,
    backupInterval: 7, // days
    allowUserSuggestions: false
  });
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    setSettings(db.settings);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setLoading(true);
    try {
      updateSettings(settings);
      setMessage({ type: 'success', text: '✅ Cài đặt đã được lưu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Lỗi khi lưu cài đặt' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '❌ Mật khẩu xác nhận không khớp' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '❌ Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
    
    if (!verifyAdminPassword(currentPassword)) {
      setMessage({ type: 'error', text: '❌ Mật khẩu hiện tại không đúng' });
      return;
    }
    
    updateSettings({ adminPassword: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage({ type: 'success', text: '✅ Đổi mật khẩu thành công!' });
  };

  const handleExportData = () => {
    const db = getDatabase();
    const dataStr = JSON.stringify(db, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (confirm('Bạn có chắc muốn import dữ liệu mới? Dữ liệu cũ sẽ bị ghi đè.')) {
          localStorage.setItem('translation_app_db', JSON.stringify(data));
          setMessage({ type: 'success', text: '✅ Import dữ liệu thành công! Vui lòng tải lại trang.' });
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (error) {
        setMessage({ type: 'error', text: '❌ File không hợp lệ' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDatabase = () => {
    if (confirm('⚠️ Bạn có CHẮC CHẮN muốn reset toàn bộ dữ liệu? Hành động này không thể hoàn tác!')) {
      localStorage.removeItem('translation_app_db');
      localStorage.removeItem('translationProgress');
      localStorage.removeItem('adminAuthenticated');
      setMessage({ type: 'success', text: '✅ Đã reset database. Vui lòng đăng nhập lại.' });
      setTimeout(() => window.location.href = '/admin/login', 2000);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cài đặt hệ thống</h2>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Bảo mật</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Đổi mật khẩu Admin</h4>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Cấu hình hệ thống</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Số bài tập tối đa</p>
                <p className="text-sm text-gray-500">Giới hạn số bài tập trong hệ thống</p>
              </div>
              <input
                type="number"
                value={settings.maxExercises}
                onChange={(e) => handleSettingChange('maxExercises', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded-lg"
                min="10"
                max="1000"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Tự động backup</p>
                <p className="text-sm text-gray-500">Tự động lưu trữ dữ liệu định kỳ</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoBackup}
                  onChange={(e) => handleSettingChange('enableAutoBackup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.enableAutoBackup && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Chu kỳ backup (ngày)</p>
                  <p className="text-sm text-gray-500">Số ngày giữa các lần backup</p>
                </div>
                <input
                  type="number"
                  value={settings.backupInterval}
                  onChange={(e) => handleSettingChange('backupInterval', parseInt(e.target.value))}
                  className="w-24 px-3 py-2 border rounded-lg"
                  min="1"
                  max="30"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Cho phép đề xuất bài tập</p>
                <p className="text-sm text-gray-500">Người dùng có thể đề xuất bài tập mới</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowUserSuggestions}
                  onChange={(e) => handleSettingChange('allowUserSuggestions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div className="pt-4 border-t">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Đang lưu...' : '💾 Lưu cài đặt'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💾 Quản lý dữ liệu</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-center"
            >
              <div className="text-3xl mb-2">📥</div>
              <p className="font-medium text-blue-700">Export Data</p>
              <p className="text-sm text-gray-600">Tải xuống toàn bộ dữ liệu</p>
            </button>
            
            <label className="p-4 border border-green-300 rounded-lg hover:bg-green-50 text-center cursor-pointer">
              <div className="text-3xl mb-2">📤</div>
              <p className="font-medium text-green-700">Import Data</p>
              <p className="text-sm text-gray-600">Tải lên dữ liệu mới</p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleResetDatabase}
              className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-center"
            >
              <div className="text-3xl mb-2">🔄</div>
              <p className="font-medium text-red-700">Reset Database</p>
              <p className="text-sm text-gray-600">Xóa toàn bộ dữ liệu</p>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Lưu ý:</strong> Dữ liệu được lưu trong localStorage của trình duyệt. 
              Khi xóa cache trình duyệt, dữ liệu sẽ bị mất. Hãy backup định kỳ!
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ Thông tin hệ thống</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Phiên bản</span>
              <span className="font-medium">1.0.0</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày cập nhật</span>
              <span className="font-medium">{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Dung lượng đã dùng</span>
              <span className="font-medium">
                {Math.round(JSON.stringify(getDatabase()).length / 1024)} KB
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Số người dùng (ước tính)</span>
              <span className="font-medium">
                {Object.keys(JSON.parse(localStorage.getItem('translationProgress') || '{}')).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}