
import React, { useState, useMemo } from 'react';
import { Plant, PlantCategory } from '../types';
import { PlantCard } from './PlantCard';

interface ShopProps {
  plants: Plant[];
  onAddToCart: (plant: Plant) => void;
  onPreview: (plant: Plant) => void;
  userWishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ plants, onAddToCart, onPreview, userWishlist, onToggleWishlist }) => {
  const [activeCategory, setActiveCategory] = useState<PlantCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const filteredPlants = useMemo(() => {
    return plants.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [plants, activeCategory, searchQuery]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search flora by name..." 
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] overflow-x-auto no-scrollbar max-w-full">
          {['All', ...Object.values(PlantCategory)].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-8 py-2.5 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600 uppercase'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredPlants.length} Varieties Found</span>
        <div className="h-[1px] flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {filteredPlants.map(p => (
          <div key={p.id} onClick={() => setSelectedPlant(p)} className="cursor-pointer">
            <PlantCard 
              plant={p} 
              onAddToCart={(plant) => onAddToCart(plant)} 
              onPreview={onPreview}
              isWishlisted={userWishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}
      </div>

      {selectedPlant && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setSelectedPlant(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
            <div className="md:w-1/2 h-[400px] md:h-auto">
              <img src={selectedPlant.imageUrl} className="w-full h-full object-cover" alt={selectedPlant.name} />
            </div>
            <div className="md:w-1/2 p-12 space-y-8 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-2">{selectedPlant.category}</p>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{selectedPlant.name}</h2>
                </div>
                <button onClick={() => setSelectedPlant(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-times" />
                </button>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">Rs. {selectedPlant.price.toLocaleString()}</span>
                <span className="text-slate-400 text-sm font-bold pb-1 line-through">Rs. {(selectedPlant.price * 1.2).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-3xl text-center">
                  <i className="fas fa-sun text-amber-500 mb-2" />
                  <p className="text-[10px] font-black uppercase text-slate-400">Sunlight</p>
                  <p className="text-xs font-bold text-slate-800">{selectedPlant.sunlight}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl text-center">
                  <i className="fas fa-tint text-blue-500 mb-2" />
                  <p className="text-[10px] font-black uppercase text-slate-400">Water</p>
                  <p className="text-xs font-bold text-slate-800">{selectedPlant.watering}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl text-center">
                  <i className="fas fa-mountain text-emerald-500 mb-2" />
                  <p className="text-[10px] font-black uppercase text-slate-400">Soil</p>
                  <p className="text-xs font-bold text-slate-800">{selectedPlant.soil}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Growth Info</h4>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Size: {selectedPlant.size}</span>
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">Care: {selectedPlant.maintenanceLevel}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedPlant.description}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => { onAddToCart(selectedPlant); setSelectedPlant(null); }}
                  className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
