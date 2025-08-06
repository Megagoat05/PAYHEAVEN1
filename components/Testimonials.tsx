
import React from 'react';

const testimonials = [
  {
    name: 'Alex T.',
    role: 'SaaS Founder',
    quote: 'PAYHEAVEN was a lifesaver. We got a verified Stripe account in minutes after weeks of struggling with verification. Highly recommend.',
    img: 'https://picsum.photos/id/1005/100/100',
  },
  {
    name: 'Jasmine K.',
    role: 'E-commerce Entrepreneur',
    quote: 'My PayPal account was limited, and it was killing my business. The aged account I bought here has been stable for months. Flawless service.',
    img: 'https://picsum.photos/id/1011/100/100',
  },
  {
    name: 'Devin R.',
    role: 'High-Risk Operator',
    quote: 'Finding reliable payment infrastructure is the hardest part of my industry. These guys are the real deal. Professional, discreet, and effective.',
    img: 'https://picsum.photos/id/1027/100/100',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20">
      <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
        From the <span className="text-glow-blue">Community</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="glass-card rounded-lg p-6 flex flex-col items-center text-center">
            <img src={testimonial.img} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 border-2 border-cyan-400" />
            <p className="text-slate-300 flex-grow">"{testimonial.quote}"</p>
            <div className="mt-4">
              <h3 className="font-bold text-lg text-fuchsia-400">{testimonial.name}</h3>
              <p className="text-sm text-slate-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
