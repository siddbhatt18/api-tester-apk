import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import Auth from './components/Auth'; 
import { supabase } from './supabaseClient'; 
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestToLoad, setRequestToLoad] = useState(null);
  
  // 1. Theme State (Check local storage first)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Handle Dark Mode Class on HTML Body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: isDark ? '#334155' : '#fff',
          color: isDark ? '#fff' : '#000',
        }
      }} />
      
      {/* Pass theme props to children */}
      <Sidebar 
        onLoadHistory={(item) => setRequestToLoad(item)} 
        userId={user.id} 
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
      />
      
      <RequestPanel 
        setResponse={setResponse} 
        setLoading={setLoading} 
        requestToLoad={requestToLoad} 
        userId={user.id}
        isDark={isDark}
      />
      
      <ResponsePanel response={response} loading={loading} isDark={isDark} />
    </div>
  );
}

export default App;