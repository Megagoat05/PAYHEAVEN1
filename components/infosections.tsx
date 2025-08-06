
import React, { useState, useEffect } from 'react';
import { UserPlusIcon, BanknotesIcon, ShoppingCartIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const AnimatedCounter = ({ value, duration = 2500 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(easedProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value); // Ensure it ends on the exact value
      }
    };
    const handle = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(handle);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};


const HowToBuy = () => {
    const steps = [
        {
            icon: UserPlusIcon,
            title: 'Register & Log In',
            description: 'You need to register and log in to your account.'
        },
        {
            icon: BanknotesIcon,
            title: 'Deposit Funds',
            description: 'Add money to your account using a suitable payment option.'
        },
        {
            icon: ShoppingCartIcon,
            title: 'Place an Order',
            description: 'Place your orders to buy an account or make a bulk purchase.'
        },
        {
            icon: RocketLaunchIcon,
            title: 'Fast Results',
            description: 'We will notify you and send the account details to your registered email.'
        }
    ];

    return (
        <div>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
                How to <span className="text-glow-pink">Buy</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="glass-card p-6 text-center rounded-lg border-t-2 border-cyan-500 hover:border-fuchsia-500 transition-colors duration-300">
                        <div className="flex justify-center mb-4">
                            <step.icon className="h-12 w-12 text-cyan-400" />
                        </div>
                        <h3 className="font-orbitron text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LiveStats = () => {
    const stats = [
        { label: 'Order Numbers', value: 4762 },
        { label: 'Customers', value: 1230 },
        { label: 'Services', value: 8 },
    ];
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % stats.length);
        }, 4000); // slide every 4 seconds
        return () => clearInterval(timer);
    }, [stats.length]);

    const currentStat = stats[activeIndex];

    return (
        <div className="glass-card py-16 px-8 rounded-xl border-2 border-fuchsia-500/50 neon-pink-shadow">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
                Live <span className="text-glow-blue">Stats</span>
            </h2>
            {/* The outer div provides a fixed height to prevent layout shifts */}
            <div className="relative text-center h-32 flex flex-col justify-center items-center overflow-hidden">
                {/* The key here makes sure AnimatedCounter and its parent div re-render and re-animate */}
                <div key={activeIndex} className="animate-fade-in">
                    <p className="font-orbitron text-5xl md:text-6xl font-black text-cyan-300 text-glow-blue">
                        <AnimatedCounter value={currentStat.value} duration={2000} />+
                    </p>
                    <p className="mt-2 text-slate-300 text-lg font-bold">{currentStat.label}</p>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center space-x-3 mt-8">
                {stats.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-cyan-400 scale-125' : 'bg-slate-600 hover:bg-slate-400'}`}
                        aria-label={`Go to stat ${index + 1}`}
                    ></button>
                ))}
            </div>
            <p className="text-center mt-10 text-slate-400">...and more to come — stay updated!</p>
        </div>
    );
};


const PaymentOptions = () => {
    const crypto = [
        { name: 'USDT', logo: 'https://cdn.worldvectorlogo.com/logos/tether.svg' },
        { name: 'Bitcoin', logo: 'https://cdn.worldvectorlogo.com/logos/bitcoin.svg' },
        { name: 'Ethereum', logo: 'https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg' },
        { name: 'Litecoin', logo: 'https://cdn.worldvectorlogo.com/logos/litecoin.svg' },
        
    ];
    const banks = [
        { name: 'Wise', logo: 'https://cdn.worldvectorlogo.com/logos/wise-1.svg' },
        { name: 'Mercury', logo: 'https://cdn.brandfetch.io/idq7r2w1uM/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667844241556' },
        { name: 'Revolut', logo: 'https://cdn.brandfetch.io/idkTaHd18D/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1697548243776' },
        { name: 'Skrill', logo: 'https://cdn.brandfetch.io/idsdRU0U2Z/theme/dark/idxpJSPvgI.svg?c=1bxid64Mup7aczewSAYMX&t=1690265455045' }
    ];

    const LogoItem = ({ logo, name }: { logo: string, name: string }) => (
        <div className="bg-slate-200/90 p-3 rounded-lg flex items-center justify-center transition-transform hover:scale-110" title={name}>
            <img src={logo} alt={name} className="h-10 w-16 object-contain" />
        </div>
    );

    return (
        <div>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
                Payment <span className="text-glow-pink">Options</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-lg">
                    <h3 className="font-orbitron text-2xl font-bold mb-6 text-center text-glow-blue">✅ Crypto Payments</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {crypto.map(c => <LogoItem key={c.name} {...c} />)}
                    </div>
                </div>
                <div className="glass-card p-6 rounded-lg">
                    <h3 className="font-orbitron text-2xl font-bold mb-6 text-center text-glow-blue">✅ Bank Transfers</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {banks.map(b => <LogoItem key={b.name} {...b} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const InfoSections = () => {
    return (
        <div className="py-20 space-y-24">
            <HowToBuy />
            <LiveStats />
            <PaymentOptions />
        </div>
    );
};