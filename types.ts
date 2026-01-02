
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
  nameTe?: string;
  role: UserRole;
  location: {
    lat: number;
    lng: number;
    address: string;
    village?: string;
    villageTe?: string;
    district?: string;
    districtTe?: string;
    state?: string;
    pincode?: string;
  };
  trustScore: number;
  avatar?: string;
}

export interface Review {
  id: string;
  farmerId: string;
  customerId: string;
  customerName: string;
  customerNameTe?: string;
  rating: number;
  comment: string;
  commentTe?: string;
  date: string;
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
  farmerId: string;
  produceName: string;
  produceNameTe?: string;
  weight: number;
  factoryName: string;
  status: 'Scheduled' | 'In-Transit' | 'Processed';
  creditsEarned: number;
  category: 'Fertilizer' | 'Bio-Fuel' | 'Animal Feed';
  pickupDate: string;
  co2OffsetKg: number;
  compostYieldKg: number;
}

export interface Farmer extends User {
  farmName: string;
  farmNameTe?: string;
  isOrganic: boolean;
  fertilizerCredits: number;
  wasteReducedKg: number;
  co2SavedKg: number;
  compostGeneratedKg: number;
  idVerified: boolean;
  bio?: string;
  bioTe?: string;
}

export interface Produce {
  id: string;
  farmerId: string;
  name: string;
  nameTe: string;
  category: 'Fruit' | 'Vegetable' | 'Grain' | 'Dairy';
  quantity: number;
  unit: string;
  price: number;
  harvestDate: string;
  isOrganic: boolean;
  status: 'available' | 'sold_out' | 'unsold' | 'spoiled';
  description?: string;
  descriptionTe?: string;
  imageUrl?: string;
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
