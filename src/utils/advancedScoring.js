// Sử dụng API miễn phí để chấm điểm tốt hơn
export async function evaluateWithLanguageTool(text) {
  try {
    const response = await fetch('https://languagetool.org/api/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(text)}&language=en-US`
    });
    
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('LanguageTool error:', error);
    return [];
  }
}

// Sử dụng Google Translate API free (có giới hạn)
export async function translateWithGoogle(vietnamese) {
  // Đây là demo - thực tế cần đăng ký API key free tier
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(vietnamese)}`
  );
  const data = await response.json();
  return data[0][0][0];
}