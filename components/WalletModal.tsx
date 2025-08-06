import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import QRCode from 'react-qr-code';

interface WalletModalProps {
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const handleCryptoTopUp = async () => {
    if (parseFloat(amount) < 100) {
      alert("Minimum deposit is $100");
      return;
    }

    if (!user?.email) {
      alert("You must be logged in to top up.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/nowpayments/create-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            email: user.email,
            currency: "usdttrc20",
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.address) {
        setPaymentDetails(data);
      } else {
        alert(data?.error || "Failed to create payment. Please try again.");
      }
    } catch (err) {
      console.error("Crypto payment error:", err);
      alert("Error starting crypto payment.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="glass-card rounded-lg w-full max-w-lg m-4 border-2 border-cyan-500 neon-blue-shadow relative">

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-8">
          <h2 className="font-orbitron text-3xl font-bold text-center mb-6 text-glow-blue">
            Top Up Wallet
          </h2>

          {!paymentDetails ? (
            <>
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                <h3 className="font-bold text-xl text-fuchsia-400 mb-2">Crypto Top-Up (Automated)</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    min="100"
                  />
                  <button
                    onClick={handleCryptoTopUp}
                    disabled={loading}
                    className="bg-fuchsia-500 text-white font-bold py-3 px-6 rounded-md hover:bg-fuchsia-600 transition disabled:bg-slate-600"
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 text-center">
                <h3 className="font-bold text-xl text-cyan-400 mb-4">Send Payment</h3>

                <QRCode value={paymentDetails.address} size={180} className="mx-auto mb-4" />

                <p className="mb-2">Amount: <strong>{paymentDetails.amountToSend} {paymentDetails.currency}</strong></p>
                <p className="break-all mb-2">Address: {paymentDetails.address}</p>
                <button
                  onClick={() => copyToClipboard(paymentDetails.address)}
                  className="bg-cyan-400 px-4 py-2 rounded text-black font-bold mb-4"
                >
                  Copy Address
                </button>

                {/* New fields added here */}
                <p className="text-sm text-slate-400">Invoice ID: <span className="text-white font-mono">{paymentDetails.paymentId}</span></p>
                <p className="text-sm text-yellow-400 mt-1">Status: Pending</p>

                <a
                  href={paymentDetails.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                  Open Payment Page
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
