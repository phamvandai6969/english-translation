"use client";
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // You might want to reload the page or navigate somewhere
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">😟</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Đã xảy ra lỗi
            </h2>
            <p className="text-gray-600 mb-6">
              Xin lỗi, có lỗi xảy ra trong quá trình xử lý.
            </p>
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-red-800 font-mono">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Quay lại trang chủ
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}