import React from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'history' | 'tips' | 'rewards' | 'demo';
  setActiveTab: (tab: 'dashboard' | 'history' | 'tips' | 'rewards' | 'demo') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard' as const, icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'history' as const, icon: 'fa-clock-rotate-left', label: 'History' },
    { id: 'tips' as const, icon: 'fa-leaf', label: 'Actions' },
    { id: 'rewards' as const, icon: 'fa-medal', label: 'Rewards' },
    { id: 'demo' as const, icon: 'fa-video', label: 'Video Demo' },
  ];

  return (
    <>
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 p-6 z-50 shadow-sm">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-100">
            <i className="fa-solid fa-earth-americas text-white text-xl"></i>
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">My carbon footprint</span>
        </div>

        <div className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm shadow-emerald-100'
                  : 'text-slate-500 hover:bg-slate-50 font-medium'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-lg`}></i>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto px-2 py-4">
          <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-1">PRO STATUS</p>
              <p className="text-sm font-bold">Climate Hero</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                Active Impact
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? 'text-emerald-600 scale-110' : 'text-slate-400'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navbar;