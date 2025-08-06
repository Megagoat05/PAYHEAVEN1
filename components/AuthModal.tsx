import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // API call
    try {
  const url = mode === 'login'
    ? 'http://localhost:5000/auth/login'
    : 'http://localhost:5000/auth/register';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed');

  if (mode === 'login') {
    // Save the JWT token and user data
    login(data.user.email, data.token, data.user.balance);
  } else {
    // After registration, log them in automatically
    login(data.user.email, '', data.user.balance);
  }
  // IMPORTANT: pass the real balance from backend
await login(data.user.email, data.token, data.user.balance, {
  id: data.user.id,
  frozen: data.user.frozen,
});

  onSuccess?.();
  onClose();


    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="glass-card rounded-lg w-full max-w-md m-4 border-2 border-fuchsia-500 neon-pink-shadow relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-8">
          <h2 className="font-orbitron text-3xl font-bold text-center mb-6 text-glow-pink">
            {mode === 'login' ? 'Access Port' : 'Create Identity'}
          </h2>
          <form onSubmit={handleAuth}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {mode === 'register' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              )}
            </div>
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-cyan-400 text-black font-bold py-3 rounded-md hover:bg-cyan-300 transition-colors duration-300 neon-blue-shadow disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {loading ? (
                 <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-black mx-auto"></div>
              ) : (mode === 'login' ? 'Login' : 'Register')}
            </button>
          </form>
          <p className="text-center text-sm text-slate-400 mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={switchMode} className="font-bold text-cyan-400 hover:underline ml-2">
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};