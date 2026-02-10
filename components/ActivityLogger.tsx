import React, { useState } from 'react';

interface ActivityLoggerProps {
  onAdd: (description: string) => Promise<void>;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "I watched 4 hours of HD streaming",
  "A 15-minute hot shower",
  "Commuted 10km by electric bike",
  "Cooked dinner on a gas stove",
  "Left the AC running for 3 hours",
  "Bought 2kg of fresh local vegetables",
  "Deleted 1000 old emails from cloud storage"
];

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onAdd, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;
    await onAdd(description);
    setDescription('');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <i className="fa-solid fa-brain text-8xl text-emerald-500"></i>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Log</h3>
      <p className="text-slate-500 text-sm mb-6">Describe any activity. AI handles the math for energy, water, digital, or fuel.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., 'Streamed 2 hours of video' or 'Took a 10km taxi ride'"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-emerald-500 min-h-[120px] text-slate-800 transition-all resize-none shadow-inner"
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4 text-emerald-400 animate-pulse">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setDescription(suggestion)}
              className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={!description.trim() || isLoading}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
            isLoading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200 hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Estimating impact...
            </>
          ) : (
            <>
              <i className="fa-solid fa-bolt"></i>
              Add Activity
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ActivityLogger;