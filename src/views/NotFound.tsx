'use client';
import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Ghost className="w-24 h-24 text-blue-600 animate-bounce" />
            <div className="absolute -bottom-2 w-full h-4 bg-gray-200 rounded-full blur-xl opacity-50"></div>
          </div>
        </div>
        
        <h1 className="text-9xl font-black text-gray-200 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-12 text-lg">
          Oops! It looks like the diagnostics for this URL returned a null result. The production setup you're looking for was not found in this repository.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-16 text-xs text-gray-400 font-medium uppercase tracking-widest">
            VideoFix Pro • Diagnostic Error ID: 404-NOT-FOUND
        </div>
      </div>
    </div>
  );
};

export default NotFound;
