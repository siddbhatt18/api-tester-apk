import React from 'react';
import JsonEditor from './JsonEditor';

// --- SKELETON LOADER ---
const Skeleton = () => (
    <div className="animate-pulse space-y-3 p-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
    </div>
);

export default function ResponsePanel({ response, loading, isDark }) {
  
  const formatJSON = (data) => {
    try {
        return JSON.stringify(data, null, 2);
    } catch (e) {
        return JSON.stringify({ error: "Could not parse JSON" }, null, 2);
    }
  };

  const getStatusColor = (status) => {
    if (status === 0) return 'text-red-600 dark:text-red-400'; 
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
    if (status >= 400) return 'text-red-600 dark:text-red-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="w-1/3 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col h-full transition-colors">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200">Response</h2>
        
        {response && !loading && (
            <div className="flex gap-4 text-sm">
                <span className={getStatusColor(response.status)}>
                    Status: <span className="font-bold">{response.status} {response.statusText}</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                    Time: <span className="font-bold">{response.time}</span>
                </span>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        {loading ? (
            <Skeleton />
        ) : response ? (
            <div className="h-full border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                <JsonEditor 
                    value={formatJSON(response.data)} 
                    readOnly={true} 
                    isDark={isDark}
                />
            </div>
        ) : (
            <div className="text-sm text-slate-400 text-center mt-10">
                Press "Send" to see response...
            </div>
        )}
      </div>
    </div>
  );
}