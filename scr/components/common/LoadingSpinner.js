"use client";

import { useState, useEffect } from 'react';

/**
 * LoadingSpinner Component
 * Hiển thị spinner loading với nhiều kiểu và kích thước
 * 
 * @param {Object} props
 * @param {string} [props.size='medium'] - Kích thước: 'small', 'medium', 'large', 'xl'
 * @param {string} [props.color='primary'] - Màu: 'primary', 'success', 'warning', 'danger', 'white'
 * @param {string} [props.type='spinner'] - Kiểu: 'spinner', 'dots', 'pulse', 'progress'
 * @param {string} [props.text=''] - Text hiển thị bên dưới
 * @param {boolean} [props.fullScreen=false] - Hiển thị toàn màn hình
 * @param {boolean} [props.overlay=false] - Hiển thị overlay
 * @param {number} [props.progress] - Giá trị progress (0-100) cho type='progress'
 * @param {string} [props.customText=''] - Custom text cho progress
 */
export default function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  type = 'spinner',
  text = '',
  fullScreen = false,
  overlay = false,
  progress,
  customText = ''
}) {
  const [progressWidth, setProgressWidth] = useState(0);

  // Hiệu ứng smooth cho progress bar
  useEffect(() => {
    if (type === 'progress' && progress !== undefined) {
      const timer = setTimeout(() => {
        setProgressWidth(Math.min(progress, 100));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [progress, type]);

  // Kích thước
  const sizeClasses = {
    small: {
      spinner: 'w-4 h-4 border-2',
      dots: 'w-1 h-1 mx-1',
      pulse: 'w-3 h-3',
      container: 'p-2'
    },
    medium: {
      spinner: 'w-8 h-8 border-3',
      dots: 'w-2 h-2 mx-1',
      pulse: 'w-6 h-6',
      container: 'p-4'
    },
    large: {
      spinner: 'w-12 h-12 border-4',
      dots: 'w-3 h-3 mx-1.5',
      pulse: 'w-10 h-10',
      container: 'p-6'
    },
    xl: {
      spinner: 'w-16 h-16 border-4',
      dots: 'w-4 h-4 mx-2',
      pulse: 'w-14 h-14',
      container: 'p-8'
    }
  };

  // Màu sắc
  const colorClasses = {
    primary: {
      spinner: 'border-blue-600 border-t-transparent',
      dots: 'bg-blue-600',
      pulse: 'bg-blue-600',
      progress: 'bg-blue-600',
      text: 'text-blue-600'
    },
    success: {
      spinner: 'border-green-600 border-t-transparent',
      dots: 'bg-green-600',
      pulse: 'bg-green-600',
      progress: 'bg-green-600',
      text: 'text-green-600'
    },
    warning: {
      spinner: 'border-yellow-600 border-t-transparent',
      dots: 'bg-yellow-600',
      pulse: 'bg-yellow-600',
      progress: 'bg-yellow-600',
      text: 'text-yellow-600'
    },
    danger: {
      spinner: 'border-red-600 border-t-transparent',
      dots: 'bg-red-600',
      pulse: 'bg-red-600',
      progress: 'bg-red-600',
      text: 'text-red-600'
    },
    white: {
      spinner: 'border-white border-t-transparent',
      dots: 'bg-white',
      pulse: 'bg-white',
      progress: 'bg-white',
      text: 'text-white'
    }
  };

  // Render theo type
  const renderLoader = () => {
    const currentSize = sizeClasses[size];
    const currentColor = colorClasses[color];

    switch (type) {
      case 'dots':
        return (
          <div className="flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${currentSize.dots} ${currentColor.dots} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <div className={`${currentSize.pulse} ${currentColor.pulse} rounded-full animate-ping opacity-75`} />
            <div className={`${currentSize.pulse} ${currentColor.pulse} rounded-full absolute top-0 left-0`} />
          </div>
        );

      case 'progress':
        return (
          <div className="w-64">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${currentColor.progress} transition-all duration-500 ease-out`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            {customText && (
              <p className={`text-sm mt-2 ${currentColor.text}`}>
                {customText}
              </p>
            )}
            {progress !== undefined && (
              <p className="text-xs text-gray-500 mt-1 text-right">
                {Math.round(progressWidth)}%
              </p>
            )}
          </div>
        );

      case 'spinner':
      default:
        return (
          <div className="relative">
            <div className={`${currentSize.spinner} border-gray-200 rounded-full`} />
            <div className={`${currentSize.spinner} ${currentColor.spinner} rounded-full absolute top-0 left-0 animate-spin`} />
          </div>
        );
    }
  };

  // Container classes
  const containerClasses = `
    flex flex-col items-center justify-center
    ${sizeClasses[size].container}
    ${overlay ? 'bg-black/50 rounded-lg' : ''}
    ${fullScreen ? 'fixed inset-0 z-50 bg-white/90' : ''}
  `;

  // Text component
  const renderText = () => {
    if (!text && type !== 'progress') return null;
    
    if (type === 'progress' && progress !== undefined) {
      return (
        <p className={`mt-4 text-sm font-medium ${colorClasses[color].text}`}>
          {text || 'Đang xử lý...'}
        </p>
      );
    }
    
    return (
      <p className={`mt-3 text-sm font-medium ${colorClasses[color].text}`}>
        {text}
      </p>
    );
  };

  // Nếu fullScreen, render modal
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50/90 to-indigo-100/90 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
          <div className="flex flex-col items-center">
            {renderLoader()}
            {renderText()}
            
            {/* Optional decorative elements */}
            <div className="mt-6 flex space-x-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal render
  return (
    <div className={containerClasses}>
      {renderLoader()}
      {renderText()}
    </div>
  );
}

/**
 * LoadingSpinner với text mặc định cho các trường hợp phổ biến
 */

// Spinner cho đang tải dữ liệu
export function LoadingData({ size = 'medium', fullScreen = false }) {
  return (
    <LoadingSpinner
      size={size}
      type="spinner"
      text="Đang tải dữ liệu..."
      fullScreen={fullScreen}
    />
  );
}

// Spinner cho đang xử lý
export function LoadingProcessing({ size = 'medium', fullScreen = false }) {
  return (
    <LoadingSpinner
      size={size}
      type="dots"
      text="Đang xử lý..."
      fullScreen={fullScreen}
    />
  );
}

// Spinner cho đang lưu
export function LoadingSaving({ size = 'medium', fullScreen = false }) {
  return (
    <LoadingSpinner
      size={size}
      type="pulse"
      color="success"
      text="Đang lưu..."
      fullScreen={fullScreen}
    />
  );
}

// Progress bar với giá trị
export function LoadingProgress({ progress, text, size = 'medium' }) {
  return (
    <LoadingSpinner
      size={size}
      type="progress"
      progress={progress}
      text={text}
      customText={`${Math.round(progress || 0)}% hoàn thành`}
    />
  );
}

/**
 * Loading overlay cho các section
 */
export function LoadingOverlay({ children, isLoading, text = '' }) {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
        <LoadingSpinner
          size="medium"
          text={text}
          overlay
        />
      </div>
    </div>
  );
}

/**
 * Inline loading (small, không text)
 */
export function InlineLoading({ color = 'primary' }) {
  return (
    <div className="inline-flex items-center">
      <div className={`w-3 h-3 border-2 ${colorClasses[color].spinner} border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

/**
 * Loading với skeleton
 */
export function LoadingWithSkeleton({ count = 3, isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

/**
 * Page loading (cho full page)
 */
export function PageLoading({ message = 'Đang tải trang...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full" />
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin" />
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full animate-bounce" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-400 rounded-full animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          English Translation Practice
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}