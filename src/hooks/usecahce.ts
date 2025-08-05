import { useState } from 'react';

interface ClearCacheOptions {
  type: 'all' | 'path' | 'tag' | 'images';
  path?: string;
  tag?: string;
}

export function useCache() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const clearCache = async (options: ClearCacheOptions) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        // Refresh halaman setelah clear cache
        window.location.reload();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      setMessage('❌ Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  return { clearCache, loading, message };
}