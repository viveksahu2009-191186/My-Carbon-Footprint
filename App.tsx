import React, { useState, useEffect, useMemo } from 'react';
import { ActivityLog, ActivityCategory, Recommendation, UserStats, Badge, Goal } from './types';
import { analyzeActivity, getRecommendations, getDailyNudge } from './geminiService';
import Dashboard from './components/Dashboard';
import ActivityLogger from './components/ActivityLogger';
import History from './components/History';
import RecommendationsList from './components/RecommendationsList';
import Navbar from './components/Navbar';
import Rewards from './components/Rewards';
import VideoDemo from './components/VideoDemo';

const INITIAL_BADGES: Badge[] = [
  { id: 'first_log', name: 'Seedling', description: 'Log your first activity', icon: 'fa-seedling', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'streak_3', name: 'Consistent Habit', description: 'Maintain a 3-day logging streak', icon: 'fa-fire', color: 'bg-orange-100 text-orange-600' },
  { id: 'low_carbon_day', name: 'Carbon Slasher', description: 'Keep daily emissions below 5kg', icon: 'fa-scythe', color: 'bg-blue-100 text-blue-600' },
  { id: 'digital_hero', name: 'Data Minimalist', description: 'Log 5 digital reduction activities', icon: 'fa-microchip', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'water_saver', name: 'Rainmaker', description: 'Reduce water-related emissions 3 times', icon: 'fa-droplet', color: 'bg-cyan-100 text-cyan-600' },
];

const App: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('carbon_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeGoal, setActiveGoal] = useState<Goal | null>(() => {
    const saved = localStorage.getItem('carbon_goal');
    return saved ? JSON.parse(saved) : { targetKgPerDay: 10, startDate: Date.now() };
  });
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('carbon_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [nudge, setNudge] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'tips' | 'rewards' | 'demo'>('dashboard');

  useEffect(() => {
    localStorage.setItem('carbon_logs', JSON.stringify(logs));
    localStorage.setItem('carbon_badges', JSON.stringify(badges));
    localStorage.setItem('carbon_goal', JSON.stringify(activeGoal));
  }, [logs, badges, activeGoal]);

  useEffect(() => {
    const fetchData = async () => {
      if (logs.length > 0) {
        const [tips, dailyNudge] = await Promise.all([
          getRecommendations(logs),
          getDailyNudge(logs)
        ]);
        setRecommendations(tips);
        setNudge(dailyNudge);
      } else {
        setNudge("Start logging to receive personalized AI nudges!");
      }
    };
    fetchData();
  }, [logs.length]);

  const stats = useMemo<UserStats>(() => {
    const breakdown: Record<ActivityCategory, number> = {
      [ActivityCategory.TRANSPORTATION]: 0,
      [ActivityCategory.FOOD]: 0,
      [ActivityCategory.ELECTRICITY]: 0,
      [ActivityCategory.COOKING_FUEL]: 0,
      [ActivityCategory.WATER]: 0,
      [ActivityCategory.DIGITAL]: 0,
      [ActivityCategory.WASTE]: 0,
      [ActivityCategory.OTHER]: 0,
    };

    logs.forEach(log => {
      const cat = log.category as ActivityCategory;
      if (breakdown[cat] !== undefined) breakdown[cat] += log.emissionKg;
      else breakdown[ActivityCategory.OTHER] += log.emissionKg;
    });

    let currentStreak = 0;
    if (logs.length > 0) {
      const dates = Array.from(new Set(logs.map(l => new Date(l.timestamp).toDateString())));
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (dates.includes(today) || dates.includes(yesterday)) {
        let checkDate = dates.includes(today) ? new Date() : new Date(Date.now() - 86400000);
        while (dates.includes(checkDate.toDateString())) {
          currentStreak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        }
      }
    }

    const total = logs.reduce((acc, curr) => acc + curr.emissionKg, 0);
    const firstLogTime = logs.length > 0 ? logs[logs.length - 1].timestamp : Date.now();
    const daysSinceStart = Math.max(1, Math.ceil((Date.now() - firstLogTime) / (1000 * 60 * 60 * 24)));
    
    return {
      totalEmissionKg: total,
      categoryBreakdown: breakdown,
      dailyAverageKg: total / daysSinceStart,
      streak: currentStreak,
      activeGoal,
      badges
    };
  }, [logs, activeGoal, badges]);

  const checkAchievements = (updatedLogs: ActivityLog[]) => {
    setBadges(prev => prev.map(badge => {
      if (badge.unlockedAt) return badge;
      let unlocked = false;
      if (badge.id === 'first_log' && updatedLogs.length >= 1) unlocked = true;
      if (badge.id === 'streak_3' && stats.streak >= 3) unlocked = true;
      if (badge.id === 'digital_hero' && updatedLogs.filter(l => l.category === ActivityCategory.DIGITAL).length >= 5) unlocked = true;
      if (badge.id === 'water_saver' && updatedLogs.filter(l => l.category === ActivityCategory.WATER).length >= 3) unlocked = true;
      return unlocked ? { ...badge, unlockedAt: Date.now() } : badge;
    }));
  };

  const handleAddActivity = async (description: string) => {
    setLoading(true);
    try {
      const result = await analyzeActivity(description);
      const newLog: ActivityLog = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        description,
        emissionKg: result.emissionKg || 0,
        category: (result.category as ActivityCategory) || ActivityCategory.OTHER,
        aiExplanation: result.aiExplanation || "Calculation performed by AI model."
      };
      setLogs(prev => {
        const updated = [newLog, ...prev];
        checkAchievements(updated);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const updateGoal = (target: number) => {
    setActiveGoal({ targetKgPerDay: target, startDate: Date.now() });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 transition-all bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 tab-transition">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">My carbon footprint</h1>
            <p className="text-slate-500 font-medium">Empowering your sustainable daily choices.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-sm border border-orange-200">
               <i className="fa-solid fa-fire animate-pulse"></i>
               {stats.streak}
             </div>
             <div className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-sm border border-emerald-200">
               <i className="fa-solid fa-award"></i>
               {stats.badges.filter(b => b.unlockedAt).length}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ActivityLogger onAdd={handleAddActivity} isLoading={loading} />
                
                {nudge && (
                  <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
                     <div className="relative z-10 flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shrink-0">
                          <i className="fa-solid fa-comment-dots text-lg"></i>
                        </div>
                        <p className="font-medium text-base italic leading-snug">
                          "{nudge}"
                        </p>
                     </div>
                  </div>
                )}

                <div className="mt-8">
                  <Dashboard stats={stats} onUpdateGoal={updateGoal} />
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <History logs={logs} onDelete={deleteLog} />
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <RecommendationsList recommendations={recommendations} />
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Rewards badges={badges} stats={stats} />
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <VideoDemo />
              </div>
            )}
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg shadow-emerald-200 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-2">My Target</h3>
              <p className="text-emerald-50/80 text-sm mb-6">
                Goal: {stats.activeGoal?.targetKgPerDay}kg/day
              </p>
              
              <div className="relative h-44 w-44 mx-auto mb-6">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="72" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <circle cx="88" cy="88" r="72" fill="transparent" stroke="white" strokeWidth="10" 
                      strokeDasharray={452.16} 
                      strokeDashoffset={452.16 * (1 - Math.min(1, stats.dailyAverageKg / (stats.activeGoal?.targetKgPerDay || 10)))}
                      className="transition-all duration-700"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black">{Math.round((stats.dailyAverageKg / (stats.activeGoal?.targetKgPerDay || 10)) * 100)}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Intensity</span>
                 </div>
              </div>

              <div className="flex justify-between text-xs font-bold bg-white/10 p-3 rounded-2xl">
                <span>Avg: {stats.dailyAverageKg.toFixed(1)}kg</span>
                <span>Max: {stats.activeGoal?.targetKgPerDay}kg</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                 Badges
                 <button onClick={() => setActiveTab('rewards')} className="text-emerald-500 text-xs font-black">ALL</button>
               </h3>
               <div className="space-y-3">
                 {badges.filter(b => b.unlockedAt).slice(0, 3).map(badge => (
                   <div key={badge.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className={`${badge.color} w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-sm`}>
                        <i className={`fa-solid ${badge.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 leading-none">{badge.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(badge.unlockedAt!).toLocaleDateString()}</p>
                      </div>
                   </div>
                 ))}
                 {badges.filter(b => b.unlockedAt).length === 0 && (
                   <p className="text-slate-400 text-xs text-center py-4">Start logging!</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;