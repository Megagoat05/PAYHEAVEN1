import React from 'react';
import { AccountCard } from './AccountCard';
import { ACCOUNTS } from '../constants';
import { Account } from '../types';

interface AccountGridProps {
  onBuyNow: (account: Account) => void;
}

export const AccountGrid: React.FC<AccountGridProps> = ({ onBuyNow }) => {
  return (
    <section id="accounts" className="py-20">
      <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
        <span className="text-glow-blue">Available</span> Account 
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {ACCOUNTS.map((account) => (
          <AccountCard key={account.id} account={account} onBuyNow={() => onBuyNow(account)} />
        ))}
      </div>
    </section>
  );
};