
import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Zap, TrendingUp, CheckCircle2, AlertTriangle, Loader2, ArrowRight, Share2, RefreshCcw } from 'lucide-react';
import { analyzeTikTokID, getUnfreezeStrategy } from './services/geminiService';
import { TikTokProfile, BoostStrategy, AnalysisState, AccountStatus } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    profile: null,
    boost: null,
    error: null,
  });

  const handleScan = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!username.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null, profile: null, boost: null }));
    
    try {
      const cleanUsername = username.replace('@', '').trim();
      const profile = await analyzeTikTokID(cleanUsername);
      setState(prev => ({ ...prev, profile, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: 'Failed to access TikTok servers. Please check the ID and try again.' }));
    }
  };

  const handleUnfreeze = async () => {
    if (!state.profile) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      const boost = await getUnfreezeStrategy(state.profile);
      setState(prev => ({ ...prev, boost, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: 'Could not generate boost strategy.' }));
    }
  };

  const chartData = [
    { name: 'Day 1', views: 400 },
    { name: 'Day 2', views: 1200 },
    { name: 'Day 3', views: 900 },
    { name: 'Day 4', views: state.profile?.averageViews || 2000 },
    { name: 'Day 5', views: (state.profile?.averageViews || 2000) * 0.8 },
    { name: 'Day 6', views: (state.profile?.averageViews || 2000) * 1.2 },
    { name: 'Day 7', views: state.profile?.averageViews || 2400 },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 tiktok-gradient rounded-xl flex items-center justify-center font-black text-xl italic tracking-tighter shadow-lg shadow-cyan-500/20">
            TT
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Algorithmic <span className="text-cyan-400">Guard</span></span>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
            Support
          </button>
          <button className="px-4 py-2 rounded-lg tiktok-gradient text-sm font-bold shadow-lg shadow-pink-500/20">
            PRO Access
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none">
            FIX YOUR <span className="text-transparent bg-clip-text tiktok-gradient">TIKTOK ID</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Is your reach dead? Detect shadowbans, analyze 'frozen' accounts, and restore your viral potential instantly.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleScan} className="relative group mb-12">
          <div className="absolute -inset-1 tiktok-gradient rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative glass-panel rounded-2xl flex p-2">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-6 h-6 text-slate-500 mr-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Paste TikTok ID or Link (@username)..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-slate-600"
              />
            </div>
            <button
              disabled={state.loading}
              className="px-8 py-4 rounded-xl tiktok-gradient font-bold text-white hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {state.loading ? 'ANALYZING...' : 'CHECK STATUS'}
            </button>
          </div>
        </form>

        {state.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 mb-8">
            <ShieldAlert className="w-5 h-5" />
            {state.error}
          </div>
        )}

        {/* Results Section */}
        {state.profile && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Card */}
              <div className={`glass-panel p-6 rounded-3xl relative overflow-hidden ${
                state.profile.status === AccountStatus.FROZEN || state.profile.status === AccountStatus.SHADOWBANNED 
                ? 'border-red-500/30' : 'border-emerald-500/30'
              }`}>
                {state.loading && (
                  <div className="absolute inset-0 bg-cyan-400/5 scan-line z-0 pointer-events-none"></div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</span>
                  {state.profile.status === AccountStatus.HEALTHY ? (
                    <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                  ) : (
                    <AlertTriangle className="text-red-400 w-6 h-6 animate-pulse" />
                  )}
                </div>
                <h3 className={`text-3xl font-black mb-1 ${
                  state.profile.status === AccountStatus.HEALTHY ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {state.profile.status.toUpperCase()}
                </h3>
                <p className="text-sm text-slate-400">{state.profile.analysisSummary}</p>
              </div>

              {/* Engagement Card */}
              <div className="glass-panel p-6 rounded-3xl border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 block">Engagement Rate</span>
                <div className="flex items-end gap-2 mb-2">
                  <h3 className="text-4xl font-black">{state.profile.engagementRate}%</h3>
                  <TrendingUp className="text-cyan-400 w-6 h-6 mb-1" />
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full tiktok-gradient transition-all duration-1000" 
                    style={{ width: `${state.profile.engagementRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Risk Card */}
              <div className="glass-panel p-6 rounded-3xl border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 block">Algorithmic Risk</span>
                <h3 className={`text-3xl font-black mb-2 ${
                  state.profile.riskLevel === 'Low' ? 'text-emerald-400' : 
                  state.profile.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-500'
                }`}>
                  {state.profile.riskLevel}
                </h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 rounded-full ${
                        (state.profile?.riskLevel === 'Low' && i === 1) ? 'bg-emerald-400' :
                        (state.profile?.riskLevel === 'Medium' && i <= 2) ? 'bg-yellow-400' :
                        (state.profile?.riskLevel === 'High' && i <= 3) ? 'bg-orange-500' :
                        (state.profile?.riskLevel === 'Critical') ? 'bg-red-500' : 'bg-white/10'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement Chart */}
            <div className="glass-panel p-8 rounded-3xl border-white/5">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold">Reach Velocity</h3>
                  <p className="text-slate-500 text-sm">Real-time engagement trend for @{state.profile.username}</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs">
                     <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Views
                   </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ea" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f2ea" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                      itemStyle={{color: '#00f2ea'}}
                    />
                    <Area type="monotone" dataKey="views" stroke="#00f2ea" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Section */}
            {!state.boost ? (
              <div className="p-8 rounded-3xl tiktok-gradient text-white text-center shadow-2xl shadow-pink-500/20">
                <h3 className="text-2xl font-black mb-2">FIX YOUR ALGORITHM NOW</h3>
                <p className="mb-6 text-white/80 max-w-lg mx-auto">
                  Our AI engine has identified specific bottlenecks in your profile. Unlock the "Unfreeze" sequence to bypass the FYP filters.
                </p>
                <button 
                  onClick={handleUnfreeze}
                  className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto"
                >
                  <Zap className="w-6 h-6 fill-slate-950" />
                  INITIATE UNFREEZE ENGINE
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="glass-panel p-8 rounded-3xl border-cyan-500/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-cyan-400/20 rounded-2xl text-cyan-400">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{state.boost.title}</h3>
                      <p className="text-slate-400">Execution plan for @{state.profile.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-cyan-400" />
                        Step-by-Step Restoration
                      </h4>
                      <ul className="space-y-4">
                        {state.boost.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-slate-300">
                            <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0 border border-white/10">{i+1}</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-pink-500" />
                          Viral Content Pillars
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {state.boost.contentPillars.map((pillar, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium">
                              {pillar}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          Golden Posting Windows
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {state.boost.bestPostingTimes.map((time, i) => (
                            <div key={i} className="p-3 bg-slate-900/50 rounded-xl border border-white/5 text-center text-sm font-mono text-cyan-400">
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-4">Secret Growth Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {state.boost.hashtags.map((tag, i) => (
                            <span key={i} className="text-pink-500 font-bold hover:underline cursor-pointer">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-slate-950 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="text-slate-400 text-sm">Algorithm fix is ready. Follow these steps for 7 days to see result.</p>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold flex items-center gap-2"
                    >
                      Download PDF Report
                    </button>
                  </div>
                </div>

                <div className="text-center">
                   <button 
                    onClick={() => setState(prev => ({ ...prev, profile: null, boost: null }))}
                    className="text-slate-500 flex items-center gap-2 mx-auto hover:text-white transition-colors"
                   >
                     <RefreshCcw className="w-4 h-4" />
                     Analyze another ID
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hero Illustration (empty state) */}
        {!state.profile && !state.loading && (
          <div className="mt-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 select-none">
            <div className="flex justify-center gap-8 items-end flex-wrap">
              <div className="w-32 h-48 glass-panel rounded-t-3xl border-b-0 border-white/20"></div>
              <div className="w-40 h-64 glass-panel rounded-t-3xl border-b-0 border-white/20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <TrendingUp className="w-12 h-12 text-cyan-400/20" />
                </div>
              </div>
              <div className="w-32 h-32 glass-panel rounded-t-3xl border-b-0 border-white/20"></div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent CTA for Pro */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="glass-panel p-4 rounded-3xl border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full tiktok-gradient flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Upgrade</p>
              <p className="text-sm font-bold">TikTok Pro Boost</p>
            </div>
          </div>
          <button className="bg-white text-slate-950 px-4 py-2 rounded-xl text-sm font-black hover:scale-105 transition-transform">
            GET 100K VIEWS
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
