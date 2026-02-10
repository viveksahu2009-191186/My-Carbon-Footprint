import React from 'react';
import { ActivityLog, ActivityCategory } from '../types';

interface HistoryProps {
  logs: ActivityLog[];
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  [ActivityCategory.TRANSPORTATION]: 'fa-car-side',
  [ActivityCategory.FOOD]: 'fa-utensils',
  [ActivityCategory.ELECTRICITY]: 'fa-plug-circle-bolt',
  [ActivityCategory.COOKING_FUEL]: 'fa-fire-burner',
  [ActivityCategory.WATER]: 'fa-droplet',
  [ActivityCategory.DIGITAL]: 'fa-wifi',
  [ActivityCategory.WASTE]: 'fa-trash-can',
  [ActivityCategory.OTHER]: 'fa-circle-question',
};

const CATEGORY_COLORS: Record<string, string> = {
  [ActivityCategory.TRANSPORTATION]: 'bg-emerald-50 text-emerald-500',
  [ActivityCategory.FOOD]: 'bg-amber-50 text-amber-500',
  [ActivityCategory.ELECTRICITY]: 'bg-blue-50 text-blue-500',
  [ActivityCategory.COOKING_FUEL]: 'bg-red-50 text-red-500',
  [ActivityCategory.WATER]: 'bg-cyan-50 text-cyan-500',
  [ActivityCategory.DIGITAL]: 'bg-violet-50 text-violet-500',
  [ActivityCategory.WASTE]: 'bg-slate-50 text-slate-500',
  [ActivityCategory.OTHER]: 'bg-slate-50 text-slate-500',
};

const History: React.FC<HistoryProps> = ({ logs, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-slate-200">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-clock-rotate-left text-slate-300 text-2xl"></i>
        </div>
        <p className="text-slate-500 font-medium">Your journal is empty.</p>
        <p className="text-slate-400 text-sm">Start logging activities like travel, diet, or digital habits.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 px-2">Climate Journal</h3>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4 transition-all hover:border-emerald-100 group">
            <div className={`p-3 rounded-2xl shrink-0 ${CATEGORY_COLORS[log.category] || 'bg-slate-50 text-slate-500'}`}>
              <i className={`fa-solid ${CATEGORY_ICONS[log.category] || 'fa-circle-question'} text-xl`}></i>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-bold text-slate-800 text-lg truncate pr-2">{log.description}</p>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-slate-800">{log.emissionKg.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">kg CO2e</span>
                </div>
              </div>
              
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-clock"></i>
                  {new Date(log.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {log.category}
                </span>
              </div>
              
              <div className="mt-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border-l-2 border-emerald-400 leading-relaxed">
                {log.aiExplanation}
              </div>
            </div>

            <button 
              onClick={() => onDelete(log.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all rounded-full hover:bg-red-50"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;