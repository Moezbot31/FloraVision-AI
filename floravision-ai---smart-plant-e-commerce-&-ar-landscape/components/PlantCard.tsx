
import React from 'react';
import { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
  onAddToCart: (plant: Plant) => void;
  onPreview: (plant: Plant) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ 
  plant, 
  onAddToCart, 
  onPreview, 
  isWishlisted, 
  onToggleWishlist 
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden relative">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={plant.imageUrl} 
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onPreview(plant)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 shadow-lg hover:bg-emerald-500 hover:text-white transition-colors"
            title="AR Preview"
          >
            <i className="fas fa-eye" />
          </button>
          <button 
            onClick={() => onToggleWishlist?.(plant.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-700 hover:bg-red-50'
            }`}
            title="Add to Wishlist"
          >
            <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          {plant.category}
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-800 line-clamp-1">{plant.name}</h3>
          <span className="font-bold text-emerald-600 whitespace-nowrap">Rs. {plant.price.toLocaleString()}</span>
        </div>
        <div className="flex gap-2 text-[10px] text-slate-500">
          <span><i className="fas fa-sun mr-1" />{plant.sunlight}</span>
          <span><i className="fas fa-tint mr-1" />{plant.watering}</span>
        </div>
        <button
          onClick={() => onAddToCart(plant)}
          className="w-full mt-2 bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
