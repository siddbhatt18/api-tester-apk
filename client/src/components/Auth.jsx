import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Mail, User } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        // LOGIN
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        // SIGNUP
        result = await supabase.auth.signUp({ email, password });
      }

      const { data, error } = result;

      if (error) throw error;
      
      if (data.user) {
        onLogin(data.user);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-8 rounded-lg shadow-md">
        
        <div className="flex justify-center mb-6 text-blue-600">
          <div className="p-3 bg-blue-100 rounded-full">
            <User size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>

      </div>
    </div>
  );
}