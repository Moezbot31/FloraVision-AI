
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CameraView } from './CameraView';
import { GARDEN_TOOLS } from '../constants';
import { LandscapeItem, Plant, Tool } from '../types';
import { getSmartLandscapeAdvice } from '../services/geminiService';

interface LandscapeDesignerProps {
  initialItems?: LandscapeItem[];
  onItemsChange?: (items: LandscapeItem[]) => void;
  availablePlants: Plant[];
}

export const LandscapeDesigner: React.FC<LandscapeDesignerProps> = ({ 
  initialItems = [], 
  onItemsChange,
  availablePlants
}) => {
  const [items, setItems] = useState<LandscapeItem[]>(initialItems);
  const [designMode, setDesignMode] = useState<'static' | 'live'>('static');
  const [selectedItemId, setSelectedItemId] = useState<string>(availablePlants[0]?.id || '');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiTip, setAiTip] = useState<string>("Composition Balance: Start your design.");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onItemsChange?.(items);
    if (items.length > 0) {
      const timer = setTimeout(async () => {
        const types = items.map(i => getItemData(i.itemId)?.name || 'Plant');
        const tip = await getSmartLandscapeAdvice(items.length, types);
        setAiTip(tip);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [items]);

  const getItemData = (itemId: string) => {
    return [...availablePlants, ...GARDEN_TOOLS].find(x => x.id === itemId);
  };

  const addItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (designMode === 'static' && !uploadedImage && !e.shiftKey) return;
    if (!selectedItemId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newItem: LandscapeItem = {
      instanceId: Math.random().toString(36).substr(2, 9),
      itemId: selectedItemId,
      type: 'plant',
      x, y, rotation: 0, scale: 1
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex bg-slate-100 p-1.5 rounded-[2rem]">
          <button onClick={() => setDesignMode('static')} className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase ${designMode === 'static' ? 'bg-white shadow-md' : 'text-slate-400'}`}>Static</button>
          <button onClick={() => setDesignMode('live')} className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase ${designMode === 'live' ? 'bg-white shadow-md' : 'text-slate-400'}`}>Live AR</button>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase">Upload Site Image</button>
        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => setUploadedImage(re.target?.result as string);
            reader.readAsDataURL(file);
            setDesignMode('static');
          }
        }} />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 relative h-[70vh] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl bg-slate-100">
          <div ref={containerRef} onClick={addItem} className="w-full h-full relative cursor-crosshair">
            {designMode === 'live' ? (
              <CameraView isActive={true} overlayContent={<div className="absolute inset-0 pointer-events-none"><ItemsOverlay items={items} getItemData={getItemData} onRemove={(id) => setItems(prev => prev.filter(i => i.instanceId !== id))} /></div>} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200/50 relative">
                {uploadedImage && <img src={uploadedImage} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 pointer-events-none"><ItemsOverlay items={items} getItemData={getItemData} onRemove={(id) => setItems(prev => prev.filter(i => i.instanceId !== id))} /></div>
              </div>
            )}
          </div>
          <div className="absolute top-8 right-8 glass-card p-6 rounded-[2.5rem] shadow-2xl max-w-xs">
            <p className="text-[10px] font-black uppercase text-slate-700 mb-1">AI Recommendation</p>
            <p className="text-xs font-bold italic">"{aiTip}"</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border shadow-sm flex flex-col">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6">Select Asset</h4>
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
            {availablePlants.map(p => (
              <button key={p.id} onClick={() => setSelectedItemId(p.id)} className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${selectedItemId === p.id ? 'bg-emerald-50 border-emerald-500' : 'border-transparent bg-slate-50'}`}>
                <img src={p.imageUrl} className="w-10 h-10 object-cover rounded-lg" />
                <span className="text-[10px] font-black uppercase">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemsOverlay = ({ items, getItemData, onRemove }: any) => (
  <>
    {items.map((item: LandscapeItem) => {
      const data = getItemData(item.itemId);
      return (
        <div key={item.instanceId} className="absolute pointer-events-auto group" style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -100%)', zIndex: Math.floor(item.y) }}>
          <img src={data?.imageUrl} className="w-32 h-44 object-contain drop-shadow-2xl" />
          <button onClick={(e) => { e.stopPropagation(); onRemove(item.instanceId); }} className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white p-2 rounded-full text-[8px] opacity-0 group-hover:opacity-100 transition-all">
            <i className="fas fa-trash" />
          </button>
        </div>
      );
    })}
  </>
);

export default LandscapeDesigner;
