import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const { t } = useAdminLocale();
  const navigate = useNavigate();

  // If already logged in, go straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Force reload or just navigate. Navigate works best in react-router v6.
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 admin-theme relative overflow-hidden">
      {/* Editorial Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
      </div>

      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none p-12 border border-white dark:border-white/5 relative group">
          {/* Subtle Border Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 dark:to-transparent rounded-[3rem] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 rounded-3xl bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 mb-8 animate-bounce-subtle">
              <LogIn className="h-8 w-8 text-[var(--primary-color)]" />
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase italic leading-none">
              SWEETO <span className="text-[var(--primary-color)]">HUBS</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gray-200 dark:bg-slate-800" />
              <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em]">{t('login')} — Administration</p>
              <div className="h-px w-8 bg-gray-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-4">
                Access Identifier
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-8 py-5 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:border-[var(--primary-color)] transition-all font-bold text-sm tracking-tight"
                  placeholder="admin@sweetohubs.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-4">
                Security Passcode
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-8 py-5 bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:border-[var(--primary-color)] transition-all font-mono font-bold text-sm"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-300 hover:text-[var(--primary-color)] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest animate-shake flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--primary-color)] dark:hover:bg-[var(--primary-color)] hover:text-white transition-all shadow-2xl shadow-black/20 hover:shadow-[var(--primary-color)]/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying Credentials...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Establish Connection
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.4em]">
              Security Node: <span className="text-gray-300 dark:text-slate-800">SH-ADM-71F</span>
            </p>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest opacity-60">
            System Maintenance? <button className="text-[var(--primary-color)] hover:underline ml-1">Contact Tech Support</button>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default LoginPage;
