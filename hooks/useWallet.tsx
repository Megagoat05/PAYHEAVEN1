import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { Transaction, Order, Account } from '../types';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  orders: Order[];
  topUp: (amount: number, description: string) => Promise<void>;
  purchase: (account: Account) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, token } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const getStorageKey = (type: 'transactions' | 'orders') => {
    if (!user?.email) return null;
    return `nexus_${user.email}_${type}`;
  };

  const refreshBalance = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch balance');
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshBalance();
      const storedTransactions = localStorage.getItem(getStorageKey('transactions')!);
      const storedOrders = localStorage.getItem(getStorageKey('orders')!);
      setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
      setOrders(storedOrders ? JSON.parse(storedOrders) : []);
    } else {
      setBalance(0);
      setTransactions([]);
      setOrders([]);
    }
  }, [isAuthenticated, user]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const key = getStorageKey('transactions');
    if (!key) return;
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
      timestamp: new Date().toISOString(),
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem(key, JSON.stringify(updatedTransactions));
  };

  const addOrder = (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const key = getStorageKey('orders');
    if (!key) return;
    const newOrder: Order = {
      ...order,
      id: `ORD-${new Date().getTime()}`,
      timestamp: new Date().toISOString(),
      status: 'Delivered',
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(key, JSON.stringify(updatedOrders));
  };

  const topUp = async (amount: number, description: string) => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error('Top-up failed');
      const result = await res.json();
      console.log('✅ Top-up response:', result);
      addTransaction({ type: 'deposit', amount, description });
      await refreshBalance();
    } catch (err) {
      console.error('Top-up error:', err);
    }
  };

  const purchase = async (account: Account) => {
    if (!token || balance < account.price) return;
    try {
      const res = await fetch('http://localhost:5000/wallet/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: account.price }),
      });
      if (!res.ok) throw new Error('Purchase failed');
      addTransaction({
        type: 'purchase',
        amount: -account.price,
        description: `Purchase of ${account.name}`,
      });
      addOrder({ accountName: account.name, price: account.price });
      await refreshBalance();
    } catch (err) {
      console.error('Purchase error:', err);
    }
  };

  const value = {
    balance,
    transactions,
    orders,
    topUp,
    purchase,
    refreshBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
