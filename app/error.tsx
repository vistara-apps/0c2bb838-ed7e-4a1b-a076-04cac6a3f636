'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('StreamSpark error:', error);
  }, [error]);

  return (
    <div className="min-h-screen streaming-bg flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-primary">
            Oops! Something went wrong
          </h2>
          <p className="text-text-secondary">
            We encountered an error while loading StreamSpark. Don't worry, your tips are safe!
          </p>
        </div>

        <button
          onClick={reset}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        <p className="text-sm text-text-secondary">
          If the problem persists, please refresh the page or contact support.
        </p>
      </div>
    </div>
  );
}
