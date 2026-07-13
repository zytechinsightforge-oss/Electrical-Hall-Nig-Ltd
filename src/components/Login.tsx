import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    // Standard credential checking
    const passMap: Record<string, string> = {
      admin: 'admin123',
      accountant: 'accountant123',
      cashier: 'cashier123',
    };

    const expectedPass = passMap[username.toLowerCase().trim()];
    if (!expectedPass || expectedPass !== password) {
      setError('Invalid username or password.');
      return;
    }

    // Role verification
    const expectedRoleMap: Record<string, 'Admin' | 'Accountant' | 'Cashier'> = {
      admin: 'Admin',
      accountant: 'Accountant',
      cashier: 'Cashier',
    };

    const userRole = expectedRoleMap[username.toLowerCase().trim()];
    
    setLoading(true);
    setTimeout(() => {
      const success = login(username.trim(), userRole);
      setLoading(false);
      if (!success) {
        setError('Login failed. User profile may be inactive.');
      }
    }, 450);
  };

  return (
    <div id="login_screen" className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background visual details */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8 z-10">
        
        {/* Company Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-slate-900 border border-slate-700 text-white shadow-lg mb-4 animate-pulse overflow-hidden p-0">
            {settings.logo && (settings.logo.startsWith('data:image') || settings.logo.startsWith('http') || settings.logo.length > 8) ? (
              <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-4xl font-bold">{settings.logo || '🔌'}</span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">
            {settings.name}
          </h1>
          <p className="text-blue-400 text-xs font-mono tracking-widest mt-1 uppercase">
            {settings.motto || "Powering Quality & Reliability"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 animate-shake">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {settings.name}. All Rights Reserved.
      </div>
    </div>
  );
}
