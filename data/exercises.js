export const exercises = [
  {
    id: 1,
    level: "A1-A2",
    category: "Chào hỏi",
    vietnamese: "Xin chào, tôi tên là Nam.",
    correctTranslation: "Hello, my name is Nam.",
    alternatives: ["Hi, my name is Nam."],
    hints: ["Xin chào = Hello/Hi", "tôi tên là = my name is"],
    order: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    level: "A1-A2",
    category: "Gia đình",
    vietnamese: "Gia đình tôi có bốn người.",
    correctTranslation: "My family has four people.",
    alternatives: ["There are four people in my family."],
    hints: ["có = has/there are"],
    order: 2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    level: "B1",
    category: "Công việc",
    vietnamese: "Tôi đã làm việc ở đây được ba năm.",
    correctTranslation: "I have worked here for three years.",
    alternatives: ["I've been working here for three years."],
    hints: ["đã... được = present perfect tense"],
    order: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
];

export const categories = [
  "Chào hỏi", "Gia đình", "Sở thích", "Công việc", 
  "Du lịch", "Ẩm thực", "Giáo dục", "Mua sắm"
];

export const levels = [
  { id: "A1-A2", name: "Cơ bản", description: "Cho người mới bắt đầu" },
  { id: "B1", name: "Trung cấp", description: "Cho người có nền tảng" }
];