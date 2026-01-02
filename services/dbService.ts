
import { supabase } from '../supabaseClient';
import { Produce, Order, FactoryExport, UserRole, Farmer, Review } from '../types';

const MOCK_PRODUCE: Produce[] = [
  { 
    id: 'p1', 
    farmerId: 'farmer_001', 
    name: 'Heritage Tomatoes', 
    nameTe: 'నాటు టమోటాలు',
    category: 'Vegetable', 
    quantity: 45, 
    unit: 'kg', 
    price: 35, 
    harvestDate: '2023-10-24', 
    isOrganic: true, 
    status: 'available', 
    description: 'Sun-ripened heritage tomatoes grown with zero chemicals.',
    descriptionTe: 'ఎటువంటి రసాయనాలు లేకుండా పండించిన నాటు టమోటాలు.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p2', 
    farmerId: 'farmer_001', 
    name: 'Local Spinach', 
    nameTe: 'తోటకూర',
    category: 'Vegetable', 
    quantity: 20, 
    unit: 'bunch', 
    price: 15, 
    harvestDate: '2023-10-23', 
    isOrganic: true, 
    status: 'available', 
    description: 'Freshly harvested early morning spinach.',
    descriptionTe: 'ఉదయాన్నే కోసిన తాజా తోటకూర.',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p3', 
    farmerId: 'farmer_002', 
    name: 'Alphonso Mangoes', 
    nameTe: 'మామిడి పండ్లు',
    category: 'Fruit', 
    quantity: 150, 
    unit: 'kg', 
    price: 120, 
    harvestDate: '2023-10-22', 
    isOrganic: false, 
    status: 'available',
    description: 'Sweetest mangoes from our 20-year old orchard.',
    descriptionTe: 'మా తోటలో పండిన తియ్యని మామిడి పండ్లు.',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p4', 
    farmerId: 'farmer_002', 
    name: 'Green Chillies', 
    nameTe: 'పచ్చి మిరపకాయలు',
    category: 'Vegetable', 
    quantity: 50, 
    unit: 'kg', 
    price: 45, 
    harvestDate: '2023-10-21', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119f702e?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p5', 
    farmerId: 'farmer_003', 
    name: 'Basmati Rice', 
    nameTe: 'బాస్మతి బియ్యం',
    category: 'Grain', 
    quantity: 500, 
    unit: 'kg', 
    price: 85, 
    harvestDate: '2023-10-15', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p6', 
    farmerId: 'farmer_003', 
    name: 'Farm Fresh Milk', 
    nameTe: 'తాజా పాలు',
    category: 'Dairy', 
    quantity: 100, 
    unit: 'litre', 
    price: 60, 
    harvestDate: '2023-10-25', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-125581f77833?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p7', 
    farmerId: 'farmer_001', 
    name: 'Lady Finger', 
    nameTe: 'బెండకాయ',
    category: 'Vegetable', 
    quantity: 30, 
    unit: 'kg', 
    price: 40, 
    harvestDate: '2023-10-24', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1449339043519-7d3a95baf5f1?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p8', 
    farmerId: 'farmer_002', 
    name: 'Pomegranate', 
    nameTe: 'దానిమ్మ పండు',
    category: 'Fruit', 
    quantity: 60, 
    unit: 'kg', 
    price: 180, 
    harvestDate: '2023-10-25', 
    isOrganic: true, 
    status: 'available',
    description: 'Juicy ruby red pomegranates directly from the farm.',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p9', 
    farmerId: 'farmer_001', 
    name: 'Papaya', 
    nameTe: 'బొప్పాయి పండు',
    category: 'Fruit', 
    quantity: 40, 
    unit: 'kg', 
    price: 50, 
    harvestDate: '2023-10-24', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1526600329882-675fb8390098?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p10', 
    farmerId: 'farmer_003', 
    name: 'Cauliflower', 
    nameTe: 'క్యాబేజీ',
    category: 'Vegetable', 
    quantity: 100, 
    unit: 'unit', 
    price: 30, 
    harvestDate: '2023-10-25', 
    isOrganic: false, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p11', 
    farmerId: 'farmer_001', 
    name: 'Farm Carrots', 
    nameTe: 'నాటు క్యారెట్లు',
    category: 'Vegetable', 
    quantity: 55, 
    unit: 'kg', 
    price: 45, 
    harvestDate: '2023-10-26', 
    isOrganic: true, 
    status: 'available',
    description: 'Sweet and crunchy soil-grown carrots.',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p12', 
    farmerId: 'farmer_002', 
    name: 'Ripe Bananas', 
    nameTe: 'అరటి పండ్లు',
    category: 'Fruit', 
    quantity: 10, 
    unit: 'dozen', 
    price: 60, 
    harvestDate: '2023-10-26', 
    isOrganic: true, 
    status: 'available',
    description: 'Naturally ripened sweet bananas.',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ad996211fdf4?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p13', 
    farmerId: 'farmer_003', 
    name: 'Red Onions', 
    nameTe: 'ఉల్లిపాయలు',
    category: 'Vegetable', 
    quantity: 200, 
    unit: 'kg', 
    price: 35, 
    harvestDate: '2023-10-20', 
    isOrganic: false, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p14', 
    farmerId: 'farmer_002', 
    name: 'Black Grapes', 
    nameTe: 'నల్ల ద్రాక్ష',
    category: 'Fruit', 
    quantity: 40, 
    unit: 'kg', 
    price: 90, 
    harvestDate: '2023-10-25', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369b41f8f?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p15', 
    farmerId: 'farmer_001', 
    name: 'Bell Peppers', 
    nameTe: 'బెంగళూరు మిరప',
    category: 'Vegetable', 
    quantity: 25, 
    unit: 'kg', 
    price: 75, 
    harvestDate: '2023-10-26', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p16', 
    farmerId: 'farmer_002', 
    name: 'Organic Guava', 
    nameTe: 'జామ పండు',
    category: 'Fruit', 
    quantity: 35, 
    unit: 'kg', 
    price: 40, 
    harvestDate: '2023-10-26', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1536592248552-6a8470438100?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p17', 
    farmerId: 'farmer_001', 
    name: 'Fresh Brinjal', 
    nameTe: 'వంకాయ',
    category: 'Vegetable', 
    quantity: 40, 
    unit: 'kg', 
    price: 25, 
    harvestDate: '2023-10-26', 
    isOrganic: true, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p18', 
    farmerId: 'farmer_002', 
    name: 'Sweet Watermelon', 
    nameTe: 'పుచ్చకాయ',
    category: 'Fruit', 
    quantity: 80, 
    unit: 'kg', 
    price: 20, 
    harvestDate: '2023-10-24', 
    isOrganic: false, 
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=400'
  }
];

const MOCK_FARMERS: Record<string, Farmer> = {
  'farmer_001': {
    id: 'farmer_001',
    name: 'Rajesh Kumar',
    nameTe: 'రాజేష్ కుమార్',
    role: UserRole.FARMER,
    location: { lat: 12.9716, lng: 77.5946, address: 'Kuppam', village: 'Kuppam', villageTe: 'కుప్పం', district: 'Chittoor', districtTe: 'చిత్తూరు', state: 'AP' },
    trustScore: 4.8,
    farmName: 'Rajesh Organic Farms',
    farmNameTe: 'రాజేష్ ఆర్గానిక్ ఫామ్స్',
    isOrganic: true,
    fertilizerCredits: 1200,
    wasteReducedKg: 450,
    co2SavedKg: 675,
    compostGeneratedKg: 135,
    idVerified: true,
    bio: 'Dedicated to chemical-free farming since 2005.',
    bioTe: '2005 నుండి రసాయన రహిత వ్యవసాయానికి అంకితమయ్యారు.'
  },
  'farmer_002': {
    id: 'farmer_002',
    name: 'Srinivas Murthy',
    nameTe: 'శ్రీనివాస్ మూర్తి',
    role: UserRole.FARMER,
    location: { lat: 13.0827, lng: 80.2707, address: 'V.Kota', village: 'V.Kota', villageTe: 'వి.కోట', district: 'Chittoor', districtTe: 'చిత్తూరు', state: 'AP' },
    trustScore: 4.5,
    farmName: 'Murthy Mango Orchard',
    farmNameTe: 'మూర్తి మామిడి తోట',
    isOrganic: false,
    fertilizerCredits: 450,
    wasteReducedKg: 200,
    co2SavedKg: 300,
    compostGeneratedKg: 60,
    idVerified: true
  },
  'farmer_003': {
    id: 'farmer_003',
    name: 'Murali Krishnan',
    nameTe: 'మురళి కృష్ణన్',
    role: UserRole.FARMER,
    location: { lat: 13.1, lng: 77.8, address: 'Baireddipalle', village: 'Baireddipalle', villageTe: 'బైరెడ్డిపల్లె', district: 'Chittoor', districtTe: 'చిత్తూరు', state: 'AP' },
    trustScore: 4.2,
    farmName: 'Krishna Dairy & Grains',
    farmNameTe: 'కృష్ణ డైరీ & గ్రెయిన్స్',
    isOrganic: true,
    fertilizerCredits: 800,
    wasteReducedKg: 120,
    co2SavedKg: 180,
    compostGeneratedKg: 36,
    idVerified: true
  }
};

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', farmerId: 'farmer_001', customerId: 'c1', customerName: 'Anjali P.', rating: 5, comment: 'Best quality tomatoes in the village!', commentTe: 'గ్రామంలోనే అత్యుత్తమ నాణ్యమైన టమోటాలు!', date: '2023-10-15' },
  { id: 'r2', farmerId: 'farmer_001', customerId: 'c2', customerName: 'Vikas R.', rating: 4, comment: 'Always fresh and on time.', commentTe: 'ఎప్పుడూ తాజాగా మరియు సరైన సమయానికి అందుతాయి.', date: '2023-10-10' }
];

export const dbService = {
  async getProduce(farmerId?: string): Promise<Produce[]> {
    if (!supabase) return farmerId ? MOCK_PRODUCE.filter(p => p.farmerId === farmerId) : MOCK_PRODUCE;
    const query = supabase.from('produce').select('*');
    if (farmerId) query.eq('farmerId', farmerId);
    const { data } = await query;
    return (data as Produce[]) || MOCK_PRODUCE;
  },

  async getFarmerProfile(farmerId: string): Promise<Farmer | null> {
    if (!supabase) return MOCK_FARMERS[farmerId] || null;
    const { data } = await supabase.from('users').select('*').eq('id', farmerId).single();
    return (data as Farmer) || MOCK_FARMERS[farmerId];
  },

  async getFarmerReviews(farmerId: string): Promise<Review[]> {
    if (!supabase) return MOCK_REVIEWS.filter(r => r.farmerId === farmerId);
    const { data } = await supabase.from('reviews').select('*').eq('farmerId', farmerId);
    return (data as Review[]) || MOCK_REVIEWS.filter(r => r.farmerId === farmerId);
  },

  async updateProduceStatus(id: string, status: Produce['status']) {
    if (!supabase) return;
    await supabase.from('produce').update({ status }).eq('id', id);
  },

  async createFactoryExport(payload: any) {
    if (!supabase) return payload;
    const { data } = await supabase.from('factory_exports').insert([payload]).select();
    return data?.[0];
  },

  async getFactoryExports(farmerId: string): Promise<FactoryExport[]> {
    if (!supabase) return [];
    const { data } = await supabase.from('factory_exports').select('*').eq('farmerId', farmerId);
    return (data as FactoryExport[]) || [];
  },

  async placeOrder(order: Partial<Order>) {
    if (!supabase) return order;
    const { data } = await supabase.from('orders').insert([order]).select();
    return data?.[0];
  }
};
