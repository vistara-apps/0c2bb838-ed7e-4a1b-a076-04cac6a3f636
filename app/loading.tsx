export default function Loading() {
  return (
    <div className="min-h-screen streaming-bg flex items-center justify-center">
      <div className="text-center text-white space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Loading StreamSpark</h2>
          <p className="text-purple-200">Preparing your tip jar...</p>
        </div>
      </div>
    </div>
  );
}
