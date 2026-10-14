import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Users, Compass, Terminal, MapPin, BookOpen, Rocket,
  Play, ShieldAlert, CheckCircle2, Award, Clock, ArrowRight, Radio,
  Trees, Volume2, Plus, FlaskConical, Key, Star, Layers, Activity,
  Cpu, Flame, Eye, Lock, Unlock, HelpCircle, ChevronRight, LogIn,
  Trophy, Globe, Crown, Medal, RefreshCw
} from 'lucide-react';
import { heistAudio } from './HeistAudioEngine';
import { toast } from 'sonner';
import { leaderboardAPI } from '../services/api';
import { calculateLevel } from '../utils/leveling';
import RoleAvatar, { normalizeRoleKey } from './RoleAvatar';
import CountUp from './CountUp';

export default function HeroPage({
  onNavigate,
  onStartStage,
  onOpenCustomHeist,
  onRequireAuth,
  onOpenSoloTraining,
  currentUser,
  characters = [],
  missions = [],
  heistStages = []
}) {
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);
  const [liveRelayStep, setLiveRelayStep] = useState(0);
  const [isSimulatingTransmission, setIsSimulatingTransmission] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState('ALL');
  const [realLeaderboard, setRealLeaderboard] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isRetryingLeaderboard, setIsRetryingLeaderboard] = useState(false);

  const fetchLeaderboard = async (isManualRetry = false) => {
    if (isManualRetry) setIsRetryingLeaderboard(true);
    else setIsLoadingLeaderboard(true);
    try {
      const data = await leaderboardAPI.getGlobal(100);
      if (data?.leaderboard && Array.isArray(data.leaderboard)) {
        setRealLeaderboard(data.leaderboard);
        if (isManualRetry) toast.success("📡 Global Leaderboard Synced!");
      } else {
        if (isManualRetry) toast.error("Could not reach syndicate mainframe.");
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      if (isManualRetry) toast.error("Network synchronization failed.");
    } finally {
      setIsLoadingLeaderboard(false);
      setIsRetryingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const handleUserUpdated = () => {
      fetchLeaderboard();
    };
    window.addEventListener('vault:user-updated', handleUserUpdated);
    return () => window.removeEventListener('vault:user-updated', handleUserUpdated);
  }, []); 

  const [liveTransmissions, setLiveTransmissions] = useState([
    { id: 1, sender: "Canopy Hacker", role: "hacker", color: "#22D3EE", text: "Array pointer unlocked at 0x7FF. Sending refractive index n=1.52 to Engineer!" },
    { id: 2, sender: "Woodland Engineer", role: "engineer", color: "#FBBF24", text: "Snell angle calibrated at 45.0°. Deflecting green laser to Bio-Chamber!" },
    { id: 3, sender: "Flora Scientist", role: "scientist", color: "#A3E635", text: "Stoichiometry balanced 2H₂ + O₂ -> 2H₂O. Neutralizer pH stabilized at 7.4!" },
    { id: 4, sender: "Mist Cryptographer", role: "crypto", color: "#C084FC", text: "Cipher shift key +7 decoded! Final master override verified. Vault unlocked!" }
  ]);

  // Periodic ambient transmission pulses to keep the live HUD dynamic
  useEffect(() => {
    const ambientTelemetry = [
      { sender: "Canopy Hacker", role: "hacker", color: "#22D3EE", text: "Buffer parity verified on port 8082. Submitting bitmask 0b1101 to Squad Ledger." },
      { sender: "Woodland Engineer", role: "engineer", color: "#FBBF24", text: "Prism beam synchronized at 532nm. Target aperture alignment locked at 99.8%." },
      { sender: "Flora Scientist", role: "scientist", color: "#A3E635", text: "Catalyst reaction reached equilibrium. Membrane permeability coefficient at 0.84." },
      { sender: "Mist Cryptographer", role: "crypto", color: "#C084FC", text: "Frequency carrier locked at 144.20MHz. Deciphering encrypted squad checksum." }
    ];

    const timer = setInterval(() => {
      const nextMsg = ambientTelemetry[Math.floor(Math.random() * ambientTelemetry.length)];
      setLiveTransmissions(prev => {
        const nextId = (prev[prev.length - 1]?.id || 0) + 1;
        return [...prev.slice(1), { ...nextMsg, id: nextId }];
      });
    }, 8500);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateRelay = () => {
    setIsSimulatingTransmission(true);
    setLiveRelayStep(1);
    setSelectedRoleIdx(0);
    heistAudio.playRadioSquelch();

    setTimeout(() => {
      setLiveRelayStep(2);
      setSelectedRoleIdx(1);
      heistAudio.playKeyClick();
      setTimeout(() => {
        setLiveRelayStep(3);
        setSelectedRoleIdx(2);
        heistAudio.playLaserHum();
        setTimeout(() => {
          setLiveRelayStep(4);
          setSelectedRoleIdx(3);
          heistAudio.playSuccessChime();
          toast.success("🔓 Master Vault Override Confirmed! 4 Roles Interlocked!");
          setIsSimulatingTransmission(false);
          setTimeout(() => setLiveRelayStep(0), 2500);
        }, 800);
      }, 700);
    }, 700);
  };

  const handleSimulateTransmission = handleSimulateRelay;

  const handleGuardedAction = (actionCallback, message = "Sign in to access this operation.") => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth();
      toast.info(`🔐 Operative clearance required: ${message}`);
    } else if (actionCallback) {
      actionCallback();
    }
  };

  const filteredLeaderboard = realLeaderboard.filter(item => {
    if (leaderboardFilter === 'ALL') return true;
    return (item.role || '').toLowerCase().includes(leaderboardFilter.toLowerCase());
  });

  return (
    <div className="w-full space-y-4 sm:space-y-5 pb-6">

      {/* ─────────────────────────────────────────────────────────────
          1. Hero Section: Tightened Padding & Edge-Aligned Container
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full relative overflow-hidden rounded-2xl clay-card p-4 sm:p-5 lg:p-5 border border-[rgba(52,211,153,0.25)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center relative z-10">
          
          {/* Left Column: Vertically centered against the HUD, tightened spacing */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 bg-[#F59E0B] text-[#02140D] font-mono font-medium text-xs px-2.5 py-0.5 border border-amber-400/60 rounded-full shadow-sm">
                <Trees className="w-3.5 h-3.5 text-[#02140D] stroke-[2.5]" />
                <span className="text-xs">🌲</span>
                <span className="tracking-normal">Real-Time Multiplayer Learning Heist</span>
              </div>
            </div>

            {/* Headline with enhanced scale and shine sweep */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-white font-display">
              <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1">
                <span className="text-white">EDUCATION IS A</span>
                <span className="headline-sweep-badge text-[#02140D] px-3 sm:px-4 py-0.5 border border-[#34D399] rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.45)] inline-block font-black text-2xl sm:text-4xl lg:text-5xl">
                  TEAM SPORT!
                </span>
              </div>
            </h1>

            {/* Paragraph: regular weight, sentence case, tightened bottom margin */}
            <p className="text-xs sm:text-sm font-sans font-normal text-[#CFE8DC] max-w-2xl leading-relaxed mb-3 sm:mb-4">
              Assemble a 4-specialist crew to crack interconnected academic vaults across <strong className="text-white font-semibold">Computer Science</strong>, <strong className="text-white font-semibold">Physics</strong>, <strong className="text-white font-semibold">Chemistry</strong>, and <strong className="text-white font-semibold">Discrete Mathematics</strong>. Real-time puzzle interdependence means no single player can win alone.
            </p>

            {/* Tightened Button Layout: Row 1 has strictly TWO prominent buttons */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full">
                {/* 1. Only Solid Orange Gradient Button */}
                <button
                  data-tour="coop-btn"
                  onClick={() => {
                    handleGuardedAction(() => onStartStage(0), "Sign in with email & password to launch live co-op operations.");
                    heistAudio.playKeyClick();
                  }}
                  className="flex-1 fluid-btn bg-gradient-to-r from-[#F59E0B] to-[#FB923C] hover:brightness-110 text-[#02140D] font-black px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-[#FBBF24] rounded-lg shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm uppercase group"
                >
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform text-[#02140D]" />
                  <span>Launch Co-op Heist</span>
                </button>

                {/* 2. Emerald Ghost Button */}
                <button
                  onClick={() => {
                    handleGuardedAction(() => onNavigate('lobby'), "Sign in to assemble squad crews in the lobby.");
                    heistAudio.playKeyClick();
                  }}
                  className="flex-1 fluid-btn bg-transparent hover:bg-[#10B981]/15 text-[#CFE8DC] hover:text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 border border-[#34D399]/40 hover:border-[#34D399] rounded-lg shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm uppercase"
                >
                  <Users className="w-4 h-4 text-[#34D399]" />
                  <span>Squad Lobby</span>
                </button>
              </div>

              {/* Row 2: Secondary Training & Map Links */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <button
                  data-tour="solo-btn"
                  onClick={() => {
                    heistAudio.playKeyClick();
                    onOpenSoloTraining?.();
                  }}
                  className="fluid-btn bg-[#03150D]/80 hover:bg-[#10B981]/15 text-[#CFE8DC] hover:text-white font-medium px-3.5 py-1.5 border border-[#34D399]/35 hover:border-[#34D399] rounded-lg shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 text-xs group"
                  title="Learn all 4 roles solo, with hints — no squad or account needed!"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#34D399] group-hover:scale-110 transition-transform" />
                  <span>Solo Training</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-medium">Practice</span>
                </button>

                <button
                  onClick={() => {
                    handleGuardedAction(() => onNavigate('map'), "Sign in to view real-time canopy map tracking.");
                    heistAudio.playKeyClick();
                  }}
                  className="fluid-btn bg-[#03150D]/80 hover:bg-[#10B981]/15 text-[#CFE8DC] hover:text-white font-medium px-3.5 py-1.5 border border-[#34D399]/35 hover:border-[#34D399] rounded-lg shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 text-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Canopy Map</span>
                </button>
              </div>
            </div>

            {/* Accessible High-Contrast Value Props */}
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-sans font-medium text-[#CFE8DC]">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Zero Solo Rote</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Real-Time Interlock</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Skill Analytics</span>
              </span>
            </div>
          </div>

          {/* Right Column: 5. HUD Showpiece */}
          <div className="lg:col-span-5">
            <div className="forest-card p-3.5 sm:p-4 rounded-xl relative shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_36px_rgba(0,0,0,0.45)] border border-[rgba(52,211,153,0.3)] space-y-3">
              
              {/* Header with pulsing broadcast beacon and softly pulsing locked badge */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#EF4444] text-white border border-[#03140C] rounded-lg pulse-beacon-red">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-[#F0FDF4] tracking-wider">
                      Live Squad Interdependence HUD
                    </h3>
                    <p className="text-[10px] text-emerald-300 font-mono font-medium">Synchronous Puzzle Relay</p>
                  </div>
                </div>
                <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#03140C] ${
                  currentUser ? 'bg-[#10B981] text-[#02140D]' : 'bg-[#F59E0B] text-[#02140D] pulse-badge-locked'
                }`}>
                  {currentUser ? 'ONLINE' : 'LOCKED 🔒'}
                </span>
              </div>

              {/* Showpiece Element 1: 4/4 Specialists Connection Progress Bar */}
              <div className="p-2 bg-[#020C07]/90 rounded-lg border border-emerald-900/60 font-mono space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-medium">
                  <span className="text-[#A7F3D0] tracking-normal flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-[#22D3EE] animate-pulse" />
                    <span>Squad Mesh: 4/4 Roles Linked</span>
                  </span>
                  <span className="text-emerald-400 font-bold">100% SYNC</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-2">
                  <div className="bg-[#22D3EE] rounded-sm shadow-[0_0_8px_#22D3EE80]" title="Hacker Connected" />
                  <div className="bg-[#FBBF24] rounded-sm shadow-[0_0_8px_#FBBF2480]" title="Engineer Connected" />
                  <div className="bg-[#A3E635] rounded-sm shadow-[0_0_8px_#A3E63580]" title="Scientist Connected" />
                  <div className="bg-[#C084FC] rounded-sm shadow-[0_0_8px_#C084FC80]" title="Cryptographer Connected" />
                </div>
              </div>

              {/* Showpiece Element 2: 4 Specialist Role Tabs with Active State and Distinction */}
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px] text-center" data-tour="roles">
                {[
                  { key: "hacker", label: "1. HACK", color: "#22D3EE", roleName: "Canopy Hacker" },
                  { key: "engineer", label: "2. LASER", color: "#FBBF24", roleName: "Woodland Engineer" },
                  { key: "scientist", label: "3. CHEM", color: "#A3E635", roleName: "Flora Scientist" },
                  { key: "crypto", label: "4. CRYPT", color: "#C084FC", roleName: "Mist Cryptographer" }
                ].map((step, idx) => {
                  const isSelected = selectedRoleIdx === idx || (liveRelayStep > 0 && liveRelayStep === idx + 1);
                  return (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedRoleIdx(idx);
                        heistAudio.playKeyClick();
                      }}
                      className={`p-1.5 flex flex-col items-center justify-center transition-all duration-200 rounded-lg cursor-pointer ${
                        isSelected 
                          ? '-translate-y-0.5 opacity-100 font-bold' 
                          : 'opacity-70 hover:opacity-90 hover:-translate-y-0.5 font-medium'
                      }`}
                      style={isSelected ? {
                        backgroundColor: `${step.color}22`,
                        color: step.color,
                        border: `2px solid ${step.color}`,
                        boxShadow: `0 0 16px ${step.color}60, inset 0 1px 1px rgba(255, 255, 255, 0.25)`
                      } : {
                        backgroundColor: 'rgba(2, 12, 7, 0.80)',
                        color: '#94A3B8',
                        border: `1px solid ${step.color}35`,
                        boxShadow: 'none'
                      }}
                    >
                      <RoleAvatar role={step.key} size="xs" showGlow={isSelected} className="mb-0.5" />
                      <span className="truncate w-full text-[9px]">{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Showpiece Element 3: Animated Live Transmissions Feed with Gradient Mask */}
              <div 
                className="space-y-2 max-h-44 overflow-y-auto pr-1 scroll-smooth"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
                }}
              >
                <AnimatePresence initial={false}>
                  {liveTransmissions.map((t) => (
                    <motion.div 
                      key={t.id} 
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="p-2 bg-[#020B06]/92 border border-[#03140C] rounded-lg text-xs font-mono space-y-0.5 transition-all hover:bg-[#04160E]"
                      style={{ borderLeft: `3px solid ${t.color}` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <RoleAvatar role={t.role} size="xs" showGlow={false} />
                          <span className="font-bold text-[10px] uppercase tracking-wide" style={{ color: t.color }}>
                            [{t.sender}]
                          </span>
                        </div>
                        <span className="text-[10px] text-[#34D399] font-mono font-medium tracking-wide">
                          LIVE FEED
                        </span>
                      </div>
                      <p className="text-[#CFE8DC] text-[11px] leading-snug pl-5 font-normal">{t.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Showpiece Element 4: Terminal input prompt with blinking cursor */}
                <div className="p-1.5 px-2.5 bg-[#020804]/90 rounded-md border border-emerald-950/80 font-mono text-[10px] text-emerald-400 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <span className="text-[#22D3EE] font-black mr-1">&gt;</span>
                    <span className="text-slate-300 truncate font-normal">SYS_LINK://RELAY_READY</span>
                    <span className="inline-block w-1.5 h-3 bg-[#22D3EE] ml-1 terminal-cursor" />
                  </div>
                  <span className="text-[9px] text-[#A7F3D0] font-bold flex-shrink-0">BUFFER OK</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#03140C] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (!currentUser) {
                      handleGuardedAction(() => {}, "Sign in with email & password to test live squad interdependence telemetry.");
                      return;
                    }
                    handleSimulateTransmission();
                  }}
                  disabled={isSimulatingTransmission}
                  className="flex-1 bg-[#F59E0B] text-[#02140D] font-black text-xs py-2 px-3 border border-[#03140C] shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:bg-[#F59E0B] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 flex items-center justify-center space-x-1.5 uppercase rounded-lg transition-all"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isSimulatingTransmission ? "RELAYING DATA..." : "TEST SQUAD INTERLOCK"}</span>
                </button>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      handleGuardedAction(() => {}, "Sign in to enter the live squad operation cockpit.");
                      return;
                    }
                    onNavigate('liveheist');
                  }}
                  className="bg-[#10B981] text-[#02140D] font-black text-xs py-2 px-3 border border-[#03140C] shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:bg-[#34D399] hover:-translate-y-0.5 uppercase flex items-center space-x-1 rounded-lg transition-all"
                >
                  <span>LIVE HUD</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Stats Counter Section: Calmed Background & Connected Palette
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Active Operatives", val: "4,820+", icon: Users, color: "#22D3EE" },
          { label: "STEM Vaults Solved", val: "18,500+", icon: ShieldAlert, color: "#FBBF24" },
          { label: "Co-Op Success Rate", val: "98.4%", icon: CheckCircle2, color: "#A3E635" },
          { label: "Specialist Roles", val: "4 Classes", icon: Sparkles, color: "#C084FC" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="forest-card p-3 sm:p-4 rounded-2xl text-left border border-[rgba(52,211,153,0.25)] bg-[rgba(16,185,129,0.08)] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-emerald-300/85 tracking-normal">
                  {stat.label}
                </span>
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 0 10px ${stat.color}25`
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                <CountUp value={stat.val} />
              </p>
            </div>
          );
        })}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Global Syndicate Leaderboard: Calmed Dark Backdrop & Clean Type
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full relative overflow-hidden rounded-2xl bg-[#03150D]/70 backdrop-blur-md border border-[rgba(52,211,153,0.25)] p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_36px_rgba(0,0,0,0.45)] space-y-3.5 text-left">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-[#F59E0B] text-[#02140D] font-mono font-medium text-[11px] px-2.5 py-0.5 rounded-full uppercase mb-1">
              <Trophy className="w-3 h-3" />
              <span>Worldwide Rankings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
              Global Syndicate Leaderboard
            </h2>
            <p className="text-xs text-slate-300 font-normal mt-0.5">
              Live individual specialist standings ranked by season XP.
            </p>
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap gap-1 bg-[#020B06]/70 backdrop-blur-sm p-1 rounded-lg border border-emerald-900/60 text-xs font-mono relative z-10">
          {[
            { id: 'ALL', label: 'All Specialists', color: '#10B981' },
            { id: 'Hacker', label: 'Hackers', color: '#22D3EE' },
            { id: 'Engineer', label: 'Engineers', color: '#FBBF24' },
            { id: 'Scientist', label: 'Scientists', color: '#A3E635' },
            { id: 'Cryptographer', label: 'Cryptographers', color: '#C084FC' }
          ].map(tab => {
            const isSelected = leaderboardFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setLeaderboardFilter(tab.id);
                  heistAudio.playKeyClick();
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                style={isSelected ? {
                  backgroundColor: tab.color,
                  color: '#02140D',
                  boxShadow: `0 0 12px ${tab.color}60`
                } : {
                  color: '#94A3B8'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Leaderboard Rows with RoleAvatar Badges */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1.5 scroll-touch relative z-10">
          {isLoadingLeaderboard ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(idx => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-emerald-900/40 bg-[#041C13]/40 flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/40" />
                    <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-800/40" />
                    <div className="space-y-1.5">
                      <div className="w-32 h-3.5 bg-emerald-900/40 rounded" />
                      <div className="w-20 h-2.5 bg-emerald-950/60 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-4 bg-emerald-900/40 rounded hidden md:block" />
                    <div className="w-16 h-5 bg-emerald-900/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="bg-[#041C13]/40 border-2 border-dashed border-emerald-900/60 rounded-2xl p-8 sm:p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <ShieldAlert className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold uppercase text-white font-display">
                  {realLeaderboard.length === 0 ? "Global Syndicate Mesh Offline" : "No Operatives In This Category"}
                </h3>
                <p className="text-xs font-normal text-slate-300 leading-relaxed">
                  {realLeaderboard.length === 0 
                    ? "Unable to sync operative rankings with the central syndicate mainframe. The mesh may be undergoing silent rotation or standing by."
                    : `No operatives currently rank under ${leaderboardFilter}. Try checking All Specialists or launch a heist to claim the #1 slot!`
                  }
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {realLeaderboard.length === 0 ? (
                  <button
                    onClick={() => {
                      fetchLeaderboard(true);
                      heistAudio.playKeyClick();
                    }}
                    disabled={isRetryingLeaderboard}
                    className="bg-[#10B981] hover:bg-[#34D399] text-[#02140D] font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 font-display uppercase shadow-md active:scale-95 disabled:opacity-60 hover:-translate-y-0.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetryingLeaderboard ? 'animate-spin' : ''}`} />
                    <span>{isRetryingLeaderboard ? 'Scanning Radar...' : 'Re-Scan Radar'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLeaderboardFilter('ALL');
                      heistAudio.playKeyClick();
                    }}
                    className="bg-[#10B981] hover:bg-[#34D399] text-[#02140D] font-bold text-xs px-4 py-2 rounded-lg transition-all font-display uppercase shadow-md active:scale-95 hover:-translate-y-0.5"
                  >
                    Show All Specialists
                  </button>
                )}
              </div>
            </div>
          ) : filteredLeaderboard.map(player => {
            const pos = player.position;
            const isTop3 = pos <= 3;
            const roleKey = normalizeRoleKey(player.role);
            let roleColor = '#22D3EE';
            if (roleKey === 'engineer') roleColor = '#FBBF24';
            else if (roleKey === 'scientist') roleColor = '#A3E635';
            else if (roleKey === 'crypto') roleColor = '#C084FC';

            return (
              <div
                key={player.userId || pos}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 group squad-row hover:-translate-y-0.5 ${
                  pos === 1
                    ? 'bg-gradient-to-r from-[#173019]/70 via-[#041A11]/70 to-[#041A11]/70 backdrop-blur-md border-amber-400/50 hover:border-amber-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : pos === 2
                    ? 'bg-gradient-to-r from-[#162721]/70 via-[#041A11]/70 to-[#041A11]/70 backdrop-blur-md border-slate-300/40 hover:border-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : pos === 3
                    ? 'bg-gradient-to-r from-[#201A12]/70 via-[#041A11]/70 to-[#041A11]/70 backdrop-blur-md border-amber-700/50 hover:border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'bg-[#041C13]/50 backdrop-blur-md border-emerald-900/40 hover:border-[#10B981]/60 hover:bg-[#06291B]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 shadow-sm ${
                    pos === 1 ? 'bg-amber-400 text-[#02140D] font-black ring-1 ring-amber-300' :
                    pos === 2 ? 'bg-slate-200 text-[#02140D] font-black ring-1 ring-slate-100' :
                    pos === 3 ? 'bg-amber-700 text-white font-black ring-1 ring-amber-600' :
                    'bg-[#020B06]/90 text-slate-300 border border-emerald-900/60'
                  }`}>
                    #{pos}
                  </span>

                  <div className="relative flex-shrink-0">
                    <img 
                      src={player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                      alt={player.callsign || player.username} 
                      className="w-8 h-8 rounded-lg object-cover border border-emerald-800/80 group-hover:scale-105 transition-transform" 
                    />
                    {isTop3 && (
                      <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-[#020B06]">
                        <Crown className={`w-2.5 h-2.5 ${
                          pos === 1 ? 'text-amber-400' :
                          pos === 2 ? 'text-slate-300' : 'text-amber-600'
                        }`} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-white font-display truncate group-hover:text-[#10B981] transition-colors">
                        {player.callsign || player.username}
                      </h3>
                      <span className="text-[10px] text-emerald-400/90 font-mono font-medium">
                        {`LVL ${calculateLevel(player.totalXp || player.xp || 0)}`}
                      </span>
                    </div>
                    <p className="text-[10px] font-sans text-emerald-300/80 truncate">
                      {player.rank || 'Operative'}
                    </p>
                  </div>
                </div>

                {/* 6. Character Art / Distinct Role Avatar Badge in Leaderboard */}
                <div className="flex items-center space-x-2">
                  <RoleAvatar role={player.role} size="xs" showGlow={false} />
                  <span 
                    className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium uppercase transition-all"
                    style={{
                      backgroundColor: `${roleColor}18`,
                      color: roleColor,
                      border: `1px solid ${roleColor}50`,
                      boxShadow: `0 0 8px ${roleColor}20`
                    }}
                  >
                    {player.role || 'Hacker'}
                  </span>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-mono pt-2 md:pt-0 border-t md:border-t-0 border-emerald-950/80">
                  <div className="text-left md:text-center">
                    <span className="text-[9px] text-[#A7F3D0] block uppercase font-medium">Streak</span>
                    <span className="text-white font-bold text-sm">{player.streak || 0}</span>
                  </div>
                  <div className="text-left md:text-right min-w-[70px]">
                    <span className="text-[9px] text-[#A7F3D0] block uppercase font-medium">Total XP</span>
                    <span className="text-amber-300 font-bold text-sm">{(player.totalXp || 0).toLocaleString()}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
