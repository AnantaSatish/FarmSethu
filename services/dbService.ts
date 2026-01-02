
import { supabase } from '../supabaseClient';
import { Produce, Order, FactoryExport, UserRole, Farmer, Review } from '../types';

// Realistic mock data for fallback
const MOCK_PRODUCE: Produce[] = [
  { id: 'p1', farmerId: 'farmer_rajesh_001', name: 'Heritage Tomatoes', category: 'Vegetable', quantity: 45, unit: 'kg', price: 35, harvestDate: '2023-10-24', isOrganic: true, status: 'available', description: 'Sun-ripened heritage tomatoes grown with zero chemical pesticides. Rich in flavor and antioxidants.' },
  { id: 'p2', farmerId: 'farmer_rajesh_001', name: 'Local Spinach', category: 'Vegetable', quantity: 20, unit: 'bunch', price: 25, harvestDate: '2023-10-23', isOrganic: true, status: 'available', description: 'Freshly harvested early morning spinach. Extremely tender and nutrient-dense.' },
  { id: 'p3', farmerId: 'farmer_rajesh_002', name: 'Alphonso Mangoes', category: 'Fruit', quantity: 150, unit: 'kg', price: 120, harvestDate: '2023-10-22', isOrganic: false, status: 'available', description: 'The king of mangoes from our 20-year old orchard. Naturally ripened.' },
];

const MOCK_FARMER_REVIEWS: Review[] = [
  { id: 'r1', farmerId: 'farmer_rajesh_001', customerId: 'c1', customerName: 'Anjali P.', rating: 5, comment: 'The tomatoes were amazingly fresh! You can really taste the difference from store-bought.', date: '2023-10-15' },
  { id: 'r2', farmerId: 'farmer_rajesh_001', customerId: 'c2', customerName: 'Vikram S.', rating: 4, comment: 'Great quality spinach, very clean. Will order again.', date: '2023-10-12' },
  { id: 'r3', farmerId: 'farmer_rajesh_002', customerId: 'c3', customerName: 'Suresh K.', rating: 5, comment: 'Sweetest mangoes this season. Highly recommended!', date: '2023-10-18' },
];

const MOCK_FARMER_PROFILES: Record<string, Farmer> = {
  'farmer_rajesh_001': {
    id: 'farmer_rajesh_001',
    name: 'Rajesh Kumar',
    role: UserRole.FARMER,
    location: { lat: 12.9716, lng: 77.5946, address: 'Kuppam Village', village: 'Kuppam', district: 'Chittoor', state: 'Andhra Pradesh' },
    trustScore: 4.8,
    farmName: 'Rajesh Organic Farms',
    isOrganic: true,
    fertilizerCredits: 120,
    wasteReducedKg: 450,
    idVerified: true,
    bio: 'Farming is my passion for 15 years. I specialize in traditional organic varieties that are healthy for the community.'
  },
  'farmer_rajesh_002': {
    id: 'farmer_rajesh_002',
    name: 'Srinivas Murthy',
    role: UserRole.FARMER,
    location: { lat: 13.0827, lng: 80.2707, address: 'V.Kota', village: 'V.Kota', district: 'Chittoor', state: 'Andhra Pradesh' },
    trustScore: 4.5,
    farmName: 'Murthy Orchard',
    isOrganic: false,
    fertilizerCredits: 45,
    wasteReducedKg: 200,
    idVerified: true,
    bio: 'We focus on high-quality fruit orchards. Our alphonso mangoes are famous in the district.'
  }
};

const MOCK_EXPORTS: FactoryExport[] = [
  { id: 'ex1', produceName: 'Expired Spinach', weight: 12, factoryName: 'BioFuel Hub', status: 'Processed', creditsEarned: 30 },
];

export const dbService = {
  // Produce operations
  async getProduce(farmerId?: string): Promise<Produce[]> {
    if (!supabase) {
      return farmerId ? MOCK_PRODUCE.filter(p => p.farmerId === farmerId) : MOCK_PRODUCE;
    }
    
    let query = supabase.from('produce').select('*');
    if (farmerId) {
      query = query.eq('farmerId', farmerId);
    }
    const { data, error } = await query.order('harvestDate', { ascending: false });
    if (error) return MOCK_PRODUCE;
    return data as Produce[];
  },

  async getFarmerProfile(farmerId: string): Promise<Farmer | null> {
    if (!supabase) {
      return MOCK_FARMER_PROFILES[farmerId] || null;
    }
    const { data, error } = await supabase.from('users').select('*').eq('id', farmerId).single();
    if (error) return MOCK_FARMER_PROFILES[farmerId] || null;
    return data as Farmer;
  },

  async getFarmerReviews(farmerId: string): Promise<Review[]> {
    if (!supabase) {
      return MOCK_FARMER_REVIEWS.filter(r => r.farmerId === farmerId);
    }
    const { data, error } = await supabase.from('reviews').select('*').eq('farmerId', farmerId).order('date', { ascending: false });
    if (error) return MOCK_FARMER_REVIEWS.filter(r => r.farmerId === farmerId);
    return data as Review[];
  },

  async addProduce(produce: Partial<Produce>): Promise<Produce> {
    if (!supabase) return { ...produce, id: Math.random().toString() } as Produce;
    const { data, error } = await supabase.from('produce').insert([produce]).select();
    if (error) throw error;
    return data[0] as Produce;
  },

  async updateProduceStatus(id: string, status: Produce['status']): Promise<Produce> {
    if (!supabase) return { id, status } as any;
    const { data, error } = await supabase.from('produce').update({ status }).eq('id', id).select();
    if (error) throw error;
    return data[0] as Produce;
  },

  // Factory Export operations
  async getFactoryExports(farmerId: string): Promise<FactoryExport[]> {
    if (!supabase) return MOCK_EXPORTS;
    const { data, error } = await supabase
      .from('factory_exports')
      .select('*')
      .eq('farmerId', farmerId)
      .order('id', { ascending: false });
    if (error) return MOCK_EXPORTS;
    return data as FactoryExport[];
  },

  async createFactoryExport(payload: Partial<FactoryExport>): Promise<FactoryExport> {
    if (!supabase) return { ...payload, id: Math.random().toString() } as FactoryExport;
    const { data, error } = await supabase.from('factory_exports').insert([payload]).select();
    if (error) throw error;
    return data[0] as FactoryExport;
  },

  // User & Farmer Profiles
  async getFarmers() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', UserRole.FARMER);
    if (error) throw error;
    return data;
  },

  // Orders
  async placeOrder(order: Partial<Order>): Promise<Order> {
    if (!supabase) return { ...order, id: Math.random().toString(), createdAt: new Date().toISOString() } as Order;
    const { data, error } = await supabase.from('orders').insert([order]).select();
    if (error) throw error;
    return data[0] as Order;
  }
};
