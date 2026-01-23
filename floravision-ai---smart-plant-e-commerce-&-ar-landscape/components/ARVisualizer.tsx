
import React, { useState, useRef, useMemo } from 'react';
import { CameraView } from './CameraView';
import { MOCK_PLANTS } from '../constants';
import { Plant } from '../types';

interface PlacedPlant extends Plant {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  id_instance: number;
}

type ViewMode = 'blueprint' | 'spatial';

export const ARVisualizer: React.FC = () => {
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('spatial');
  const [selectedPlant, setSelectedPlant] = useState<Plant>(MOCK_PLANTS[0]);
  const [uploadedBg, setUploadedBg] = useState<string | null>(null);
  const [activeInstance, setActiveInstance] = useState<number | null>(null);
  const [savedPreviews, setSavedPreviews] = useState<{id: string, name: string, items: PlacedPlant[]}[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        setUploadedBg(re.target?.result as string);
        setViewMode('blueprint');
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlantToScene = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (viewMode === 'blueprint' && !uploadedBg && !e.shiftKey) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newInstance: PlacedPlant = {
      ...selectedPlant,
      x,
      y,
      scale: 1,
      rotation: 0,
      id_instance: Date.now(),
    };
    setPlacedPlants([...placedPlants, newInstance]);
    setActiveInstance(newInstance.id_instance);
  };

  const updatePlant = (id: number, type: 'scale' | 'rotate', delta: number) => {
    setPlacedPlants(prev => prev.map(p => {
      if (p.id_instance !== id) return p;
      if (type === 'scale') return { ...p, scale: Math.max(0.2, p.scale + delta) };
      return { ...p, rotation: p.rotation + delta };
    }));
  };

  const saveProject = () => {
    const name = prompt("Project Name:", `Design ${savedPreviews.length + 1}`);
    if (name) {
      setSavedPreviews([...savedPreviews, { id: Date.now().toString(), name, items: [...placedPlants] }]);
    }
  };

  const removePlant = (id: number) => {
    setPlacedPlants(prev => prev.filter(p => p.id_instance !== id));
    if (activeInstance === id) setActiveInstance(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      {/* Control Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[3rem] shadow-xl border border-slate-100 gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-slate-100 p-1.5 rounded-[2rem] flex">
            <button 
              onClick={() => setViewMode('blueprint')}
              className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all ${viewMode === 'blueprint' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              BLUEPRINT MODE
            </button>
            <button 
              onClick={() => setViewMode('spatial')}
              className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all ${viewMode === 'spatial' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              SPATIAL REALITY
            </button>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />

          <div className="flex gap-2">
            {MOCK_PLANTS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlant(p)}
                className={`w-12 h-12 rounded-xl border-2 transition-all p-1 bg-white ${selectedPlant.id === p.id ? 'border-emerald-500 scale-110 shadow-lg' : 'border-slate-100 opacity-40'}`}
              >
                <img src={p.imageUrl} className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-emerald-600 transition-all uppercase"
          >
            Upload Photo
          </button>
          <button 
            onClick={saveProject}
            className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-black text-[10px] tracking-widest hover:bg-emerald-200 transition-all uppercase"
          >
            Save Preview
          </button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Canvas Area */}
        <div 
          ref={containerRef}
          onClick={addPlantToScene}
          className="lg:col-span-3 relative h-[65vh] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl bg-slate-200 group"
        >
          {viewMode === 'spatial' ? (
            <CameraView 
              isActive={true} 
              overlayContent={
                <div className="absolute inset-0 pointer-events-none">
                  <SceneOverlay items={placedPlants} activeId={activeInstance} onUpdate={updatePlant} onRemove={removePlant} onSelect={setActiveInstance} />
                </div>
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              {uploadedBg ? (
                <img src={uploadedBg} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center opacity-30">
                  <i className="fas fa-image text-6xl mb-4" />
                  <p className="font-black text-sm uppercase tracking-widest">Upload your room photo to start</p>
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none">
                <SceneOverlay items={placedPlants} activeId={activeInstance} onUpdate={updatePlant} onRemove={removePlant} onSelect={setActiveInstance} />
              </div>
            </div>
          )}

          {/* HUD Feedback */}
          <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none">
            <div className="glass-card px-6 py-3 rounded-full border border-white/50 shadow-xl flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">
                {viewMode === 'spatial' ? 'Live AR Environment' : 'Blueprint Calibration'}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fas fa-layer-group text-emerald-500" />
              Project Assets
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar min-h-[200px]">
              {placedPlants.length === 0 ? (
                <div className="text-center py-10 opacity-20">
                  <p className="text-[10px] font-black uppercase tracking-tighter">No plants placed yet</p>
                </div>
              ) : (
                placedPlants.map(p => (
                  <div 
                    key={p.id_instance}
                    onMouseEnter={() => setActiveInstance(p.id_instance)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${activeInstance === p.id_instance ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-[11px] font-black text-slate-800 uppercase">{p.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Scale: {p.scale.toFixed(1)}x</p>
                      </div>
                    </div>
                    <button onClick={() => removePlant(p.id_instance)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <i className="fas fa-trash-alt text-xs" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saved Scenarios</h4>
               <div className="space-y-2">
                 {savedPreviews.map(proj => (
                    <button 
                      key={proj.id} 
                      onClick={() => setPlacedPlants(proj.items)}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[10px] font-black uppercase flex justify-between items-center group"
                    >
                      {proj.name}
                      <i className="fas fa-chevron-right opacity-0 group-hover:opacity-100" />
                    </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SceneOverlayProps {
  items: PlacedPlant[];
  activeId: number | null;
  onUpdate: (id: number, type: 'scale' | 'rotate', delta: number) => void;
  onRemove: (id: number) => void;
  onSelect: (id: number) => void;
}

const SceneOverlay: React.FC<SceneOverlayProps> = ({ items, activeId, onUpdate, onRemove, onSelect }) => {
  return (
    <>
      {items.map((p) => (
        <div
          key={p.id_instance}
          className="absolute pointer-events-auto group/asset"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `translate(-50%, -100%) scale(${p.scale}) rotate(${p.rotation}deg)`,
            zIndex: Math.floor(p.y),
          }}
          onMouseDown={() => onSelect(p.id_instance)}
        >
          <div className="relative">
            <img 
              src={p.imageUrl} 
              alt={p.name} 
              className={`w-48 h-64 object-contain transition-all duration-500 ${activeId === p.id_instance ? 'brightness-110 drop-shadow-2xl' : 'brightness-100'}`}
              style={{ 
                mixBlendMode: 'multiply',
                filter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 68%, transparent 100%)',
              }}
            />
            {/* Environmental Projection Shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-black/30 blur-2xl rounded-full scale-y-[0.2] -z-10 mix-blend-multiply" />
          </div>
          
          {/* Active Controls */}
          <div className={`absolute -top-16 left-1/2 -translate-x-1/2 flex bg-slate-900/90 backdrop-blur-md text-white rounded-2xl p-1.5 gap-3 border border-white/20 px-5 shadow-2xl transition-all ${activeId === p.id_instance ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <button onMouseDown={(e) => { e.stopPropagation(); onUpdate(p.id_instance, 'scale', 0.1); }} className="hover:text-emerald-400"><i className="fas fa-plus" /></button>
            <button onMouseDown={(e) => { e.stopPropagation(); onUpdate(p.id_instance, 'scale', -0.1); }} className="hover:text-emerald-400"><i className="fas fa-minus" /></button>
            <div className="w-[1px] bg-white/20 mx-1" />
            <button onMouseDown={(e) => { e.stopPropagation(); onUpdate(p.id_instance, 'rotate', 15); }} className="hover:text-emerald-400"><i className="fas fa-redo" /></button>
            <button onMouseDown={(e) => { e.stopPropagation(); onRemove(p.id_instance); }} className="hover:text-red-400 ml-1"><i className="fas fa-times" /></button>
          </div>
        </div>
      ))}
    </>
  );
};
