/**
 * Hàm validation cho form
 */

// Validate email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password
export function validatePassword(password) {
  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  return '';
}

// Validate exercise form
export function validateExerciseForm(data) {
  const errors = {};
  
  if (!data.vietnamese || data.vietnamese.trim().length === 0) {
    errors.vietnamese = 'Câu tiếng Việt không được để trống';
  } else if (data.vietnamese.length > 500) {
    errors.vietnamese = 'Câu tiếng Việt quá dài (tối đa 500 ký tự)';
  }
  
  if (!data.correctTranslation || data.correctTranslation.trim().length === 0) {
    errors.correctTranslation = 'Câu dịch đúng không được để trống';
  } else if (data.correctTranslation.length > 500) {
    errors.correctTranslation = 'Câu dịch quá dài (tối đa 500 ký tự)';
  }
  
  if (!data.level) {
    errors.level = 'Vui lòng chọn cấp độ';
  }
  
  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Vui lòng chọn hoặc nhập chủ đề';
  }
  
  // Validate alternatives
  if (data.alternatives) {
    const altArray = data.alternatives.split('\n').filter(line => line.trim().length > 0);
    for (let i = 0; i < altArray.length; i++) {
      if (altArray[i].length > 500) {
        errors.alternatives = `Câu dịch thay thế ${i + 1} quá dài (tối đa 500 ký tự)`;
        break;
      }
    }
  }
  
  return errors;
}

// Validate login form
export function validateLoginForm(data) {
  const errors = {};
  
  if (!data.password || data.password.trim().length === 0) {
    errors.password = 'Mật khẩu không được để trống';
  }
  
  return errors;
}

// Sanitize input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .slice(0, 1000); // Giới hạn độ dài
}

// Validate progress data
export function validateProgressData(data) {
  const requiredFields = ['exerciseId', 'score', 'timestamp'];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      return `Thiếu trường bắt buộc: ${field}`;
    }
  }
  
  if (typeof data.score !== 'number' || data.score < 0 || data.score > 10) {
    return 'Đi số không hợp lệ (0-10)';
  }
  
  if (typeof data.exerciseId !== 'number') {
    return 'ID bài tập không hợp lệ';
  }
  
  return '';
}