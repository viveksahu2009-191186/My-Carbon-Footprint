import React from 'react';
import { Recommendation } from '../types';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-wand-magic-sparkles text-emerald-400 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Calculating Your Action Plan</h3>
        <p className="text-slate-500">Add a few more logs so AI can find personalized ways for you to save.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Your Action Plan</h3>
          <p className="text-slate-500 text-sm">Personalized strategies to shrink your footprint.</p>
        </div>
        <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">AI Analysis</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:border-emerald-200 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                rec.priority === 'high' ? 'bg-red-50 text-red-600' : 
                rec.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 
                'bg-blue-50 text-blue-600'
              }`}>
                {rec.priority} Impact
              </span>
              <div className="text-right">
                <div className="text-emerald-600 font-extrabold text-lg leading-none">
                  -{rec.potentialSavingKg}kg
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">per month</span>
              </div>
            </div>
            
            <h4 className="font-bold text-slate-800 text-lg mb-2 leading-tight">{rec.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
              {rec.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Cost Impact</p>
                <p className="text-xs font-bold text-slate-700">{rec.costImpact}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Feasibility</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        rec.feasibilityScore > 7 ? 'bg-emerald-500' :
                        rec.feasibilityScore > 4 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${rec.feasibilityScore * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{rec.feasibilityScore}/10</span>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3.5 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-100">
              Commit to this action
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mt-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Community Pulse</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Collective Impact</h3>
          <p className="text-slate-400 mb-6 max-w-md">By adopting these small shifts, our community has offset 14.2 tons of CO2 this month. Every choice you make adds up.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-share-nodes"></i>
              Share Milestone
            </button>
            <button className="bg-slate-800 text-white border border-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-colors">
              Compare Stats
            </button>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
          <i className="fa-solid fa-earth-americas text-[250px]"></i>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsList;