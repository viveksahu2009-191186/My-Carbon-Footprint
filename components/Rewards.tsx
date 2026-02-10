import React from 'react';
import { Badge, UserStats } from '../types';

interface RewardsProps {
  badges: Badge[];
  stats: UserStats;
}

const Rewards: React.FC<RewardsProps> = ({ badges, stats }) => {
  const unlockedCount = badges.filter(b => b.unlockedAt).length;
  const progressPercent = Math.round((unlockedCount / badges.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">Your Trophy Room</h3>
            <p className="text-slate-500 font-medium">Level up your climate impact through consistent action.</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">STREAK</p>
                <div className="flex items-center gap-1 text-2xl font-black text-orange-500">
                   <i className="fa-solid fa-fire"></i>
                   {stats.streak}
                </div>
             </div>
             <div className="w-[1px] h-10 bg-slate-100"></div>
             <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">COLLECTION</p>
                <div className="flex items-center gap-1 text-2xl font-black text-emerald-500">
                   <i className="fa-solid fa-award"></i>
                   {progressPercent}%
                </div>
             </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-50 rounded-2xl p-1 h-3 w-full overflow-hidden">
           <div 
             className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-sm" 
             style={{ width: `${progressPercent}%` }}
           ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`relative group bg-white p-6 rounded-3xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-4 ${
              badge.unlockedAt 
                ? 'border-emerald-100 shadow-lg shadow-emerald-50' 
                : 'border-slate-50 opacity-40 grayscale blur-[1px] scale-95 hover:grayscale-0 hover:blur-0 hover:scale-100 hover:opacity-100'
            }`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-inner ${
              badge.unlockedAt ? badge.color : 'bg-slate-100 text-slate-400'
            }`}>
              <i className={`fa-solid ${badge.icon}`}></i>
            </div>
            
            <div>
              <h4 className="font-black text-slate-800 text-sm mb-1">{badge.name}</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-tight">{badge.description}</p>
            </div>

            {badge.unlockedAt && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg border-4 border-white">
                <i className="fa-solid fa-check"></i>
              </div>
            )}

            {!badge.unlockedAt && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <i className="fa-solid fa-lock text-slate-300 text-lg opacity-20"></i>
               </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <div className="bg-indigo-500/20 w-fit px-4 py-1 rounded-full text-xs font-black tracking-widest text-indigo-300 mb-4 border border-indigo-500/30">
              HALL OF FAME
            </div>
            <h3 className="text-3xl font-black mb-4">You're a Digital Pioneer</h3>
            <p className="text-slate-400 max-w-md mb-8 leading-relaxed font-medium">
              By logging your cloud storage and streaming habits, you've joined the top 5% of users addressing <b>Hidden Carbon</b>. Your data-minimalist approach is inspiring!
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-xl">
               Share Profile
               <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </button>
         </div>
         
         <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12 pointer-events-none">
            <i className="fa-solid fa-chart-line text-[200px]"></i>
         </div>
      </div>
    </div>
  );
};

export default Rewards;