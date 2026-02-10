import React, { useState, useRef, useEffect } from 'react';

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const TOTAL_FRAMES = 180; // 6 seconds at 30fps

const VideoDemo: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Ready to create demo');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>(0);

  // Animation state
  const state = useRef({
    frame: 0,
    text: '',
    cursor: true,
    showResult: false,
    showTips: false,
    fade: 0,
  });

  const drawFrame = (ctx: CanvasRenderingContext2D) => {
    const f = state.current.frame;
    
    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sidebar Mockup
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 240, CANVAS_HEIGHT);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(20, 40, 200, 40);
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(20, 120 + i * 60, 200, 30);
    }

    // Main Header
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px Inter, system-ui';
    ctx.fillText('My carbon footprint', 280, 80);
    ctx.fillStyle = '#64748b';
    ctx.font = '500 18px Inter';
    ctx.fillText('AI-Powered Ecological Insight', 280, 110);

    // Smart Log Card
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.05)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(280, 160, 680, 200, 24);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px Inter';
    ctx.fillText('Smart Log', 310, 200);
    
    // Snappy Typing Animation
    const fullText = "I took a flight from London to Paris.";
    if (f > 30 && f < 90) {
      state.current.text = fullText.slice(0, Math.floor((f - 30) / 1.5));
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(310, 220, 620, 100, 16);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.font = '16px Inter';
    ctx.fillText(state.current.text + (f % 20 < 10 ? '|' : ''), 330, 255);

    // Quick Calculation Phase
    if (f > 90 && f < 120) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('AI is calculating impact...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = 'left';
    }

    // Snappy Result Appearance
    if (f > 120) {
      state.current.fade = Math.min(1, state.current.fade + 0.15);
      ctx.globalAlpha = state.current.fade;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(1000, 160, 240, 520, 24);
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 18px Inter';
      ctx.fillText('Estimation', 1030, 200);
      ctx.fillStyle = '#10b981';
      ctx.font = 'black 48px Inter';
      ctx.fillText('142', 1030, 260);
      ctx.font = 'bold 16px Inter';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('kg CO2e', 1030, 285);

      // Simple Chart
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(1120, 420, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(1120, 420, 60, -Math.PI / 2, Math.PI * 0.8);
      ctx.stroke();

      ctx.globalAlpha = 1.0;
    }

    // Instant Suggestions
    if (f > 140) {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px Inter';
      ctx.fillText('AI Suggestions', 280, 420);

      const items = ['Take the Eurostar next time', 'Choose vegan meal'];
      items.forEach((item, i) => {
        const offset = i * 80;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(280, 450 + offset, 680, 60, 16);
        ctx.fill();
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 18px Inter';
        ctx.fillText(item, 310, 487 + offset);
      });
    }

    state.current.frame++;
    if (state.current.frame < TOTAL_FRAMES) {
      animationFrameRef.current = requestAnimationFrame(() => drawFrame(ctx));
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setVideoUrl(null);
    setRecording(true);
    setStatus('Generating fast preview...');
    state.current.frame = 0;
    state.current.fade = 0;
    state.current.text = '';

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setRecording(false);
      setStatus('Ready!');
    };

    recorder.start();
    drawFrame(ctx);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    cancelAnimationFrame(animationFrameRef.current);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-slate-900 rounded-[40px] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="bg-emerald-500/20 w-fit px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-emerald-400 mb-4 border border-emerald-500/30">
            FAST EXPORT
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">AI Demo Studio</h2>
          <p className="text-slate-400 max-w-lg mb-8 text-base leading-relaxed font-medium">
            Generate an instant walkthrough video of the carbon tracking experience.
          </p>

          {!recording && !videoUrl && (
            <button 
              onClick={startRecording}
              className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-base hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-xl shadow-emerald-900/40"
            >
              <i className="fa-solid fa-bolt"></i>
              Instant Generate
            </button>
          )}

          {recording && (
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-400 font-bold text-sm">
                  Generating Demo...
                </p>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(state.current.frame / TOTAL_FRAMES) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="hidden" />
        
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
          <i className="fa-solid fa-film text-[200px]"></i>
        </div>
      </div>

      {videoUrl && (
        <div className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-800">Demo Sequence Ready</h3>
              <p className="text-slate-500 text-xs font-medium">MP4 • 6 Seconds • Instant Synthesis</p>
            </div>
            <div className="flex gap-2">
              <a 
                href={videoUrl} 
                download="FootprintDemo.mp4"
                className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-emerald-600 transition-all shadow-md"
              >
                Download
              </a>
              <button onClick={() => setVideoUrl(null)} className="bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold text-xs">
                Clear
              </button>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden aspect-video bg-black relative shadow-lg">
            <video src={videoUrl} className="w-full h-full object-contain" controls autoPlay loop />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDemo;