'use client';

interface LoadingSkeletonProps {
  variant?: 'profile' | 'tipjar' | 'card' | 'button' | 'stats';
  count?: number;
}

export function LoadingSkeleton({ variant = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'profile':
        return (
          <div className="text-center space-y-4 animate-fade-in">
            {/* Profile Picture */}
            <div className="relative inline-block">
              <div className="skeleton w-24 h-24 rounded-full mx-auto"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 skeleton rounded-full"></div>
            </div>

            {/* Streamer Info */}
            <div className="space-y-2">
              <div className="skeleton h-8 w-48 mx-auto rounded-lg"></div>
              <div className="skeleton h-4 w-64 mx-auto rounded"></div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="skeleton h-6 w-24 rounded"></div>
              <div className="skeleton h-6 w-28 rounded"></div>
              <div className="skeleton h-6 w-16 rounded"></div>
            </div>

            {/* Status Badge */}
            <div className="skeleton h-8 w-32 mx-auto rounded-full"></div>
          </div>
        );

      case 'tipjar':
        return (
          <div className="text-center space-y-4 animate-fade-in">
            {/* Tip Jar */}
            <div className="skeleton w-32 h-40 mx-auto rounded-full"></div>
            
            {/* Amount Display */}
            <div className="space-y-2">
              <div className="skeleton h-8 w-32 mx-auto rounded"></div>
              <div className="skeleton h-4 w-40 mx-auto rounded"></div>
            </div>

            {/* Progress Bar */}
            <div className="w-48 mx-auto space-y-1">
              <div className="flex justify-between">
                <div className="skeleton h-3 w-12 rounded"></div>
                <div className="skeleton h-3 w-16 rounded"></div>
              </div>
              <div className="skeleton h-2 w-full rounded-full"></div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="card animate-fade-in">
            <div className="space-y-4">
              <div className="skeleton h-6 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-2/3 rounded"></div>
              <div className="skeleton h-10 w-full rounded-lg"></div>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="skeleton h-12 w-full rounded-lg animate-fade-in"></div>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card text-center space-y-2">
                <div className="skeleton h-8 w-16 mx-auto rounded"></div>
                <div className="skeleton h-4 w-20 mx-auto rounded"></div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="skeleton h-20 w-full rounded-lg animate-fade-in"></div>
        );
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="mb-4 last:mb-0">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}