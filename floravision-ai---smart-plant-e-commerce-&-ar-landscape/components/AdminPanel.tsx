
import React, { useState, useMemo, useEffect } from 'react';
import { Plant, PlantCategory, UserRole, Order, User } from '../types';

interface AdminPanelProps {
  plants: Plant[];
  userRole: UserRole;
  onAdd: (plant: Plant) => void;
  onRemove: (id: string) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onUpdatePlant: (id: string, updatedData: Partial<Plant>) => void;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-101', date: '2024-05-22', items: ['Monstera'], total: 12500, status: 'Shipped' },
  { id: 'ORD-102', date: '2024-05-23', items: ['Areca Palm'], total: 8500, status: 'Pending' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ plants, userRole, onAdd, onRemove, onUpdateStock, onUpdatePlant }) => {
  const isAdmin = userRole === UserRole.BUSINESS_ADMIN || userRole === UserRole.SUPER_ADMIN;
  const [activeView, setActiveView] = useState<'inventory' | 'orders' | 'staff'>('inventory');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Plant>>({
    name: '',
    price: 0,
    category: PlantCategory.INDOOR,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=400',
    description: '',
    size: 'Medium',
    growthStage: 'Sapling',
    sunlight: 'Bright Indirect',
    watering: 'Moderate',
    soil: 'Loamy'
  });

  useEffect(() => {
    if (editingId) {
      const plant = plants.find(p => p.id === editingId);
      if (plant) { setFormData(plant); setIsAdding(true); }
    } else {
      setFormData({ name: '', price: 0, category: PlantCategory.INDOOR, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=400', description: '', size: 'Medium', growthStage: 'Sapling', sunlight: 'Bright Indirect', watering: 'Moderate', soil: 'Loamy' });
    }
  }, [editingId, plants]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdatePlant(editingId, formData);
    } else {
      onAdd({ ...formData, id: Math.random().toString(36).substr(2, 9), maintenanceLevel: 'Easy', previewCount: 0 } as Plant);
    }
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-1000">
      <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-slate-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 px-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-gauge-high" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Admin Console</h2>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{userRole} Session</p>
          </div>
        </div>

        <nav className="flex bg-slate-100 p-1.5 rounded-[2rem] gap-1 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveView('inventory')} className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase ${activeView === 'inventory' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>Inventory</button>
          <button onClick={() => setActiveView('orders')} className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase ${activeView === 'orders' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>Orders</button>
          {isAdmin && <button onClick={() => setActiveView('staff')} className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase ${activeView === 'staff' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>Personnel</button>}
        </nav>
      </div>

      {activeView === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100">
            <h3 className="text-xl font-black text-slate-800">Master Catalog</h3>
            <button onClick={() => setIsAdding(!isAdding)} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] tracking-widest hover:bg-emerald-700 shadow-lg">
              {isAdding ? 'CANCEL' : 'ADD NEW ASSET'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleFormSubmit} className="bg-white p-10 rounded-[3rem] border-2 border-emerald-500/20 shadow-2xl space-y-8 animate-in zoom-in-95">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Name" className="p-4 bg-slate-50 rounded-2xl font-bold border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="number" required placeholder="Price" className="p-4 bg-slate-50 rounded-2xl font-bold border" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                <select className="p-4 bg-slate-50 rounded-2xl font-bold border" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  {Object.values(PlantCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="number" placeholder="Stock" className="p-4 bg-slate-50 rounded-2xl font-bold border" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                <input className="col-span-2 p-4 bg-slate-50 rounded-2xl font-bold border" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase shadow-xl">
                {editingId ? 'SAVE CHANGES' : 'PUBLISH ASSET'}
              </button>
            </form>
          )}

          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">Entity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase text-right pr-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plants.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-6 font-black text-slate-800">{p.name}</td>
                    <td className="px-8 py-6">
                      <input type="number" value={p.stock} className="w-16 p-2 bg-white rounded-xl text-center font-black border" onChange={(e) => onUpdateStock(p.id, Number(e.target.value))} />
                    </td>
                    <td className="px-8 py-6 font-black text-emerald-600">Rs. {p.price.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right pr-12">
                      <button onClick={() => setEditingId(p.id)} className="text-slate-400 hover:text-emerald-600 mx-2"><i className="fas fa-edit" /></button>
                      <button onClick={() => onRemove(p.id)} className="text-slate-400 hover:text-red-500 mx-2"><i className="fas fa-trash" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'orders' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8">
           <h3 className="text-xl font-black mb-6">Recent Orders</h3>
           <div className="space-y-4">
             {MOCK_ORDERS.map(o => (
               <div key={o.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl">
                 <div><p className="font-black">{o.id}</p><p className="text-xs text-slate-400">{o.date}</p></div>
                 <p className="font-black text-emerald-600">Rs. {o.total.toLocaleString()}</p>
                 <span className="px-4 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase">{o.status}</span>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
