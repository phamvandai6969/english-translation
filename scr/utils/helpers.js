/**
 * Helper functions
 */

// Format date
export function formatDate(dateString, includeTime = false) {
  if (!dateString) return 'Chưa có';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
  
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('vi-VN', options);
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}

// Generate random ID
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`;
}

// Calculate average score
export function calculateAverageScore(scores) {
  if (!scores || scores.length === 0) return 0;
  
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

// Get level badge color
export function getLevelColor(level) {
  switch(level) {
    case 'A1-A2':
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Cơ bản' };
    case 'B1':
      return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Trung cấp' };
    case 'B2-C1':
      return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Nâng cao' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Khác' };
  }
}

// Get category icon
export function getCategoryIcon(category) {
  const iconMap = {
    'Chào hỏi': '👋',
    'Gia đình': '👨‍👩‍👧‍👦',
    'Sở thích': '🎨',
    'Công việc': '💼',
    'Du lịch': '✈️',
    'Ẩm thực': '🍜',
    'Giáo dục': '🎓',
    'Mua sắm': '🛍️',
    'Sức khỏe': '🏥',
    'Thời tiết': '☀️'
  };
  
  return iconMap[category] || '📝';
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Copy to clipboard
export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

// Save to localStorage with expiration
export function saveToLocalStorage(key, data, ttl = null) {
  const item = {
    data: data,
    timestamp: Date.now(),
    ttl: ttl
  };
  
  localStorage.setItem(key, JSON.stringify(item));
}

// Load from localStorage with expiration check
export function loadFromLocalStorage(key) {
  const itemStr = localStorage.getItem(key);
  
  if (!itemStr) return null;
  
  const item = JSON.parse(itemStr);
  const now = Date.now();
  
  // Check if item is expired
  if (item.ttl && now - item.timestamp > item.ttl * 1000) {
    localStorage.removeItem(key);
    return null;
  }
  
  return item.data;
}

// Generate random exercise
export function generateRandomExercise(exercises) {
  if (!exercises || exercises.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * exercises.length);
  return exercises[randomIndex];
}

// Calculate progress percentage
export function calculateProgress(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Format score with emoji
export function formatScore(score) {
  if (score >= 9) return '🎉 ' + score + '/10';
  if (score >= 7) return '👍 ' + score + '/10';
  if (score >= 5) return '😐 ' + score + '/10';
  return '😟 ' + score + '/10';
}