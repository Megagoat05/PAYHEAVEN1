
import { Account } from './types';

export const ACCOUNTS: Account[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    price: 600,
    description: 'Fully verified US/UK Stripe account with $2K+ processed, 0% disputes, and some with instant payout. Ready to accept payments.',
    features: ['Business Verified', 'ID & Doc Verified', 'Bank Account Attached (MERCURY for USA & WISE for UK and other countries)'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg',
    price: 299,
    description: 'Aged PayPal business account with limits removed. Perfect for e-commerce.',
    features: ['Business Verified', 'Limits Removed', 'Aged 1+ Year'],
  },
  {
    id: 'shopify',
    name: 'Shopify Payments',
    logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
    price: 599,
    description: 'Shopify Payments Active Store with $2K+ processed & 1-year premium domain. Skip approvals, sell instantly.',
    features: ['Payments Enabled', 'Aged Store', 'Premium Theme'],
  },
  {
    id: 'wise',
    name: 'Wise',
    logo: 'https://cdn.worldvectorlogo.com/logos/wise-1.svg',
    price: 299,
    description: 'Verified Wise Business account for seamless international transfers.',
    features: ['Business Verified', 'Multi-currency Wallet ( GBP , EUR , USD , AED )', 'Debit Card Included'],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    logo: 'https://cdn.brandfetch.io/idq7r2w1uM/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1668075158084',
    price: 649,
    description: 'US-based Mercury bank account for tech startups and online businesses (5k$ processed).',
    features: ['US LLC Included', 'Checking & Savings', 'Virtual Cards'],
  },
  {
    id: 'revolut',
    name: 'Revolut',
    logo: 'https://cdn.brandfetch.io/idkTaHd18D/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1697548243776',
    price: 399,
    description: 'Revolut Business account for modern, global financial operations.',
    features: ['UK/EU Based', 'FX at Interbank Rate', 'Corporate Cards'],
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    logo: 'https://cdn.brandfetch.io/idVmyDyyyZ/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1668070644552',
    price: 249,
    description: 'Payoneer Checkout Account Fully ready with Hong Kong business entity & webstore domain paid for 1 year. Meets Payoneer’s $20K/month eligibility.',
    features: ['Global Payment Service', 'USD/EUR/GBP Accounts', 'Low Fees'],
  },
  {
    id: 'binance',
    name: 'Binance',
    logo: 'https://cdn.worldvectorlogo.com/logos/binance.svg',
    price: 600,
    description: 'Fully verified corporate Binance account for high-volume crypto trading.',
    features: ['Corporate Level 2', 'High Withdrawal Limits', 'API Keys Enabled'],
  },
];
