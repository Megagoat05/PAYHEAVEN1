import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';
import { WalletIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, Squares2X2Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
    onLogin: () => void;
    onRegister: () => void;
    onTopUp: () => void;
    onNavigate: (page: 'home' | 'dashboard' | 'account') => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogin, onRegister, onTopUp, onNavigate, onLogout }) => {
    const { isAuthenticated } = useAuth();
    const { balance } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const formatBalance = (num: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    };
    
    const NavLinks = () => (
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {isAuthenticated ? (
                <>
                    <div className="flex items-center gap-2 text-cyan-400">
                        <WalletIcon className="h-6 w-6" />
                        <span className="font-orbitron">{formatBalance(balance)}</span>
                         <button onClick={onTopUp} className="ml-2 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full hover:bg-cyan-500/40 transition-colors">
                            +
                        </button>
                    </div>
                   <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 font-bold hover:text-cyan-400 transition-colors">
                        <Squares2X2Icon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </button>
                    <button onClick={() => onNavigate('account')} className="flex items-center gap-2 font-bold hover:text-cyan-400 transition-colors">
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span>Account</span>
                    </button>
                    <button onClick={onLogout} className="flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </>
            ) : (
                <>
                    <button onClick={onLogin} className="font-bold hover:text-cyan-400 transition-colors">Login</button>
                    <button onClick={onRegister} className="font-bold bg-fuchsia-500 text-white px-4 py-2 rounded-full hover:bg-fuchsia-600 transition-colors neon-pink-shadow text-sm">
                        Register
                    </button>
                </>
            )}
        </div>
    );

    return (
        <header className="sticky top-0 z-40 glass-card">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                 <button onClick={() => onNavigate('home')} className="flex flex-col items-center">
  <span className="text-2xl font-orbitron font-bold text-glow-pink">
    PAY<span className="text-cyan-400 text-glow-blue">HEAVEN</span>
  </span>
  <span className="text-sm font-light text-gray-300">
    YOUR GATEWAY TO FINANCIAL FREEDOM
  </span>
</button>

                <nav className="hidden md:flex">
                    <NavLinks />
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden glass-card py-4">
                    <nav className="flex flex-col items-center space-y-4" onClick={() => setIsMenuOpen(false)}>
                        <NavLinks />
                    </nav>
                </div>
            )}
        </header>
    );
};