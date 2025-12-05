import React, { useEffect, useState } from 'react';
import { LayoutList, History, Folder, Sun, Moon, LogOut } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { API_BASE_URL } from '../apiConfig'; // <--- NEW IMPORT

export default function Sidebar({ onLoadHistory, userId, isDark, toggleTheme }) {
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => { if (userId) refreshData(); }, [userId]);

  const refreshData = () => { fetchHistory(); fetchCollections(); };

  const fetchHistory = async () => {
    try {
      // Updated URL
      const res = await axios.get(`${API_BASE_URL}/history`, { params: { userId } });
      setHistory(res.data);
    } catch (error) { console.error("Failed to fetch history"); }
  };

  const fetchCollections = async () => {
    try {
        // Updated URL
        const res = await axios.get(`${API_BASE_URL}/collections`, { params: { userId } });
        setCollections(res.data);
    } catch (e) { console.error("Error loading collections"); }
  };

  const createCollection = async () => {
    const name = prompt("Enter Collection Name:");
    if (!name) return;
    // Updated URL
    await axios.post(`${API_BASE_URL}/collections`, { name, userId });
    fetchCollections();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getMethodColor = (m) => {
    if(m === 'GET') return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    if(m === 'POST') return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if(m === 'DELETE') return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
    return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full transition-colors">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
           API Tester
        </h1>
        <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleLogout} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400" title="Logout">
                <LogOut size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        
        {/* History */}
        <div className="mb-6">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2 px-2 text-xs font-bold uppercase tracking-wider">
            <History size={14} className="mr-2" /> History
          </div>
          <div className="space-y-1">
            {history.map((item) => (
              <div key={item.id} onClick={() => onLoadHistory(item)} className="group flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getMethodColor(item.method)}`}>{item.method}</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">{item.url}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2 px-2 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center text-xs font-bold uppercase tracking-wider">
                   <LayoutList size={14} className="mr-2" /> Collections
                </div>
                <button onClick={createCollection} className="text-[10px] hover:text-blue-500 font-bold border border-slate-300 dark:border-slate-600 px-2 py-0.5 rounded transition-colors">+ NEW</button>
            </div>
            <div className="space-y-2">
                {collections.map(col => (
                    <div key={col.id}>
                        <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800 font-semibold text-xs flex items-center text-slate-700 dark:text-slate-300">
                            <Folder size={12} className="mr-2 text-amber-500 fill-amber-500" /> {col.name}
                        </div>
                        <div className="pl-2">
                            {col.collection_items?.map(item => (
                                <div key={item.id} onClick={() => onLoadHistory(item)} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 text-xs py-2 px-2 flex items-center gap-2 rounded-sm transition-colors text-slate-600 dark:text-slate-400">
                                    <span className={`text-[9px] font-bold px-1 rounded ${getMethodColor(item.method)}`}>{item.method}</span>
                                    <span className="truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
