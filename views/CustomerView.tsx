
import React, { useState, useEffect } from 'react';
import { Language, Produce, Farmer, Review } from '../types';
import { dbService } from '../services/dbService';
import { 
  Search, 
  MapPin, 
  Star, 
  ShoppingCart, 
  Leaf, 
  Timer,
  ChevronRight,
  QrCode,
  X,
  CheckCircle2,
  RefreshCcw,
  Info,
  User,
  Quote,
  Calendar
} from 'lucide-react';

const CustomerView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'subscriptions'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'options' | 'qr' | 'success'>('options');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal States
  const [selectedProduct, setSelectedProduct] = useState<Produce | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [farmerReviews, setFarmerReviews] = useState<Review[]>([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);
        const data = await dbService.getProduce();
        // Filter only available items
        setProduce(data.filter(p => p.status === 'available'));
      } catch (err) {
        console.error("Backend fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  const handleOpenDetails = async (item: Produce) => {
    setSelectedProduct(item);
    setFetchingDetails(true);
    try {
      const [farmer, reviews] = await Promise.all([
        dbService.getFarmerProfile(item.farmerId),
        dbService.getFarmerReviews(item.farmerId)
      ]);
      setSelectedFarmer(farmer);
      setFarmerReviews(reviews);
    } catch (err) {
      console.error("Error fetching farmer details", err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handlePayment = async () => {
    setPaymentStep('qr');
    // Simulation of backend payment confirmation
    setTimeout(async () => {
      try {
        // Place real order in backend
        await dbService.placeOrder({
          customerId: 'demo_customer_001',
          total: selectedProduct ? selectedProduct.price : 345,
          status: 'pending',
          orderType: 'one-time'
        });
        setPaymentStep('success');
      } catch (err) {
        alert("Order placement failed in backend.");
      }
    }, 2000);
  };

  const filteredProduce = produce.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-24 relative">
      
      {/* Product Details & Farmer Feedback Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left: Product Info */}
            <div className="w-full md:w-1/2 bg-emerald-50/50 p-8 overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => { setSelectedProduct(null); setSelectedFarmer(null); }}
                className="absolute right-6 top-6 p-2 hover:bg-white rounded-full transition-colors z-10 md:hidden"
              >
                <X size={24} />
              </button>
              
              <div className="space-y-6">
                <div className="aspect-square bg-emerald-100 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                   <Leaf size={120} className="text-emerald-300 opacity-50" />
                   {selectedProduct.isOrganic && (
                     <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Organic</div>
                   )}
                </div>

                <div className="space-y-2">
                   <h2 className="text-3xl font-display font-bold text-slate-900">{selectedProduct.name}</h2>
                   <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-600">₹{selectedProduct.price}</span>
                      <span className="text-slate-400 text-sm">/ {selectedProduct.unit}</span>
                   </div>
                   <p className="text-slate-600 leading-relaxed text-sm">
                     {selectedProduct.description || "Fresh from the farm. Harvested at peak ripeness to ensure maximum flavor and nutrition for your family."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Harvest Date</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                       <Calendar size={16} className="text-emerald-500" />
                       {selectedProduct.harvestDate}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Available Qty</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                       <RefreshCcw size={16} className="text-emerald-500" />
                       {selectedProduct.quantity} {selectedProduct.unit}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPayment(true)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} /> Buy This Harvest
                </button>
              </div>
            </div>

            {/* Right: Farmer Profile & Reviews */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar relative">
               <button 
                  onClick={() => { setSelectedProduct(null); setSelectedFarmer(null); }}
                  className="absolute right-6 top-6 p-2 hover:bg-slate-50 rounded-full transition-colors hidden md:block"
                >
                  <X size={24} className="text-slate-400" />
               </button>

               {fetchingDetails ? (
                 <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-600">
                    <RefreshCcw size={40} className="animate-spin" />
                    <p className="font-bold">Loading Farmer Bio...</p>
                 </div>
               ) : (
                 <div className="space-y-8">
                    {/* Farmer Identity */}
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">About the Farmer</h3>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-2xl">
                             {selectedFarmer?.name.charAt(0)}
                          </div>
                          <div>
                             <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                               {selectedFarmer?.name} 
                               {selectedFarmer?.idVerified && <CheckCircle2 size={18} className="text-blue-500" />}
                             </h4>
                             <p className="text-sm text-slate-500 flex items-center gap-1">
                                <MapPin size={14} /> {selectedFarmer?.location.village}, {selectedFarmer?.location.district}
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                             <Star size={14} className="fill-current" /> {selectedFarmer?.trustScore} Trust Score
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                             <Leaf size={14} /> {selectedFarmer?.farmName}
                          </div>
                       </div>
                       <p className="text-sm text-slate-600 italic">
                          {selectedFarmer?.bio || "Passionate about providing fresh, healthy produce to our local village community. Every harvest is grown with care."}
                       </p>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Customer Feedback</h3>
                       <div className="space-y-4">
                          {farmerReviews.length === 0 ? (
                            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                               <p className="text-xs text-slate-400">Be the first to leave a review for this farmer!</p>
                            </div>
                          ) : farmerReviews.map((rev) => (
                            <div key={rev.id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2 shadow-sm">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <p className="text-sm font-bold text-slate-900">{rev.customerName}</p>
                                     <p className="text-[10px] text-slate-400">{rev.date}</p>
                                  </div>
                                  <div className="flex text-yellow-400">
                                     {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={12} className={i < rev.rating ? 'fill-current' : 'text-slate-200'} />
                                     ))}
                                  </div>
                               </div>
                               <p className="text-xs text-slate-600 leading-relaxed">
                                  <Quote size={12} className="inline mr-1 text-emerald-300" />
                                  {rev.comment}
                               </p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
              <h3 className="text-xl font-bold text-emerald-900">Secure Backend Checkout</h3>
              <button onClick={() => { setShowPayment(false); setPaymentStep('options'); }} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {paymentStep === 'options' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm mb-4">Total Amount: <span className="text-emerald-600 font-bold text-lg">₹{selectedProduct?.price || 345}.00</span></p>
                  <button onClick={() => handlePayment()} className="w-full flex items-center justify-between p-4 border-2 border-emerald-100 rounded-2xl hover:border-emerald-500 transition-all bg-emerald-50/30 group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><QrCode className="text-emerald-600" /></div>
                      <div className="text-left">
                        <p className="font-bold">UPI / Scan & Pay</p>
                        <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-emerald-300 group-hover:text-emerald-600" />
                  </button>
                </div>
              )}

              {paymentStep === 'qr' && (
                <div className="text-center space-y-6 animate-in slide-in-from-bottom-4">
                  <RefreshCcw className="animate-spin mx-auto text-emerald-600" size={32} />
                  <p className="text-sm font-medium text-gray-600">Syncing with Backend...</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center space-y-4 py-8 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">Order Placed in Cloud!</h4>
                  <p className="text-gray-500">The farmer has been notified and the transaction is recorded on our backend.</p>
                  <button onClick={() => { setShowPayment(false); setSelectedProduct(null); }} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">
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
            placeholder="Search live marketplace..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-emerald-100">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`pb-4 px-2 font-bold text-lg transition-all ${activeTab === 'browse' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-gray-400'}`}
        >
          Live Cloud Marketplace
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-emerald-600 gap-4">
          <RefreshCcw className="animate-spin" size={48} />
          <p className="font-bold">Syncing fresh harvests...</p>
        </div>
      ) : activeTab === 'browse' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProduce.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400">No available harvests found in our cloud registry.</div>
          ) : filteredProduce.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenDetails(item)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative h-48 bg-emerald-50 flex items-center justify-center">
                <Leaf className="text-emerald-200 w-24 h-24 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  {item.isOrganic && (
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-emerald-700 shadow-sm">Organic</span>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-xl text-emerald-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                   <Info size={16} />
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Unit: {item.unit}</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <User size={12} className="text-emerald-500" /> Farmer ID: {item.farmerId.split('_').pop()}
                </div>
                <button 
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  View Details & Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CustomerView;
