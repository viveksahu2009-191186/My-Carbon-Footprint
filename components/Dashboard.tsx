import React, { useState } from 'react';
import { UserStats, ActivityCategory } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardProps { 
  stats: UserStats;
  onUpdateGoal: (target: number) => void;
}

const COLORS = {
  [ActivityCategory.TRANSPORTATION]: '#10b981',
  [ActivityCategory.FOOD]: '#f59e0b',
  [ActivityCategory.ELECTRICITY]: '#3b82f6',
  [ActivityCategory.COOKING_FUEL]: '#ef4444',
  [ActivityCategory.WATER]: '#06b6d4',
  [ActivityCategory.DIGITAL]: '#8b5cf6',
  [ActivityCategory.WASTE]: '#64748b',
  [ActivityCategory.OTHER]: '#d1d5db',
};

const Dashboard: React.FC<DashboardProps> = ({ stats, onUpdateGoal }) => {
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [newTarget, setNewTarget] = useState(stats.activeGoal?.targetKgPerDay.toString() || '10');

  const breakdownEntries = Object.entries(stats.categoryBreakdown) as [ActivityCategory, number][];

  const pieData = breakdownEntries
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key,
      value: value
    }));

  const barData = breakdownEntries.map(([key, value]) => ({
    name: key,
    amount: value
  }));

  const handleGoalSubmit = () => {
    const val = parseFloat(newTarget);
    if (!isNaN(val) && val > 0) {
      onUpdateGoal(val);
      setShowGoalEditor(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Daily Average</p>
              <h4 className="text-4xl font-black text-slate-800 mt-1 leading-none">
                {stats.dailyAverageKg.toFixed(1)} <span className="text-lg text-slate-400 font-bold">kg</span>
              </h4>
            </div>
            <button 
              onClick={() => setShowGoalEditor(!showGoalEditor)}
              className="bg-slate-50 text-slate-400 p-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-500 transition-all"
            >
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>
          
          {showGoalEditor ? (
            <div className="mt-4 flex gap-2">
              <input 
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={handleGoalSubmit} className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-sm font-bold">Save</button>
            </div>
          ) : (
            <div className={`mt-4 flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold ${
              stats.dailyAverageKg <= (stats.activeGoal?.targetKgPerDay || 10) 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-red-600 bg-red-50'
            }`}>
              <i className={`fa-solid ${stats.dailyAverageKg <= (stats.activeGoal?.targetKgPerDay || 10) ? 'fa-check-circle' : 'fa-triangle-exclamation'} mr-2`}></i>
              {stats.dailyAverageKg <= (stats.activeGoal?.targetKgPerDay || 10) ? 'On Track' : 'Over Target'}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Lifetime Offset Progress</p>
            <h4 className="text-4xl font-black text-slate-800 mt-1 leading-none">
              {(stats.totalEmissionKg / 1000).toFixed(2)} <span className="text-lg text-slate-400 font-bold">tons</span>
            </h4>
          </div>
          <div className="mt-4 flex items-center text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full text-xs font-bold">
            <i className="fa-solid fa-tree mr-2"></i>
            Equivalent to {Math.floor(stats.totalEmissionKg / 20)} trees planted
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[350px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-emerald-500"></i>
            Footprint Share
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ActivityCategory]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Legend 
                  iconType="circle" 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontWeight: 'bold' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[350px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-blue-500"></i>
            Category Intensity
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" radius={[0, 10, 10, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ActivityCategory]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;