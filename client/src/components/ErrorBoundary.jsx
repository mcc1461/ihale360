// src/components/ErrorBoundary.jsx

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Hata yakalandığında state'i günceller
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hata bilgilerini loglayabilirsiniz
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">Something went wrong.</h1>
          <p className="mt-4">Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
