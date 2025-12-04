/**
 * Hàm chấm điểm bản dịch
 */

// Hàm tính điểm tương đồng giữa 2 câu
export function calculateSimilarityScore(userText, correctText) {
  // Chuyển thành chữ thường và loại bỏ dấu câu
  const normalize = (text) => 
    text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
  
  const userWords = new Set(normalize(userText).split(' '));
  const correctWords = new Set(normalize(correctText).split(' '));
  
  // Tính Jaccard similarity
  const intersection = [...userWords].filter(word => correctWords.has(word));
  const union = new Set([...userWords, ...correctWords]);
  
  const similarity = intersection.length / union.size;
  
  // Chuyển thành thang điểm 0-10
  return Math.min(10, Math.round(similarity * 10 * 10) / 10);
}

// Hàm kiểm tra lỗi ngữ pháp cơ bản
export function checkBasicGrammar(text) {
  const errors = [];
  
  if (!text || text.trim().length === 0) {
    errors.push('Câu dịch không được để trống');
    return errors;
  }
  
  // 1. Kiểm tra viết hoa đầu câu
  const firstChar = text.trim()[0];
  if (firstChar !== firstChar.toUpperCase()) {
    errors.push('Câu nên bắt đầu bằng chữ viết hoa');
  }
  
  // 2. Kiểm tra dấu kết thúc câu
  const lastChar = text.trim().slice(-1);
  if (!['.', '!', '?'].includes(lastChar)) {
    errors.push('Thiếu dấu kết thúc câu (. ! ?)');
  }
  
  // 3. Kiểm tra khoảng trắng thừa
  if (text.includes('  ') || text.trim() !== text) {
    errors.push('Có khoảng trắng thừa trong câu');
  }
  
  // 4. Kiểm tra lặp từ
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  Object.entries(wordCount).forEach(([word, count]) => {
    if (count > 3 && word.length > 2) {
      errors.push(`Từ "${word}" lặp lại quá nhiều lần (${count} lần)`);
    }
  });
  
  // 5. Kiểm tra cấu trúc cơ bản
  const hasSubjectVerb = /(I|you|he|she|it|we|they)\s+\w+/.test(text) || 
                         /\w+\s+(am|is|are|was|were|have|has|do|does|did)/.test(text);
  if (!hasSubjectVerb) {
    errors.push('Câu có thể thiếu chủ ngữ hoặc động từ chính');
  }
  
  return errors;
}

// Hàm kiểm tra từ vựng phù hợp cấp độ
export function checkVocabularyLevel(text, level) {
  const basicWords = [
    'hello', 'hi', 'good', 'bad', 'big', 'small', 'happy', 'sad',
    'go', 'come', 'eat', 'drink', 'sleep', 'work', 'study', 'play',
    'family', 'friend', 'home', 'school', 'work', 'time', 'day', 'year'
  ];
  
  const intermediateWords = [
    'however', 'therefore', 'although', 'despite', 'furthermore',
    'consequently', 'nevertheless', 'moreover', 'otherwise'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  
  if (level === 'A1-A2') {
    // Cho phép từ cơ bản, cảnh báo từ nâng cao
    const advancedWords = words.filter(word => 
      intermediateWords.includes(word) && 
      !basicWords.includes(word)
    );
    
    if (advancedWords.length > 0) {
      return [`Có từ nâng cao không phù hợp trình độ: ${advancedWords.slice(0, 3).join(', ')}`];
    }
  }
  
  return [];
}

// Hàm chấm điểm chính
export function evaluateTranslation(userTranslation, correctTranslation, alternatives = [], level = 'A1-A2') {
  // 1. Kiểm tra ngữ pháp cơ bản
  const grammarErrors = checkBasicGrammar(userTranslation);
  
  // 2. Kiểm tra từ vựng
  const vocabularyWarnings = checkVocabularyLevel(userTranslation, level);
  
  // 3. Tính điểm tương đồng
  let maxSimilarity = 0;
  const allCorrectVersions = [correctTranslation, ...alternatives];
  
  allCorrectVersions.forEach(version => {
    const similarity = calculateSimilarityScore(userTranslation, version);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  });
  
  // 4. Điều chỉnh điểm dựa trên lỗi
  let finalScore = maxSimilarity;
  if (grammarErrors.length > 0) {
    finalScore = Math.max(0, finalScore - (grammarErrors.length * 0.5));
  }
  
  if (vocabularyWarnings.length > 0 && level === 'A1-A2') {
    finalScore = Math.max(0, finalScore - 0.5);
  }
  
  // 5. Tạo gợi ý cải thiện
  const suggestions = generateSuggestions(finalScore, grammarErrors, vocabularyWarnings);
  
  return {
    score: Math.min(10, Math.round(finalScore * 10) / 10),
    grammarErrors,
    vocabularyWarnings,
    suggestions,
    maxSimilarity
  };
}

// Hàm tạo gợi ý
function generateSuggestions(score, grammarErrors, vocabularyWarnings) {
  const suggestions = [];
  
  if (score < 6) {
    suggestions.push('Hãy đọc kỹ câu gốc và dịch từng phần một');
    suggestions.push('Kiểm tra lại cấu trúc câu cơ bản: Chủ ngữ + Động từ');
  } else if (score < 8) {
    suggestions.push('Bản dịch khá tốt! Có thể tự nhiên hơn');
    suggestions.push('Thử dùng từ đồng nghĩa để đa dạng hóa');
  } else {
    suggestions.push('Xuất sắc! Bản dịch rất chính xác');
    suggestions.push('Có thể thử dịch theo phong cách khác để luyện tập thêm');
  }
  
  if (grammarErrors.length > 0) {
    if (grammarErrors.some(e => e.includes('viết hoa'))) {
      suggestions.push('Nhớ viết hoa chữ cái đầu câu');
    }
    if (grammarErrors.some(e => e.includes('dấu kết thúc'))) {
      suggestions.push('Luôn kết thúc câu bằng dấu chấm, chấm than hoặc chấm hỏi');
    }
  }
  
  if (vocabularyWarnings.length > 0) {
    suggestions.push('Hãy dùng từ vựng phù hợp với trình độ của bạn');
  }
  
  return suggestions;
}

// Hàm so sánh với đáp án mẫu
export function compareWithModel(userTranslation, modelTranslation) {
  const userWords = userTranslation.toLowerCase().split(/\s+/);
  const modelWords = modelTranslation.toLowerCase().split(/\s+/);
  
  const missingWords = modelWords.filter(word => !userWords.includes(word));
  const extraWords = userWords.filter(word => !modelWords.includes(word));
  
  return {
    missingWords: missingWords.slice(0, 5), // Giới hạn 5 từ
    extraWords: extraWords.slice(0, 5),
    wordMatch: userWords.filter(word => modelWords.includes(word)).length / modelWords.length
  };
}