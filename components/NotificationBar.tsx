import React, { useState } from 'react';

export const NotificationBar = () => {
  const [visible, setVisible] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Form hidden by default

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://formspree.io/f/mzzvglnn', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(e.target as HTMLFormElement),
      });

      const data = await res.json();

      if (data.ok || res.status === 200) {
        setSubmitted(true);
        setTimeout(() => setShowForm(false), 1500); // Auto-close after success
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Submission failed.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-bold p-2 relative overflow-hidden">
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 text-lg leading-none"
        aria-label="Dismiss notification"
      >
        ✖
      </button>

      <div className="flex items-center justify-center gap-4 flex-wrap px-8">
        {/* Announcement Text */}
        <p className="flex-shrink-0">📢 We update our stock 24/7. Join us for real-time alerts!</p>

        {/* Telegram Button */}
        <a
          href="https://t.me/JamesGrugeon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-cyan-100 transition whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M9.96 15.67l-.39 4.12c.56 0 .81-.24 1.1-.53l2.64-2.5 5.48 4.02c1.01.56 1.72.26 1.99-.94l3.62-16.92c.34-1.55-.56-2.16-1.54-1.8L1.18 9.56c-1.51.6-1.48 1.46-.27 1.84l5.53 1.72L18.5 5.66c.64-.39 1.23-.18.75.25" />
          </svg>
          Telegram
        </a>

        {/* Newsletter Toggle Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-cyan-100 transition whitespace-nowrap"
        >
          📨 Newsletter
        </button>

        {/* Inline Form (only shows when toggled) */}
        {showForm && (
          <div className="flex items-center gap-2 ml-2">
            {submitted ? (
              <span className="text-green-300 text-xs">✅ Subscribed!</span>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-1">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-2 py-1 rounded text-black text-xs w-36"
                  onClick={(e) => e.stopPropagation()} // Prevent toggle conflict
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                >
                  {loading ? '...' : 'Join'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};