import React from 'react';
import { Account } from '../types';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';

interface AccountCardProps {
  account: Account;
  onBuyNow: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onBuyNow }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="group perspective-1000">
      <div className="glass-card rounded-lg p-6 transition-transform duration-500 transform-style-3d group-hover:rotate-y-6 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex justify-center items-center h-20 mb-4">
              <img src={account.logo} alt={`${account.name} logo`} className="max-h-12 max-w-full" style={{ filter: 'grayscale(30%) brightness(1.5)' }}/>
          </div>
          <h3 className="font-orbitron text-2xl font-bold text-center text-slate-100">{account.name}</h3>
          <p className="text-sm text-center text-slate-400 mt-2 mb-4 h-12">{account.description}</p>
          
          <ul className="space-y-2 text-sm mb-6">
            {account.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-cyan-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <div className="text-center text-3xl font-orbitron font-bold text-cyan-300 mb-4">{formatPrice(account.price)}</div>
          <button
            onClick={onBuyNow}
            className="w-full bg-fuchsia-500 text-white font-bold py-3 rounded-md hover:bg-fuchsia-600 transition-all duration-300 neon-pink-shadow transform hover:scale-105"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
