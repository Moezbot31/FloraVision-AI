
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MOCK_PLANTS } from './constants';
import { Plant, CartItem, UserRole, User, LandscapeItem } from './types';
import { Shop } from './components/Shop';
import { DiseaseScanner } from './components/DiseaseScanner';
import { AdminPanel } from './components/AdminPanel';
import { LandscapeDesigner } from './components/LandscapeDesigner';
import { Auth } from './components/Auth';

type Tab = 'shop' | 'visualize' | 'doctor' | 'admin' | 'landscape' | 'history' | 'auth' | 'admin-login' | 'onboarding' | 'wishlist';

const STORAGE_KEY = 'floravision_plants_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  
  const [plants, setPlants] = useState<Plant[]>(() => {
    if (typeof window === 'undefined') return MOCK_PLANTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Local storage access failed.");
    }
    return MOCK_PLANTS.map(p => ({ 
      ...p, 
      stock: p.stock ?? 10, 
      maintenanceLevel: p.maintenanceLevel ?? 'Easy', 
      previewCount: p.previewCount ?? Math.floor(Math.random() * 100) 
    }));
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [deliveryMethod] = useState<'pickup' | 'express'>('pickup');
  const [activeDesignItems, setActiveDesignItems] = useState<LandscapeItem[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    if (user) {
      const isManagement = user.role === UserRole.BUSINESS_ADMIN || 
                         user.role === UserRole.SUPER_ADMIN || 
                         user.role === UserRole.STAFF;
      if (isManagement) {
        setActiveTab('admin');
      } else if (activeTab === 'auth' || activeTab === 'admin-login') {
        setActiveTab('shop');
      }
    }
  }, [user]);

  const isManagementUser = useMemo(() => 
    user && (user.role === UserRole.BUSINESS_ADMIN || user.role === UserRole.SUPER_ADMIN || user.role === UserRole.STAFF),
    [user]
  );

  const handleUpdatePlants = useCallback((updater: (prev: Plant[]) => Plant[]) => {
    setPlants(prev => {
      const next = updater(prev);
      const plantIds = new Set(next.map(p => p.id));
      setCart(currentCart => currentCart.filter(item => plantIds.has(item.id)));
      setActiveDesignItems(currentItems => currentItems.filter(item => item.type !== 'plant' || plantIds.has(item.itemId)));
      return next;
    });
  }, []);

  const addToCart = (plant: Plant) => {
    if (plant.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === plant.id);
      if (existing) {
        return prev.map(item => item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...plant, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (id: string) => {
    if (!user) { setActiveTab('auth'); return; }
    const isWished = user.wishlist.includes(id);
    const newWishlist = isWished ? user.wishlist.filter(wId => wId !== id) : [...user.wishlist, id];
    setUser({ ...user, wishlist: newWishlist });
  };

  const total = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal + (deliveryMethod === 'express' ? 1500 : 0);
  }, [cart, deliveryMethod]);

  return (
    <div className="min-h-screen pb-24 lg:pb-0 bg-slate-50/50">
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-100 lg:top-0 lg:bottom-0 lg:w-24 lg:border-r lg:border-t-0 flex lg:flex-col justify-around lg:justify-center items-center py-6">
        {isManagementUser ? (
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'admin' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}
          >
            <i className="fas fa-gauge-high text-2xl" />
            <span className="text-[8px] font-black tracking-widest uppercase">Console</span>
          </button>
        ) : (
          <>
            {[
              { id: 'shop', icon: 'fa-leaf', label: 'GARDEN' },
              { id: 'landscape', icon: 'fa-pencil-ruler', label: 'DESIGN' },
              { id: 'doctor', icon: 'fa-stethoscope', label: 'DOCTOR' },
              { id: 'wishlist', icon: 'fa-heart', label: 'SAVED' },
              { id: 'history', icon: 'fa-truck', label: 'ORDERS' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  if (item.id === 'shop' || item.id === 'landscape') setActiveTab(item.id as Tab);
                  else if (!user) setActiveTab('auth');
                  else setActiveTab(item.id as Tab);
                }} 
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-emerald-600 scale-110' : 'text-slate-300 hover:text-slate-400'}`}
              >
                <i className={`fas ${item.icon} text-2xl`} />
                <span className="text-[8px] font-black tracking-widest">{item.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      <main className="lg:ml-24">
        <header className="px-10 py-8 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-40 border-b border-white/50">
          <div onClick={() => setActiveTab(isManagementUser ? 'admin' : 'shop')} className="cursor-pointer group flex items-center gap-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter group-hover:text-emerald-600 transition-colors">FLORAVISION</h1>
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hidden md:block leading-tight">
              {isManagementUser ? 'Management' : 'Horticulture'}<br/>Platform • PKR
            </p>
          </div>

          <div className="flex items-center gap-6">
             {user ? (
               <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-slate-100">
                 <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-xs">
                   {user.email[0].toUpperCase()}
                 </div>
                 <div className="text-left">
                   <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{user.role}</p>
                   <p className="text-xs font-bold text-slate-800 leading-tight">{user.email}</p>
                 </div>
                 <button onClick={() => { setUser(null); setActiveTab('shop'); }} className="ml-2 text-slate-300 hover:text-red-500 transition-colors">
                   <i className="fas fa-power-off" />
                 </button>
               </div>
             ) : (
               <div className="flex gap-2">
                 <button onClick={() => setActiveTab('auth')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
                   CLIENT LOGIN
                 </button>
                 <button onClick={() => setActiveTab('admin-login')} className="bg-white text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                   STAFF PORTAL
                 </button>
               </div>
             )}
             
             {!isManagementUser && (
               <button onClick={() => setIsCartOpen(true)} className="relative w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                 <i className="fas fa-shopping-bag text-lg" />
                 {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center font-black animate-bounce">{cart.length}</span>}
               </button>
             )}
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {activeTab === 'auth' && <Auth onLogin={setUser} isAdminMode={false} />}
          {activeTab === 'admin-login' && <Auth onLogin={setUser} isAdminMode={true} />}
          
          {isManagementUser && user ? (
             activeTab === 'admin' && (
              <AdminPanel 
                plants={plants} 
                userRole={user.role}
                onAdd={(p) => handleUpdatePlants(prev => [...prev, p])} 
                onRemove={(id) => handleUpdatePlants(prev => prev.filter(p => p.id !== id))} 
                onUpdateStock={(id, stock) => handleUpdatePlants(prev => prev.map(p => p.id === id ? {...p, stock} : p))}
                onUpdatePlant={(id, updatedData) => handleUpdatePlants(prev => prev.map(p => p.id === id ? {...p, ...updatedData} : p))}
              />
            )
          ) : (
            <>
              {(activeTab === 'shop' || activeTab === 'wishlist') && (
                <Shop 
                  plants={activeTab === 'wishlist' && user ? plants.filter(p => user.wishlist.includes(p.id)) : plants} 
                  onAddToCart={addToCart} 
                  onPreview={(p) => {
                    handleUpdatePlants(prev => prev.map(item => item.id === p.id ? {...item, previewCount: (item.previewCount||0)+1} : item));
                    setActiveTab('landscape');
                  }}
                  userWishlist={user?.wishlist || []}
                  onToggleWishlist={toggleWishlist}
                />
              )}
              {activeTab === 'landscape' && (
                <LandscapeDesigner 
                  initialItems={activeDesignItems} 
                  onItemsChange={setActiveDesignItems} 
                  availablePlants={plants} 
                />
              )}
              {activeTab === 'doctor' && <DiseaseScanner />}
            </>
          )}
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-12 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-800">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-6 items-center p-6 bg-slate-50 rounded-[2.5rem]">
                  <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-3xl" />
                  <div className="flex-1">
                    <h4 className="font-black text-lg text-slate-800">{item.name}</h4>
                    <p className="text-xs font-bold text-slate-400">Rs. {item.price.toLocaleString()} • Qty {item.quantity}</p>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500">
                    <i className="fas fa-trash" />
                  </button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest">Cart is empty</p>}
            </div>
            {cart.length > 0 && (
              <div className="mt-10 pt-10 border-t border-slate-100">
                <div className="flex justify-between items-end mb-8">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">Rs. {total.toLocaleString()}</p>
                </div>
                <button onClick={() => { setIsCartOpen(false); if (!user) setActiveTab('auth'); }} className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-700">
                  {user ? 'CHECKOUT NOW' : 'SIGN IN TO CHECKOUT'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
