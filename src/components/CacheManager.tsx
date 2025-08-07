'use client';

import { useCache } from '@/hooks/usecahce';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function CacheManager() {
  const { clearCache, loading, message } = useCache();
  const [customPath, setCustomPath] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (message) {
      toast(message, {
        icon: '✅',
        style: {
          background: darkMode ? '#1f2937' : '#fff',
          color: darkMode ? '#fff' : '#1f2937',
        },
      });
    }
  }, [message, darkMode]);

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const cacheActions = [
    {
      label: '🗑️ Clear All Cache',
      action: () => clearCache({ type: 'all' }),
      description: 'Clear semua cache Next.js',
      danger: true
    },
    {
      label: '🖼️ Clear Image Cache',
      action: () => clearCache({ type: 'images' }),
      description: 'Clear cache gambar saja'
    },
    {
      label: '📄 Clear Homepage',
      action: () => clearCache({ type: 'path', path: '/' }),
      description: 'Clear cache halaman utama'
    },
    {
      label: '👨‍⚕️ Clear Dokter Pages',
      action: () => clearCache({ type: 'tag', tag: 'dokter' }),
      description: 'Clear cache halaman dokter'
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto transition-colors duration-200">
      {/* Header with Dark Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          🧹 Cache Management
        </h2>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {cacheActions.map((item, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors">
            <button
              onClick={item.action}
              disabled={loading}
              className={`w-full p-3 rounded font-medium disabled:opacity-50 transition-colors ${
                item.danger
                  ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
              }`}
            >
              {loading ? '🔄 Processing...' : item.label}
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Custom Path */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Clear Specific Path:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="/admin/dokter"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => clearCache({ type: 'path', path: customPath })}
            disabled={loading || !customPath}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded disabled:opacity-50 transition-colors"
          >
            Clear Path
          </button>
        </div>
      </div>

      {/* Custom Tag */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Clear Specific Tag:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="dokter, jadwal, etc"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => clearCache({ type: 'tag', tag: customTag })}
            disabled={loading || !customTag}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded disabled:opacity-50 transition-colors"
          >
            Clear Tag
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors">
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      )}
    </div>
  );
}