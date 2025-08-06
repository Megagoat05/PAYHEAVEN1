import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Use react-router-dom Link instead of next/link

export const Footer = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://formspree.io/f/mzzvglnn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="glass-card mt-16 border-t border-white/10">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400">
        <p className="text-sm">&copy; {new Date().getFullYear()} PAYHEAVEN. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          {/* Telegram external link */}
          <a
            href="https://t.me/JamesGrugeon"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Telegram
          </a>
          <span>|</span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="hover:text-cyan-400 transition-colors"
          >
            Newsletter
          </button>
          <span>|</span>
          {/* React Router Link for internal navigation */}
          <Link
            to="/terms"
            className="hover:text-cyan-400 transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded bg-white text-black w-64"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              required
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded transition-colors ${
                status === 'loading'
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
            {status === 'success' && <p className="text-green-400">✅ Subscribed successfully!</p>}
            {status === 'error' && <p className="text-red-400">❌ Something went wrong. Try again.</p>}
          </form>
        )}
      </div>
    </footer>
  );
};
