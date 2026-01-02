
import React, { useState, useEffect } from 'react';
import { Language, Produce, Farmer, Review } from '../types';
import { dbService } from '../services/dbService';
import { 
  Search, 
  MapPin, 
  Star, 
  ShoppingCart, 
  Leaf, 
  ChevronRight,
  QrCode,
  X,
  CheckCircle2,
  RefreshCcw,
  Info,
  User,
  Quote,
  Calendar,
  Filter,
  Apple,
  Salad,
  LayoutGrid
} from 'lucide-react';

type CategoryFilter = 'All' | 'Fruit' | 'Vegetable';

const CustomerView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [showPayment, setShowPayment] = useState(false);
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
        setProduce(data.filter(p => p.status === 'available'));
      } catch (err) {
        console.error(err);
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
      console.error(err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const filteredProduce = produce.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.nameTe.includes(searchQuery);
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-24 relative">
      
      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left: Product & Visuals */}
            <div className="w-full md:w-1/2 bg-emerald-50/50 p-8 overflow-y-auto custom-scrollbar border-r border-emerald-100">
              <button 
                onClick={() => { setSelectedProduct(null); setSelectedFarmer(null); }}
                className="absolute right-6 top-6 p-2 hover:bg-white rounded-full transition-colors z-10 md:hidden"
              >
                <X size={24} />
              </button>
              
              <div className="space-y-6">
                <div className="aspect-[4/3] bg-emerald-100 rounded-[2rem] relative overflow-hidden shadow-inner">
                   <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                   {selectedProduct.isOrganic && (
                     <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                       <Leaf size={10}/> Organic / సేంద్రియ
                     </div>
                   )}
                </div>

                <div className="space-y-2">
                   <h2 className="text-3xl font-display font-bold text-slate-900">{selectedProduct.name} / {selectedProduct.nameTe}</h2>
                   <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-emerald-600">₹{selectedProduct.price}</span>
                      <span className="text-slate-400 text-sm">/ {selectedProduct.unit}</span>
                   </div>
                   <p className="text-slate-600 leading-relaxed text-sm">
                     {lang === Language.EN ? selectedProduct.description : selectedProduct.descriptionTe}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Harvested / కోత సమయం</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                       <Calendar size={16} className="text-emerald-500" />
                       {selectedProduct.harvestDate}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Available / అందుబాటులో</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                       <RefreshCcw size={16} className="text-emerald-500" />
                       {selectedProduct.quantity} {selectedProduct.unit}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPayment(true)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex flex-col items-center gap-0"
                >
                  <span className="flex items-center gap-2"><ShoppingCart size={20} /> Buy Harvest</span>
                  <span className="text-[10px] opacity-70">ఇప్పుడే కొనండి</span>
                </button>
              </div>
            </div>

            {/* Right: Farmer & Feedback */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar relative">
               <button 
                  onClick={() => { setSelectedProduct(null); setSelectedFarmer(null); }}
                  className="absolute right-6 top-6 p-2 hover:bg-slate-50 rounded-full transition-colors hidden md:block"
                >
                  <X size={24} className="text-slate-400" />
               </button>

               {fetchingDetails ? (
                 <div className="h-full flex flex-col items-center justify-center gap-4">
                    <RefreshCcw size={40} className="animate-spin text-emerald-600" />
                    <p className="font-bold text-emerald-800">Syncing Bio... / వివరాలు పొందుతున్నాము...</p>
                 </div>
               ) : (
                 <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                    {/* Farmer Section */}
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Farmer Profile / రైతు వివరాలు</h3>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-2xl">
                             {selectedFarmer?.name.charAt(0)}
                          </div>
                          <div>
                             <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                               {selectedFarmer?.name} / {selectedFarmer?.nameTe}
                               {selectedFarmer?.idVerified && <CheckCircle2 size={18} className="text-blue-500" />}
                             </h4>
                             <p className="text-sm text-slate-500 flex items-center gap-1">
                                <MapPin size={14} /> {selectedFarmer?.location.villageTe || selectedFarmer?.location.village}, {selectedFarmer?.location.districtTe || selectedFarmer?.location.district}
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                             <Star size={14} className="fill-current" /> {selectedFarmer?.trustScore} Trust / నమ్మకం
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                             <Leaf size={14} /> {selectedFarmer?.farmNameTe || selectedFarmer?.farmName}
                          </div>
                       </div>
                       <p className="text-sm text-slate-600 italic leading-relaxed">
                          {lang === Language.EN ? selectedFarmer?.bio : selectedFarmer?.bioTe}
                       </p>
                    </div>

                    {/* Ratings & Feedback */}
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Consumer Feedback / అభిప్రాయాలు</h3>
                       <div className="space-y-4">
                          {farmerReviews.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                               <p className="text-xs text-slate-400 font-medium italic">No reviews yet for this harvest. / ఈ పంటకు ఇంకా అభిప్రాయాలు లేవు.</p>
                            </div>
                          ) : farmerReviews.map((rev) => (
                            <div key={rev.id} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
                               <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {rev.customerName.charAt(0)}
                                     </div>
                                     <div>
                                        <p className="text-xs font-bold text-slate-900">{rev.customerName}</p>
                                        <p className="text-[10px] text-slate-400">{rev.date}</p>
                                     </div>
                                  </div>
                                  <div className="flex text-yellow-400">
                                     {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={10} className={i < rev.rating ? 'fill-current' : 'text-slate-200'} />
                                     ))}
                                  </div>
                               </div>
                               <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                                  <Quote size={12} className="inline mr-1 text-emerald-300" />
                                  {lang === Language.EN ? rev.comment : rev.commentTe || rev.comment}
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

      {/* Main UI */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-2/5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search produce... / పంట కోసం వెతకండి..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <CategoryTab 
                active={activeCategory === 'All'} 
                label="All" 
                labelTe="అన్నీ" 
                icon={<LayoutGrid size={18}/>} 
                onClick={() => setActiveCategory('All')} 
             />
             <CategoryTab 
                active={activeCategory === 'Fruit'} 
                label="Fruits" 
                labelTe="పండ్లు" 
                icon={<Apple size={18}/>} 
                onClick={() => setActiveCategory('Fruit')} 
             />
             <CategoryTab 
                active={activeCategory === 'Vegetable'} 
                label="Vegetables" 
                labelTe="కూరగాయలు" 
                icon={<Salad size={18}/>} 
                onClick={() => setActiveCategory('Vegetable')} 
             />
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">
           Village Marketplace / గ్రామ సంత
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
             <RefreshCcw className="animate-spin text-emerald-600" size={48} />
             <p className="font-bold text-emerald-800">Loading village inventory... / సరుకు వివరాలు పొందుతున్నాము...</p>
          </div>
        ) : (
          <>
            {filteredProduce.length === 0 ? (
              <div className="p-20 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-emerald-100">
                 <Search size={48} className="mx-auto text-emerald-200" />
                 <p className="text-slate-400 font-medium italic">No matches found. / ఏ ఫలితాలు దొరకలేదు.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
                {filteredProduce.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleOpenDetails(item)}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-emerald-50 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                        <div className="absolute top-4 left-4 flex gap-1">
                          {item.isOrganic && <span className="bg-white/95 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700 shadow-sm">Organic</span>}
                          <span className="bg-emerald-600/95 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">₹{item.price}</span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                           <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold text-slate-600 shadow-sm border border-slate-100">
                             {item.category === 'Fruit' ? 'Fruit / పండు' : 'Vegetable / కూరగాయ'}
                           </span>
                        </div>
                    </div>
                    <div className="p-6 space-y-3">
                        <h4 className="text-xl font-bold text-slate-900 leading-tight">
                          {item.name} <br/> <span className="text-sm font-medium text-emerald-600">{item.nameTe}</span>
                        </h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <User size={12}/> {item.farmerId.split('_').pop()}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                           <span className="text-xs font-bold text-slate-500">{item.quantity} {item.unit} Left</span>
                           <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <ChevronRight size={18}/>
                           </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface CategoryTabProps {
  active: boolean;
  label: string;
  labelTe: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ active, label, labelTe, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm border ${
      active 
      ? 'bg-emerald-600 text-white border-emerald-600 scale-105' 
      : 'bg-white text-slate-600 border-emerald-50 hover:bg-emerald-50'
    }`}
  >
    {icon}
    <div className="flex flex-col items-start leading-none">
       <span className="text-sm">{label}</span>
       <span className="text-[10px] opacity-70">{labelTe}</span>
    </div>
  </button>
);

export default CustomerView;
