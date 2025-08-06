export interface Account {
  id: string;
  name: string;
  logo: string;
  price: number;
  description: string;
  features: string[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string;
  accountName: string;
  price: number;
  timestamp: string;
  status: 'Pending' | 'Delivered';
}

export interface FaqItem {
  question: string;
  answer: string;
}
