'use client';

import { useState } from 'react';
import { useCache } from '@/hooks/usecahce';

interface ClearCacheButtonProps {
  variant?: 'all' | 'path' | 'tag' | 'images';
  path?: string;
  tag?: string;
  className?: string;
}

export default function ClearCacheButton({ 
  variant = 'all', 
  path, 
  tag, 
  className 
}: ClearCacheButtonProps) {
  const { clearCache, loading, message } = useCache();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearCache = async () => {
    if (variant === 'all' && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    await clearCache({
      type: variant,
      path: path,
      tag: tag
    });

    setShowConfirm(false);
  };

  const getButtonText = () => {
    if (loading) return '🔄 Clearing...';
    
    switch (variant) {
      case 'all':
        return '🗑️ Clear All Cache';
      case 'path':
        return '🗑️ Clear Path Cache';
      case 'tag':
        return '🗑️ Clear Tag Cache';
      case 'images':
        return '🖼️ Clear Image Cache';
      default:
        return '🗑️ Clear Cache';
    }
  };

  return (
    <div className="inline-block">
      {showConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={handleClearCache}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            ⚠️ Confirm Clear All
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleClearCache}
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 ${className}`}
        >
          {getButtonText()}
        </button>
      )}
      
      {message && (
        <div className="mt-2 p-2 rounded bg-gray-100 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}