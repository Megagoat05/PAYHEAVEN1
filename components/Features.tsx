
import React from 'react';
import { ShieldCheckIcon, BoltIcon, CpuChipIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Ironclad Security',
    description: 'Every account is sourced ethically and validated rigorously. We provide all original documentation for your peace of mind.',
  },
  {
    icon: BoltIcon,
    title: 'Instant Delivery',
    description: 'Gain access to your new financial tools instantly. Credentials and guides are sent to your email upon purchase.',
  },
  {
    icon: CpuChipIcon,
    title: 'High-Risk Specialists',
    description: 'We understand the challenges of modern e-commerce and SaaS. Our accounts are robust and prepared for high-volume operations.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: '24/7 Expert Support',
    description: 'Our team is available around the clock via Telegram to assist with any questions or issues you may encounter.',
  },
];

export const Features = () => {
  return (
    <section className="py-20">
      <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
        Why <span className="text-glow-pink">Choose</span> Us?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="glass-card rounded-lg p-6 text-center border-t-2 border-fuchsia-500 hover:border-cyan-400 transition-colors duration-300">
            <div className="flex justify-center mb-4">
              <feature.icon className="h-12 w-12 text-fuchsia-400" />
            </div>
            <h3 className="font-orbitron text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
