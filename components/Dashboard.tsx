import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { AccountGrid } from './AccountGrid';
import { Account, Order } from '../types';
import { ClockIcon, CubeTransparentIcon, CreditCardIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const TABS = ['Order History', 'New Order', 'Add Funds', 'Refunds'];

const OrderHistory = () => {
    const { orders } = useWallet();
    return (
        <div className="glass-card p-6 rounded-lg">
             <h3 className="font-orbitron text-2xl font-bold mb-4 text-glow-blue">Order History</h3>
            {orders.length === 0 ? (
                <p>You have not made any purchases yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-2">Order ID</th>
                                <th className="p-2">Item</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: Order) => (
                                <tr key={order.id} className="border-b border-white/20">
                                    <td className="p-2 font-mono text-xs">{order.id}</td>
                                    <td className="p-2">{order.accountName}</td>
                                    <td className="p-2">${order.price}</td>
                                    <td className="p-2">{new Date(order.timestamp).toLocaleDateString()}</td>
                                    <td className="p-2">
                                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-bold">{order.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AddFunds = () => {
    const { topUp } = useWallet();
    const [amount, setAmount] = useState('100');
    const [loading, setLoading] = useState(false);
    
    const handleTopUp = () => {
        setLoading(true);
        setTimeout(() => {
            topUp(parseFloat(amount), 'Crypto Deposit (Simulated)');
            setLoading(false);
            alert(`$${amount} added to your wallet!`);
        }, 1500);
    };

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-lg">
                <h3 className="font-orbitron text-xl font-bold mb-2 text-fuchsia-400">Crypto Top-Up (Automated)</h3>
                <p className="text-sm text-slate-400 mb-4">Pay with BTC, ETH, USDT. Balance credited instantly.</p>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                        min="10"
                    />
                    <button onClick={handleTopUp} disabled={loading} className="bg-fuchsia-500 text-white font-bold py-3 px-6 rounded-md hover:bg-fuchsia-600 transition-colors neon-pink-shadow whitespace-nowrap disabled:bg-slate-600">
                        {loading ? "Processing..." : "Pay"}
                    </button>
                </div>
            </div>
            <div className="glass-card p-6 rounded-lg">
                <h3 className="font-orbitron text-xl font-bold mb-2 text-cyan-400">Manual Top-Up</h3>
                <p className="text-sm text-slate-400 mb-4">For bank transfers, contact support on Telegram with your email and proof of payment.</p>
                <a href="#" className="mt-4 inline-block bg-cyan-400 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-300">Contact Support</a>
            </div>
        </div>
    );
}

const Refunds = () => (
    <div className="glass-card p-6 rounded-lg text-center">
        <h3 className="font-orbitron text-2xl font-bold mb-4 text-glow-blue">Refund Status</h3>
        <p className="text-slate-400">No active refund requests. Please contact support to initiate a refund for an eligible order.</p>
    </div>
);


export const Dashboard = ({ onBuyNow }: { onBuyNow: (account: Account) => void; }) => {
    const [activeTab, setActiveTab] = useState('Order History');

    return (
        <div>
            <h1 className="font-orbitron text-4xl font-bold mb-8 text-glow-pink">User Dashboard</h1>
            <div className="flex space-x-2 md:space-x-4 border-b border-white/10 mb-8 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-bold text-sm md:text-base py-3 px-2 md:px-4 whitespace-nowrap transition-colors duration-300 ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'Order History' && <OrderHistory />}
                {activeTab === 'New Order' && <AccountGrid onBuyNow={onBuyNow} />}
                {activeTab === 'Add Funds' && <AddFunds />}
                {activeTab === 'Refunds' && <Refunds />}
            </div>
        </div>
    );
};