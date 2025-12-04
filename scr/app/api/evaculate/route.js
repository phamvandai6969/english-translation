import { NextResponse } from 'next/server';

// Hàm kiểm tra ngữ pháp đơn giản
function checkGrammarSimple(text) {
  const errors = [];
  const lowerText = text.toLowerCase();
  
  // Rule 1: Viết hoa đầu câu
  if (text.length > 0 && text[0] !== text[0].toUpperCase()) {
    errors.push("Câu nên bắt đầu bằng chữ viết hoa");
  }
  
  // Rule 2: Kết thúc bằng dấu câu
  if (!/[.!?]$/.test(text.trim())) {
    errors.push("Thiếu dấu kết thúc câu (. ! ?)");
  }
  
  // Rule 3: Kiểm tra lặp từ
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  Object.entries(wordCount).forEach(([word, count]) => {
    if (count > 3 && word.length > 2) {
      errors.push(`Từ "${word}" được lặp lại quá nhiều lần (${count} lần)`);
    }
  });
  
  return errors;
}

// Hàm tính điểm dựa trên độ tương đồng
function calculateSimilarityScore(user, correct, alternatives) {
  const allCorrect = [correct, ...alternatives];
  
  // Đơn giản: kiểm tra xem có trùng khớp không
  const exactMatch = allCorrect.some(c => 
    c.toLowerCase().trim() === user.toLowerCase().trim()
  );
  
  if (exactMatch) return 10;
  
  // Tính điểm dựa trên số từ khớp
  const userWords = new Set(user.toLowerCase().split(/\s+/));
  let bestScore = 0;
  
  allCorrect.forEach(correctVersion => {
    const correctWords = new Set(correctVersion.toLowerCase().split(/\s+/));
    const intersection = [...userWords].filter(x => correctWords.has(x));
    const score = (intersection.length / correctWords.size) * 10;
    if (score > bestScore) bestScore = score;
  });
  
  return Math.min(10, Math.round(bestScore * 10) / 10);
}

// Hàm tạo feedback
function generateFeedback(score, grammarErrors, user, correct) {
  const suggestions = [];
  
  if (grammarErrors.length === 0 && score < 10) {
    suggestions.push("Bản dịch khá tốt! Có thể tự nhiên hơn bằng cách dùng từ đồng nghĩa");
  }
  
  if (score >= 9) {
    suggestions.push("Xuất sắc! Bản dịch rất chính xác và tự nhiên");
  }
  
  // Thêm gợi ý cụ thể từ lỗi ngữ pháp
  if (grammarErrors.length > 0) {
    grammarErrors.forEach(error => {
      if (error.includes("viết hoa")) {
        suggestions.push("Nhớ viết hoa chữ cái đầu câu");
      }
      if (error.includes("dấu kết thúc")) {
        suggestions.push("Đừng quên dấu chấm ở cuối câu");
      }
    });
  }
  
  return {
    grammarErrors,
    suggestions,
    correctTranslation: correct
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userTranslation, correctTranslation, alternatives = [], level } = body;
    
    // 1. Kiểm tra ngữ pháp cơ bản
    const grammarErrors = checkGrammarSimple(userTranslation);
    
    // 2. Tính điểm tương đồng
    const similarityScore = calculateSimilarityScore(
      userTranslation, 
      correctTranslation, 
      alternatives
    );
    
    // 3. Điều chỉnh điểm dựa trên lỗi ngữ pháp
    let finalScore = similarityScore;
    if (grammarErrors.length > 0) {
      finalScore = Math.max(0, finalScore - (grammarErrors.length * 0.5));
    }
    
    // 4. Tạo feedback
    const feedback = generateFeedback(
      finalScore,
      grammarErrors,
      userTranslation,
      correctTranslation
    );
    
    return NextResponse.json({
      score: Math.min(10, Math.round(finalScore * 10) / 10),
      feedback,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error evaluating translation:', error);
    return NextResponse.json(
      { error: 'Lỗi khi chấm điểm', score: 0 },
      { status: 500 }
    );
  }
}