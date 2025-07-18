import React from 'react';

const OfflineBanner = () => {
  return (
    <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span>You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

export default OfflineBanner; 