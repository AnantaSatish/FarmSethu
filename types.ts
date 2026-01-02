
export enum UserRole {
  FARMER = 'FARMER',
  AGENT = 'AGENT',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum Language {
  EN = 'English',
  TE = 'తెలుగు'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  trustScore: number;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface FactoryExport {
  id: string;
  produceName: string;
  weight: number;
  factoryName: string;
  status: 'Scheduled' | 'In-Transit' | 'Processed';
  creditsEarned: number;
}

export interface Farmer extends User {
  farmName: string;
  isOrganic: boolean;
  fertilizerCredits: number;
  wasteReducedKg: number;
  idVerified: boolean;
}

export interface Produce {
  id: string;
  farmerId: string;
  name: string;
  category: 'Fruit' | 'Vegetable' | 'Grain';
  quantity: number;
  unit: string;
  price: number;
  harvestDate: string;
  isOrganic: boolean;
  status: 'available' | 'sold_out' | 'unsold';
}

export interface Order {
  id: string;
  customerId: string;
  farmerId: string;
  items: { produceId: string; quantity: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderType: 'one-time' | 'subscription';
  createdAt: string;
  paymentStatus: 'unpaid' | 'paid';
}
