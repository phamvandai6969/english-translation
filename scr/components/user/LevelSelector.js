"use client";
import { useRouter } from 'next/navigation';

export default function LevelSelector() {
  const router = useRouter();
  
  const levels = [
    {
      id: 'A1-A2',
      title: 'A1-A2: Cơ bản',
      description: 'Dành cho người mới bắt đầu',
      icon: '👶',
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      exercises: 15,
      topics: ['Chào hỏi', 'Gia đình', 'Sở thích cơ bản']
    },
    {
      id: 'B1',
      title: 'B1: Trung cấp',
      description: 'Dành cho người có nền tảng',
      icon: '🚀',
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      exercises: 20,
      topics: ['Công việc', 'Du lịch', 'Mô tả sự việc']
    }
  ];
  
  const handleSelectLevel = (levelId) => {
    // Lưu level đã chọn
    localStorage.setItem('selectedLevel', levelId);
    // Chuyển đến bài tập đầu tiên của level đó
    router.push(`/?level=${levelId}`);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Chọn cấp độ phù hợp với bạn
        </h1>
        <p className="text-xl text-gray-600">
          Học tiếng Anh theo trình độ từ cơ bản đến nâng cao
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {levels.map((level) => (
          <div
            key={level.id}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Header với gradient */}
            <div className={`${level.color} text-white p-8`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">{level.icon}</div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{level.exercises}</span>
                  <p className="text-sm opacity-90">bài tập</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{level.title}</h3>
              <p className="opacity-90">{level.description}</p>
            </div>
            
            {/* Nội dung */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">📚 Chủ đề bao gồm:</h4>
                <div className="flex flex-wrap gap-2">
                  {level.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="w-6">✅</span>
                  <span>Bài tập từ dễ đến khó</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-6">✅</span>
                  <span>Chấm điểm chi tiết</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-6">✅</span>
                  <span>Gợi ý cải thiện</span>
                </div>
              </div>
              
              <button
                onClick={() => handleSelectLevel(level.id)}
                className={`w-full mt-6 py-3 text-white font-bold rounded-lg transition-all duration-200 ${
                  level.id === 'A1-A2' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Bắt đầu học Level {level.id}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Hoàn toàn miễn phí • Không cần đăng ký
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Thông tin thêm */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-start">
          <div className="text-4xl mr-4">💡</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Lời khuyên chọn level
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>A1-A2:</strong> Nếu bạn mới học hoặc cần ôn lại căn bản</li>
              <li>• <strong>B1:</strong> Nếu bạn đã có nền tảng và muốn nâng cao kỹ năng</li>
              <li>• Bạn có thể thay đổi level bất kỳ lúc nào</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}