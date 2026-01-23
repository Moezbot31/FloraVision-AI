
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  isAdminMode?: boolean;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, isAdminMode = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let role = UserRole.CUSTOMER;
    if (isAdminMode) {
      if (email.includes('admin')) role = UserRole.BUSINESS_ADMIN;
      else if (email.includes('staff')) role = UserRole.STAFF;
      else { setError("Invalid credentials for staff portal."); return; }
    }
    
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      isSubscribed: true,
      wishlist: [],
      history: []
    });
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className={`bg-white rounded-[3rem] shadow-2xl p-10 border-2 ${isAdminMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-2xl mb-6 ${isAdminMode ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
            <i className={`fas ${isAdminMode ? 'fa-user-shield' : 'fa-user-circle'}`} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isAdminMode ? 'Staff Portal' : 'FloraVision Login'}</h2>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider">{error}</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email Address</label>
            <input type="email" required placeholder="name@email.com" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800" />
          </div>
          <button type="submit" className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${isAdminMode ? 'bg-slate-900' : 'bg-emerald-600'} text-white`}>
            {isAdminMode ? 'AUTHORIZE' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
