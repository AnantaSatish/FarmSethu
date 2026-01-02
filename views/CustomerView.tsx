
import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShoppingCart, 
  Leaf, 
  Timer,
  Calendar,
  ChevronRight,
  MessageCircle,
  QrCode,
  X,
  CreditCard,
  Wallet,
  CheckCircle2
} from 'lucide-react';

const CustomerView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'subscriptions'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'options' | 'qr' | 'success'>('options');
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  const farmers = [
    { id: 'f1', name: 'Farmer Ramesh', distance: '1.2km', produce: 'Tomatoes, Onions', trust: 4.8, isOrganic: true, image: 'https://picsum.photos/seed/farmer1/200/200' },
    { id: 'f2', name: 'Krishna Village Farm', distance: '2.5km', produce: 'Spinach, Carrots', trust: 4.6, isOrganic: false, image: 'https://picsum.photos/seed/farmer2/200/200' },
    { id: 'f3', name: 'Siva Organic Hub', distance: '3.1km', produce: 'Mangoes, Grapes', trust: 4.9, isOrganic: true, image: 'https://picsum.photos/seed/farmer3/200/200' },
  ];

  const produceItems = [
    { id: 'p1', name: 'Heritage Tomatoes', price: 35, unit: 'kg', farmerId: 'f1', farmer: 'Ramesh', tags: ['Organic', 'Pre-order'], img: 'https://picsum.photos/seed/tomato/300/200' },
    { id: 'p2', name: 'Local Spinach', price: 25, unit: 'bunch', farmerId: 'f2', farmer: 'Krishna', tags: ['Fresh Harvest'], img: 'https://picsum.photos/seed/spinach/300/200' },
    { id: 'p3', name: 'King Mangoes', price: 120, unit: 'kg', farmerId: 'f3', farmer: 'Siva', tags: ['Seasonal', 'Organic'], img: 'https://picsum.photos/seed/mango/300/200' },
  ];

  const handlePayment = () => {
    setPaymentStep('qr');
    setTimeout(() => {
      setPaymentStep('success');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-24 relative">
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
              <h3 className="text-xl font-bold text-emerald-900">Secure Checkout</h3>
              <button onClick={() => { setShowPayment(false); setPaymentStep('options'); }} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {paymentStep === 'options' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm mb-4">Total Amount: <span className="text-emerald-600 font-bold text-lg">₹345.00</span></p>
                  <button onClick={() => setPaymentStep('qr')} className="w-full flex items-center justify-between p-4 border-2 border-emerald-100 rounded-2xl hover:border-emerald-500 transition-all bg-emerald-50/30 group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><QrCode className="text-emerald-600" /></div>
                      <div className="text-left">
                        <p className="font-bold">UPI / Scan & Pay</p>
                        <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-emerald-300 group-hover:text-emerald-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><CreditCard className="text-blue-600" /></div>
                      <div className="text-left">
                        <p className="font-bold">Cards</p>
                        <p className="text-xs text-gray-500">Credit or Debit Cards</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><Wallet className="text-orange-600" /></div>
                      <div className="text-left">
                        <p className="font-bold">Wallets</p>
                        <p className="text-xs text-gray-500">Amazon Pay, Mobikwik</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                </div>
              )}

              {paymentStep === 'qr' && (
                <div className="text-center space-y-6 animate-in slide-in-from-bottom-4">
                  <p className="text-sm font-medium text-gray-600">Scan QR Code to complete payment</p>
                  <div className="bg-white p-4 inline-block border-2 border-emerald-500 rounded-3xl shadow-inner mx-auto relative group">
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl">
                       <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=farmsethu-pay-ref-12345`} alt="Payment QR" />
                    </div>
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={handlePayment} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs">Simulate Success</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 py-2 grayscale opacity-50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" alt="UPI" />
                  </div>
                  <p className="text-[10px] text-gray-400">Waiting for payment confirmation...</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center space-y-4 py-8 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Payment Successful!</h4>
                  <p className="text-gray-500">Order #FS-9921 has been placed. The farmer has been notified to start harvesting.</p>
                  <button onClick={() => setShowPayment(false)} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">
                    Track My Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search produce, farmers..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-emerald-100 rounded-2xl font-bold text-gray-700 hover:bg-emerald-50 transition-colors">
            <Filter size={20} /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">
            <MapPin size={20} /> Near Me
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-emerald-100">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`pb-4 px-2 font-bold text-lg transition-all ${activeTab === 'browse' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-gray-400'}`}
        >
          Fresh Produce
        </button>
        <button 
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-4 px-2 font-bold text-lg transition-all ${activeTab === 'subscriptions' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-gray-400'}`}
        >
          Weekly Baskets
        </button>
      </div>

      {activeTab === 'browse' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {produceItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all group">
                <div className="relative h-48">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-emerald-700 shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">by {item.farmer} <Star className="fill-orange-400 text-orange-400" size={12} /> 4.8</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">₹{item.price}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">per {item.unit}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowPayment(true)}
                      className="flex-grow py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> Buy Now
                    </button>
                    <button className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-colors">
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: Nearby Farmers */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="text-emerald-600" size={20} /> 
              Farmers Nearby (5km)
            </h3>
            <div className="space-y-4">
              {farmers.map((farmer) => (
                <div key={farmer.id} className="bg-white p-4 rounded-3xl shadow-sm border border-emerald-100 flex items-center gap-4 hover:border-emerald-300 cursor-pointer transition-colors group">
                  <div className="relative">
                    <img src={farmer.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm">
                       <QrCode size={12} className="text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-gray-900">{farmer.name}</h5>
                      <span className="text-[10px] font-bold text-emerald-600">{farmer.distance}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                       <button className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-bold flex items-center gap-1 hover:bg-emerald-100">
                         <MessageCircle size={10} /> Message
                       </button>
                       <button className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-md font-bold flex items-center gap-1 hover:bg-gray-100">
                         <QrCode size={10} /> Profile
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-2">Sustainable Choice!</h4>
                <p className="text-emerald-200 text-sm mb-4">By buying locally today, you saved <span className="text-white font-bold">1.2kg of CO₂</span> emissions.</p>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors">View Impact Dashboard</button>
              </div>
              <Leaf className="absolute -bottom-4 -right-4 text-emerald-800 opacity-20 rotate-12" size={100} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center space-y-6">
           <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
             <Calendar size={48} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Custom Subscription Baskets</h2>
             <p className="text-gray-500 max-w-md mx-auto">Get a curated mix of seasonal vegetables and fruits delivered to your doorstep every Tuesday.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <SubscriptionPlan 
                title="Starter Mini" 
                price="₹499" 
                freq="Weekly" 
                items="4-5 Veg + 1 Fruit"
                color="emerald"
              />
              <SubscriptionPlan 
                title="Family Fresh" 
                price="₹1,299" 
                freq="Weekly" 
                items="8-10 Veg + 3 Fruits"
                color="emerald"
                featured
              />
              <SubscriptionPlan 
                title="Seasonal Box" 
                price="₹899" 
                freq="Monthly" 
                items="Local Delicacies"
                color="orange"
              />
           </div>
        </div>
      )}
    </div>
  );
};

const SubscriptionPlan: React.FC<{ title: string; price: string; freq: string; items: string; color: string; featured?: boolean }> = ({ title, price, freq, items, color, featured }) => (
  <div className={`p-6 rounded-3xl border ${featured ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-500/10' : 'border-emerald-100 bg-white'} relative`}>
    {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Best Value</span>}
    <h4 className="font-bold text-xl mb-1">{title}</h4>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-2xl font-bold text-gray-900">{price}</span>
      <span className="text-xs text-gray-400">/{freq}</span>
    </div>
    <ul className="space-y-3 mb-6">
      <li className="text-sm text-gray-600 flex items-center gap-2"><Leaf size={14} className="text-emerald-500" /> {items}</li>
      <li className="text-sm text-gray-600 flex items-center gap-2"><Timer size={14} className="text-emerald-500" /> Guaranteed 12h from farm</li>
      <li className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} className="text-emerald-500" /> Direct Delivery</li>
    </ul>
    <button className={`w-full py-3 rounded-2xl font-bold transition-all ${featured ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50'}`}>
      Choose Plan
    </button>
  </div>
);

export default CustomerView;
