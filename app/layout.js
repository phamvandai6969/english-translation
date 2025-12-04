import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'English Translation Practice - Luyện dịch tiếng Anh',
  description: 'Website luyện dịch tiếng Anh từ cơ bản đến nâng cao',
  keywords: 'english, translation, practice, tiếng anh, dịch thuật',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}>
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold mb-2">English Translation Practice</p>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} - Công cụ luyện dịch tiếng Anh miễn phí
            </p>
            <p className="text-gray-500 text-xs mt-2">
              
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}