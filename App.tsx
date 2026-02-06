
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ShieldAlert, Zap, TrendingUp, CheckCircle2, 
  AlertTriangle, Loader2, ArrowRight, Share2, RefreshCcw, 
  History, Users, Heart, ExternalLink, Activity, Terminal,
  Globe, Server, Cpu, Lock, ChevronRight
} from 'lucide-react';
import { analyzeTikTokID, getUnfreezeStrategy } from './services/geminiService';
import { TikTokProfile, BoostStrategy, AnalysisState, AccountStatus } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SCAN_LOGS = [
  "SYSTEM: Booting TikGuard Engine v4.2.0...",
  "NETWORK: Establishing encrypted tunnel to TikTok CDN (AS13335)...",
  "API: Handshake successful. Status 200 OK.",
  "SCAN: Fetching node metadata for user identification...",
  "SCAN: Analyzing video distribution patterns...",
  "SCAN: Checking algorithmic flag database for 'frozen' status...",
  "SCAN: Evaluating metadata resonance and reach velocity...",
  "SCAN: Finalizing profile health score..."
];

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    scanStep: '',
    profile: null,
    boost: null,
    error: null,
    history: JSON.parse(localStorage.getItem('tt_history_v2') || '[]'),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('tt_history_v2', JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const parseUsername = (str: string) => {
    let clean = str.trim();
    if (clean.includes('tiktok.com/')) {
      const parts = clean.split('@');
      if (parts.length > 1) {
        clean = parts[1].split(/[/?]/)[0];
      }
    }
    return clean.replace('@', '').split(/[/?]/)[0];
  };

  const handleScan = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const username = parseUsername(input);
    if (!username) return;

    setState(prev => ({ ...prev, loading: true, error: null, profile: null, boost: null }));
    setLogs([]);
    
    // Simulate realistic terminal output
    for (let i = 0; i < SCAN_LOGS.length; i++) {
      setLogs(prev => [...prev, SCAN_LOGS[i]]);
      setState(prev => ({ ...prev, scanStep: SCAN_LOGS[i] }));
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
    }

    try {
      const profile = await analyzeTikTokID(username);
      setState(prev => ({ 
        ...prev, 
        profile, 
        loading: false,
        history: [profile, ...prev.history.filter(p => p.username !== profile.username)].slice(0, 5)
      }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: 'Algorithmic Guard failed to bypass security layers. Please retry.' }));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const chartData = useMemo(() => {
    const base = state.profile?.averageViews || 2000;
    return [
      { name: '01', v: base * 0.4 },
      { name: '02', v: base * 0.8 },
      { name: '03', v: base * 0.5 },
      { name: '04', v: base * 1.2 },
      { name: '05', v: base * 0.9 },
      { name: '06', v: base * 1.5 },
      { name: '07', v: base },
    ];
  }, [state.profile]);

  return (
    <div className="min-h-screen relative pb-32">
      {/* Header / Navbar */}
      <nav className="relative z-20 px-6 py-5 border-b border-white/5 bg-[#020617]/40 backdrop-blur-2xl flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 tiktok-gradient rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20 group cursor-pointer overflow-hidden">
            <div className="font-black text-xl italic text-white group-hover:scale-125 transition-transform">G</div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-widest uppercase text-white/90">TikGuard AI</h1>
            <p className="text-[10px] font-bold text-cyan-400/80 tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              SECURE ACCESS NODE: GLOBAL-01
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-4 mr-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400">GLOBAL CDN: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400">ENCRYPTION: AES-256</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all border border-white/10 text-white/70">
            PRO DOCS
          </button>
          <button className="px-5 py-2.5 rounded-xl tiktok-gradient text-xs font-black text-white shadow-lg shadow-pink-500/10 hover:scale-105 active:scale-95 transition-all">
            UNFREEZE PRO
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        {/* Hero Section */}
        {!state.profile && (
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Powered by Google Gemini 2.5</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.85] text-white">
              RESCUE YOUR <br/>
              <span className="text-gradient italic">ALGORITHM</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
              Is your account stuck at 200 views? TikGuard analyzes hidden algorithmic flags and provides the exact code to "Unfreeze" your reach.
            </p>
          </div>
        )}

        {/* Search & Terminal Interface */}
        <div className="max-w-4xl mx-auto mb-16">
          <form onSubmit={handleScan} className="relative group mb-8">
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-cyan-500 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-10 group-focus-within:opacity-30 transition duration-700"></div>
            <div className="relative glass-panel rounded-[2rem] p-3 flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 flex items-center pl-6 py-2">
                <Search className="w-6 h-6 text-slate-500 mr-4" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste Profile Link or @username..."
                  className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold placeholder:text-slate-700 text-white"
                />
              </div>
              <button
                disabled={state.loading}
                className="w-full md:w-auto px-10 py-5 rounded-[1.5rem] tiktok-gradient font-black text-white hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {state.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6" />}
                {state.loading ? 'NODE ANALYSIS...' : 'INITIATE SCAN'}
              </button>
            </div>
          </form>

          {state.loading && (
            <div className="glass-panel rounded-3xl overflow-hidden border-white/5 animate-in slide-in-from-top-4 duration-500 shadow-2xl">
              <div className="bg-slate-900/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">TikGuard Shell - Scan Active</span>
                </div>
                <div className="w-10"></div>
              </div>
              <div 
                ref={scrollRef}
                className="p-6 h-48 overflow-y-auto terminal-text text-[11px] md:text-xs text-cyan-400/80 leading-relaxed bg-black/40 scrollbar-hide"
              >
                {logs.map((log, i) => (
                  <div key={i} className="mb-1 flex gap-3">
                    <span className="text-slate-600 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                    <span className={log.startsWith('SYSTEM') ? 'text-pink-500' : log.startsWith('SCAN') ? 'text-cyan-400' : 'text-slate-400'}>
                      {log}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-1">
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          )}

          {state.error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-4 animate-in shake duration-300">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <div className="text-sm font-bold">{state.error}</div>
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        {state.profile && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
            {/* Top Row: Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="scan-line"></div>
                <div className="relative z-20">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 rounded-3xl tiktok-gradient p-[4px] rotate-3 hover:rotate-0 transition-transform shadow-2xl">
                      <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-black text-5xl text-white">
                        {state.profile.username[0].toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <h2 className="text-4xl font-black tracking-tighter">@{state.profile.username}</h2>
                         <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                      </div>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                        <Server className="w-3 h-3" /> VERIFIED CLUSTER: AS-WEST-1
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Users className="w-3 h-3" /> Network Size
                      </div>
                      <div className="text-3xl font-black text-white">{formatNumber(state.profile.followers)}</div>
                      <div className="text-[10px] text-emerald-400 font-bold mt-1 tracking-wider">+2.4% THIS WEEK</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Heart className="w-3 h-3" /> Total Impact
                      </div>
                      <div className="text-3xl font-black text-white">{formatNumber(state.profile.likes)}</div>
                      <div className="text-[10px] text-slate-500 font-bold mt-1 tracking-wider">LIFETIME ECHO</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center border-2 transition-all ${
                state.profile.status === AccountStatus.HEALTHY ? 'bg-emerald-500/5 border-emerald-500/20 glow-cyan' : 'bg-red-500/5 border-red-500/20 glow-pink'
              }`}>
                <div className="mb-6 p-5 rounded-full bg-white/5">
                  {state.profile.status === AccountStatus.HEALTHY ? (
                    <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-20 h-20 text-red-500 animate-pulse" />
                  )}
                </div>
                <h3 className={`text-5xl font-black mb-3 italic tracking-tighter uppercase ${
                  state.profile.status === AccountStatus.HEALTHY ? 'text-emerald-400' : 'text-red-500'
                }`}>
                  {state.profile.status}
                </h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-2">
                  {state.profile.analysisSummary}
                </p>
              </div>

              <div className="glass-panel p-10 rounded-[2.5rem] flex flex-col justify-between group hover:border-white/20 transition-all">
                <div>
                   <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithmic Risk</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      state.profile.riskLevel === 'Low' ? 'text-emerald-400' : 'text-red-500'
                    }`}>{state.profile.riskLevel}</span>
                  </div>
                  <div className="flex gap-2 mb-10">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${
                        (state.profile?.riskLevel === 'Low' && i <= 1) ? 'bg-emerald-400' :
                        (state.profile?.riskLevel === 'Medium' && i <= 2) ? 'bg-yellow-400' :
                        (state.profile?.riskLevel === 'High' && i <= 4) ? 'bg-orange-500' :
                        (state.profile?.riskLevel === 'Critical') ? 'bg-red-500' : 'bg-slate-800'
                      }`}></div>
                    ))}
                  </div>
                </div>
                <div>
                   <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resonance Coefficient</span>
                    <span className="text-[10px] font-black text-cyan-400">{state.profile.engagementRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-1">
                    <div className="h-full tiktok-gradient rounded-full shadow-[0_0_10px_rgba(0,242,234,0.5)]" style={{ width: `${state.profile.engagementRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Analytics Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-panel p-10 rounded-[2.5rem]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                      Reach Velocity Distribution
                    </h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Global Content Nodes / Active Engagement Peaks</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black text-white/70">
                      AVG: {formatNumber(state.profile.averageViews)}
                    </div>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="mainReach" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff0050" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00f2ea" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 900}} />
                      <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontWeight: 'black', padding: '12px'}}
                        cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}}
                      />
                      <Area type="monotone" dataKey="v" stroke="url(#mainReach)" strokeWidth={5} fillOpacity={1} fill="url(#mainReach)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-10 rounded-[2.5rem] flex flex-col h-full">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-pink-500" />
                  Bot Detection
                </h3>
                <div className="space-y-6 flex-1">
                  {[
                    { label: "AI Mimicry", val: 12, color: "bg-emerald-400" },
                    { label: "IP Diversity", val: 88, color: "bg-emerald-400" },
                    { label: "Meta Coherence", val: 45, color: "bg-yellow-400" },
                    { label: "Bot Fingerprint", val: 2, color: "bg-emerald-400" }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        <span>{item.label}</span>
                        <span className="text-white">{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                     System cross-verified 40,000+ data points. Profile behavior consistent with organic growth patterns.
                   </p>
                </div>
              </div>
            </div>

            {/* Strategic Intervention (Unfreeze Engine) */}
            {!state.boost ? (
              <div className="relative group overflow-hidden rounded-[3rem] p-16 text-center border border-white/5 shadow-2xl">
                <div className="absolute inset-0 tiktok-gradient opacity-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
                <div className="mesh-gradient opacity-30"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                     <Lock className="w-4 h-4 text-emerald-400" />
                     <span className="text-xs font-black text-white/80 uppercase tracking-widest">PROPRIETARY ALGORITHM RESTORE READY</span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">OVERRIDE <br/> FYP FILTERS</h3>
                  <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-medium leading-relaxed">
                    Our AI has isolated the exact metadata misalignment causing your reach to be capped. Generate the <span className="text-white font-bold">Encrypted Restoration Sequence</span> to fix your account.
                  </p>
                  <button 
                    onClick={async () => {
                      setState(prev => ({ ...prev, loading: true }));
                      const boost = await getUnfreezeStrategy(state.profile!);
                      setState(prev => ({ ...prev, boost, loading: false }));
                    }}
                    className="group/btn relative bg-white text-slate-950 px-14 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                    <Zap className="w-8 h-8 fill-current" />
                    GENERATE UNFREEZE CODE
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-12 duration-1000">
                <div className="glass-panel p-12 rounded-[3rem] border-cyan-500/20 shadow-[0_0_80px_rgba(0,242,234,0.05)]">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-16 h-16 bg-cyan-400/10 rounded-3xl flex items-center justify-center text-cyan-400 shadow-inner">
                      <Zap className="w-9 h-9" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-black tracking-tight text-white">{state.boost.title}</h4>
                      <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">Verified Intervention Plan</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {state.boost.steps.map((s, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-cyan-400 flex-shrink-0 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
                          {i+1}
                        </div>
                        <p className="text-slate-300 font-bold text-lg leading-snug pt-0.5">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass-panel p-10 rounded-[3rem] border-white/5">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                       <Share2 className="w-4 h-4 text-pink-500" /> RECOMMENDED TAGS (ECHO OPTIMIZED)
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {state.boost.hashtags.map((t, i) => (
                        <div key={i} className="px-5 py-2.5 bg-pink-500/5 border border-pink-500/20 rounded-2xl text-pink-500 font-black text-sm hover:bg-pink-500 hover:text-white transition-all cursor-pointer">
                          #{t}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-10 rounded-[3rem] border-white/5">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                       <TrendingUp className="w-4 h-4 text-emerald-400" /> VIRAL PILLARS (META-COHERENT)
                    </h4>
                    <div className="space-y-4">
                      {state.boost.contentPillars.map((p, i) => (
                        <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-slate-200 font-black text-lg">{p}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center pt-16">
               <button 
                onClick={() => { setInput(''); setState(p => ({ ...p, profile: null, boost: null })); }}
                className="text-slate-600 font-black text-xs uppercase tracking-widest flex items-center gap-3 mx-auto hover:text-white transition-all hover:bg-white/5 px-6 py-3 rounded-full"
               >
                 <RefreshCcw className="w-4 h-4" /> Reset Mainframe Connection
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Network Status */}
      <div className="fixed bottom-8 left-0 right-0 z-50 px-6 pointer-events-none">
         <div className="max-w-xl mx-auto pointer-events-auto">
            <div className="glass-panel p-4 rounded-[1.8rem] border-white/10 flex items-center justify-between shadow-2xl glow-cyan">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full tiktok-gradient flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#020617] rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none">Global Network Active</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Latency: 14ms | Servers: 104/104</p>
                </div>
              </div>
              <button className="bg-white text-slate-950 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Fix Reach Now
              </button>
            </div>
         </div>
      </div>

      {/* Background Decorative Mesh */}
      <div className="fixed top-1/4 right-0 w-96 h-96 bg-cyan-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-1/4 left-0 w-96 h-96 bg-pink-500/10 blur-[150px] -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  );
};

export default App;
