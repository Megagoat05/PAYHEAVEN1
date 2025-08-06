import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';

// Your existing components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AccountGrid } from './components/AccountGrid';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { NotificationBar } from './components/NotificationBar';
import { AuthModal } from './components/AuthModal';
import { WalletModal } from './components/WalletModal';
import { Dashboard } from './components/Dashboard';
import { AccountPage } from './components/Account';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { WalletProvider, useWallet } from './hooks/useWallet';
import { Account } from './types';
import { InfoSections } from './components/InfoSections';
import { FreezeGuard } from "./components/FreezeGuard";
import TermsOfService from './components/terms';

// New: Admin Components
const AdminResetPassword = React.lazy(() => import('./components/AdminResetPassword'));

// Background Orbs
const BackgroundOrbs = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="animated-orb bg-purple-600 top-1/4 left-1/4 animate-pulse"></div>
    <div className="animated-orb bg-cyan-400 top-1/2 right-1/4 animate-pulse delay-1000"></div>
    <div className="animated-orb bg-fuchsia-500 bottom-0 left-1/3 animate-pulse delay-2000"></div>
  </div>
);

// Home Page
const HomePageContent = ({ onBuyNow }: { onBuyNow: (account: Account) => void }) => (
  <>
    <Hero onGetStarted={() => document.getElementById('accounts')?.scrollIntoView({ behavior: 'smooth' })} />
    <AccountGrid onBuyNow={onBuyNow} />
    <Features />
    <InfoSections />
    <Testimonials />
    <FAQ />
  </>
);

// Admin Login Page (Simple)
function AdminLoginPage() {
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    // Compare with your admin password (set in .env)
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      alert('Invalid admin password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 text-slate-200">
      <form onSubmit={handleLogin} className="bg-stone-800 p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Admin Login</h2>
        <input
          type="password"
          name="password"
          placeholder="Enter admin password"
          className="border border-stone-600 bg-stone-700 text-slate-100 p-3 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

// Admin Protected Route
function AdminRoute({ children }: { children: JSX.Element }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

// Admin Dashboard
function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-950 text-slate-200">
      <Header onLogout={() => localStorage.removeItem('isAdmin')} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">🛡️ Admin Panel</h1>
        <React.Suspense fallback={<p>Loading admin tools...</p>}>
          <AdminResetPassword />
        </React.Suspense>
      </div>
    </div>
  );
}

// Main App Content
const AppContent = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'account'>('home');

  const { isAuthenticated, logout } = useAuth();
  const { balance, purchase } = useWallet();

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage('home');
    }
  }, [isAuthenticated]);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  const handlePurchase = (account: Account) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (balance >= account.price) {
      purchase(account);
      alert(`Successfully purchased ${account.name}! View order in your dashboard. Details will be sent to your email.`);
      setCurrentPage('dashboard');
    } else {
      alert('Insufficient balance. Please top up your wallet.');
      setWalletModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-950/80 text-slate-200 bg-grid overflow-x-hidden">
      <BackgroundOrbs />
      <NotificationBar />
      <Header
        onNavigate={setCurrentPage}
        onLogin={() => openAuthModal('login')}
        onRegister={() => openAuthModal('register')}
        onTopUp={() => setWalletModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePageContent onBuyNow={handlePurchase} />}
        {isAuthenticated && currentPage === 'dashboard' && <Dashboard onBuyNow={handlePurchase} />}
        {isAuthenticated && currentPage === 'account' && <AccountPage />}
      </main>

      <Footer />

      {isAuthModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            // Stay on current page after login
          }}
        />
      )}
      {isWalletModalOpen && isAuthenticated && (
        <WalletModal
          onClose={() => setWalletModalOpen(false)}
        />
      )}
    </div>
  );
};

// Define Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContent />,
  },
  {
    path: '/dashboard',
    element: <AppContent />,
  },
  {
     path: '/terms',
    element: <TermsOfService /> },   // <-- Add this
  {
    path: '/account',
    element: <AppContent />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
]);

// Main App
const App = () => {
  return (
    <AuthProvider>
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </AuthProvider>
  );
};

export default App;