import React from 'react';
import { Link } from 'react-router-dom';
import { NotificationBar } from './NotificationBar'; // Ensure path is correct

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-slate-300 py-12 px-4 relative overflow-hidden">
      {/* 🔔 Notification Bar - Always at the very top */}
      <NotificationBar />

      {/* Animated Background Grid with Neon Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,_72,_153,_0.1),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(147,_51,_234,_0.05)_1px,_transparent_1px),_linear-gradient(rgba(147,_51,_234,_0.05)_1px,_transparent_1px)] bg-[length:50px_50px] opacity-30"></div>
      </div>

      {/* Floating Neon Orbs */}
      <div className="absolute top-1/4 left-1/10 w-32 h-32 bg-pink-500 rounded-full mix-blend-screen blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen blur-xl opacity-20 animate-pulse delay-1000"></div>

      {/* 🔝 Header with Logo */}
      <header className="relative z-50 mb-10 px-6 py-4">
        <div className="container mx-auto flex justify-center sm:justify-start">
          <Link
            to="/"
            className="group flex flex-col items-center sm:items-start gap-1"
          >
            {/* Main Logo Text */}
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-500 bg-clip-text group-hover:scale-105 transition-transform duration-200 font-orbitron">
              PAY<span className="text-cyan-400">HEAVEN</span>
            </span>
            {/* Tagline */}
            <span className="text-sm font-light text-slate-300 group-hover:text-cyan-400 transition-colors duration-300">
              YOUR GATEWAY TO FINANCIAL FREEDOM
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto max-w-4xl relative">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent text-center mb-6 bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-500 bg-clip-text animate-pulse">
          Terms of Service
        </h1>

        {/* Neon-Bordered Card */}
        <div className="relative p-1 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-blue-500/20 backdrop-blur-sm">
          <div className="bg-slate-950 rounded-lg shadow-2xl shadow-purple-900/20 p-8 prose prose-invert prose-cyan prose-lg border border-white/10">
            {/* 1. Introduction */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full shadow-glow"></span>
                1. Introduction
              </h2>
              <p>
                Welcome to <strong className="text-cyan-400">PAYHEAVEN</strong>. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service. 
                If you do not agree, please do not use our services.
              </p>
            </section>

            {/* 2. Services */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full shadow-glow"></span>
                2. Services
              </h2>
              <p>
                PAYHEAVEN is a digital platform designed for entrepreneurs and professionals who are blocked, banned, or restricted from accessing essential financial and e-commerce platforms such as Stripe, Shopify, PayPal, and others. These limitations often result from strict verification systems, geographic restrictions, or prior account flags even when the user's business operations are fully legitimate.
              </p>
              <p className="mt-4">
                Our service provides fully activated, high-tier accounts that have already processed hundreds to thousands of dollars in real transactions. This means they are not simply warmed up — they are proven, trusted, and immediately operational. There is no additional setup required, no waiting period, and no risk of being flagged during onboarding.
              </p>
              <p className="mt-4">
                Payments can be made via cryptocurrency or through a manual bank deposit arranged directly with our support team on Telegram. Once payment is confirmed — typically within less than one hour — your account is released and all login credentials are securely delivered to the email address you provided during registration.
              </p>
              <p className="mt-4">
                This streamlined process enables our users to regain access to critical financial tools quickly and efficiently, minimizing downtime and allowing business operations to resume without delay.
              </p>
            </section>

            {/* 3. User Responsibility */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-glow"></span>
                3. User Responsibility
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                <li>All transactions are final unless otherwise agreed upon by admin.</li>
              </ul>
            </section>

            {/* 4. Escrow & Trust */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full shadow-glow"></span>
                4. Escrow & Trust
              </h2>
              <p>
                PAYHEAVEN is associated with{' '}
                <strong className="text-pink-400">ESCROW James Grugeon</strong>, a trusted escrow service with over $500k processed. 
                For high-value transactions or disputes, you may contact{' '}
                <strong>
                  <a
                    href="https://t.me/JamesGrugeon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Telegram @JamesGrugeon
                  </a>
                </strong>{' '}
                for mediation or escrow support.
              </p>
            </section>

            {/* 5. Prohibited Activities */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-glow"></span>
                5. Prohibited Activities
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li>Using the service for illegal, fraudulent, or abusive purposes.</li>
                <li>Attempting to hack, scrape, or disrupt the platform.</li>
                <li>Impersonating others or creating fake accounts.</li>
              </ul>
            </section>

            {/* 6. Our Commitment to You */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-glow"></span>
                6. Our Commitment to You
              </h2>
              <p>
                At PAYHEAVEN, we’re committed to providing a seamless, secure, and stress-free experience from the moment you make your purchase.
              </p>
              <p className="mt-4">
                Every account we deliver is thoroughly verified, fully activated, and backed by real transaction history — so you can start using it immediately with confidence.
              </p>
              <p className="mt-4">
                Our team is always available via{' '}
                <strong>
                  <a
                    href="https://t.me/JamesGrugeon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Telegram @JamesGrugeon
                  </a>
                </strong>{' '}
                for fast support, guidance, and assistance with any questions.
              </p>
              <p className="mt-4">
                We stand behind every service we offer and work hard to ensure your success. When you choose PAYHEAVEN, you're not just buying an account — you're gaining a reliable partner for your business growth.
              </p>
            </section>

            {/* 7. Changes to Terms */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-glow"></span>
                7. Changes to Terms
              </h2>
              <p>
                We may update these terms at any time. Continued use of the service after changes constitutes acceptance.
              </p>
            </section>

            {/* 8. Contact */}
            <section className="mb-8 group">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3 group-hover:text-cyan-400 transition-colors duration-300">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-glow"></span>
                8. Contact
              </h2>
              <p>
                For questions about these Terms, or to request escrow support, contact us via{' '}
                <strong>
                  <a
                    href="https://t.me/JamesGrugeon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Telegram @JamesGrugeon
                  </a>
                </strong>.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-sm text-slate-500 tracking-wider">
          &copy; {new Date().getFullYear()} <span className="text-cyan-400">PAYHEAVEN</span>. All Rights Reserved.
        </p>
      </div>

      {/* Final Disclaimer */}
      <div className="container mx-auto px-4 mt-6 pb-8">
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl mx-auto text-center">
          ⚠️ PAYHEAVEN does not promote or support fraudulent activity. All accounts are intended for legal business use only. Buyers must comply with the respective platform’s terms of service and local regulations.
        </p>
      </div>

      {/* Subtle Neon Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 w-px h-20 bg-gradient-to-b from-pink-500/40 to-transparent blur-sm -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default TermsOfService;