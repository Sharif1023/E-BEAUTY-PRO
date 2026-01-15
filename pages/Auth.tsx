
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { mockApi } from '../services/mockApi';

interface AuthProps {
  onLogin: (user: any) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      if (mode === 'login') {
        const user = await mockApi.login(formData.email, formData.password);
        if (user) {
          onLogin(user);
          navigate('/');
        } else {
          setError('Invalid email or password. Try admin@eshop.com');
        }
      } else if (mode === 'register') {
        const user = await mockApi.register(formData.name, formData.email, formData.password);
        onLogin(user);
        navigate('/');
      } else if (mode === 'forgot') {
        const exists = await mockApi.requestPasswordReset(formData.email);
        if (exists) {
          setSuccessMsg('A reset link has been sent to your email.');
          // In this mock, we automatically transition to the reset step for demo purposes
          setTimeout(() => setMode('reset'), 2000);
        } else {
          setError('No account found with this email address.');
        }
      } else if (mode === 'reset') {
        const success = await mockApi.resetPassword(formData.email, formData.newPassword);
        if (success) {
          setSuccessMsg('Password updated successfully! Redirecting to login...');
          setTimeout(() => setMode('login'), 2000);
        } else {
          setError('Failed to reset password. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </h1>
            <p className="text-gray-500">
              {mode === 'login' && 'Log in to your account'}
              {mode === 'register' && 'Join our premium shopping experience'}
              {mode === 'forgot' && "Enter your email to receive a reset link"}
              {mode === 'reset' && 'Enter your new secure password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center"><User size={14} className="mr-1" /> Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="Alex Johnson" 
                />
              </div>
            )}
            
            {(mode === 'login' || mode === 'register' || mode === 'forgot' || mode === 'reset') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center"><Mail size={14} className="mr-1" /> Email Address</label>
                <input 
                  required
                  type="email"
                  disabled={mode === 'reset'}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50" 
                  placeholder="alex@example.com" 
                />
              </div>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center"><Lock size={14} className="mr-1" /> Password</label>
                  {mode === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            )}

            {mode === 'reset' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center"><Lock size={14} className="mr-1" /> New Password</label>
                <input 
                  required
                  type="password"
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center animate-in slide-in-from-top-2">
                <Shield size={18} className="mr-2" /> {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100 flex items-center animate-in slide-in-from-top-2">
                <CheckCircle size={18} className="mr-2" /> {successMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100 transition-all transform active:scale-[0.98] disabled:bg-gray-400"
            >
              <span>
                {loading ? 'Processing...' : (
                  mode === 'login' ? 'Sign In' : 
                  mode === 'register' ? 'Register' :
                  mode === 'forgot' ? 'Send Reset Link' :
                  'Update Password'
                )}
              </span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {mode !== 'forgot' && mode !== 'reset' ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-bold text-gray-400"><span className="bg-white px-2">Or</span></div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-gray-600 font-semibold hover:text-indigo-600 transition-colors"
                >
                  {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <button 
                onClick={() => setMode('login')}
                className="text-gray-600 font-semibold hover:text-indigo-600 transition-colors flex items-center justify-center mx-auto"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Login
              </button>
            </div>
          )}

          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
             <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest text-center">Developer Access</p>
             <p className="text-[11px] text-indigo-600 text-center mt-1">Use <b>admin@eshop.com</b> for testing password resets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
