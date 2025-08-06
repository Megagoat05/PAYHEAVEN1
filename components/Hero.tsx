
import React from 'react';
import { ShieldCheckIcon, BoltIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="text-center py-20 md:py-32">
      <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider">
        <span className="text-glow-pink text-fuchsia-400">TRUSTED ACCOUNTS</span>
        <span className="block text-glow-blue text-cyan-300 mt-2">INSTANT ACCESS</span>
        <span className="text-glow-pink text-fuchsia-400">ZERO HASSLE</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
        Bypass banking bureaucracy. Acquire fully verified, ready-to-use business accounts for Stripe, PayPal, and more. Instant delivery, 24/7 support.
      </p>
      <div className="mt-10">
        <button onClick={onGetStarted} className="font-orbitron font-bold text-lg bg-cyan-400 text-black px-8 py-4 rounded-md hover:bg-cyan-300 transition-transform duration-300 transform hover:scale-105 neon-blue-shadow">
          Get Your Account Now
        </button>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
          <ShieldCheckIcon className="h-10 w-10 text-cyan-400" />
          <div>
            <h3 className="font-bold text-lg">100% Verified</h3>
            <p className="text-sm text-slate-400">All docs included.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
          <BoltIcon className="h-10 w-10 text-cyan-400" />
          <div>
            <h3 className="font-bold text-lg">Instant Delivery</h3>
            <p className="text-sm text-slate-400">Access via email.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 glass-card rounded-lg">
          <DocumentTextIcon className="h-10 w-10 text-cyan-400" />
          <div>
            <h3 className="font-bold text-lg">Full Documentation</h3>
            <p className="text-sm text-slate-400">Complete handover.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
