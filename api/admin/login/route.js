// app/api/admin/login/route.js

import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs'; // 💡 Phải sử dụng thư viện này trong thực tế!

// ⚠️ Trong môi trường THỰC TẾ, bạn phải lưu mật khẩu ĐÃ HASH trong DB hoặc biến môi trường.
// ⚠️ Dưới đây CHỈ LÀ VÍ DỤ minh họa logic Server-Side.
const HARDCODED_PASSWORD = "adminwebsite"; 

// Hàm mô phỏng việc kiểm tra mật khẩu an toàn (nên dùng bcrypt.compare)
async function verifyAdminPassword(inputPassword) {
    // 💡 Trong thực tế:
    // 1. Lấy mật khẩu HASHED từ database: const hashedPassword = await getAdminPasswordHashFromDB();
    // 2. So sánh: const isValid = await bcrypt.compare(inputPassword, hashedPassword);
    // 3. Trả về isValid

    // Ví dụ đơn giản:
    return inputPassword === HARDCODED_PASSWORD;
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ message: 'Vui lòng cung cấp mật khẩu' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (isValid) {
      // 🔑 Thành công
      // 💡 Lý tưởng: Tại đây bạn tạo và gửi một JWT token hoặc set HTTP-only cookie an toàn.
      
      const response = NextResponse.json({ message: 'Đăng nhập thành công' }, { status: 200 });
      // Ví dụ set cookie (để sau này kiểm tra admin dashboard)
      // response.cookies.set('auth_token', 'your_secure_jwt_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      
      return response;

    } else {
      // 🚫 Thất bại
      return NextResponse.json({ message: 'Mật khẩu không đúng' }, { status: 401 });
    }
  } catch (error) {
    console.error("API Login Error:", error);
    return NextResponse.json({ message: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}