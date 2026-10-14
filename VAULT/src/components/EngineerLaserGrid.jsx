import React, { useState, useEffect } from 'react';
import { Compass, Zap, CheckCircle2, RotateCw, Sparkles, Activity } from 'lucide-react';
import { heistAudio } from './HeistAudioEngine';

function EngineerLaserGrid({ puzzle, onSolved, onFail, isSolved }) {
  const [angleA, setAngleA] = useState(15);
  const [angleB, setAngleB] = useState(90);
  const [isHittingTarget, setIsHittingTarget] = useState(false);

  const reqA = puzzle.requiredAngleA || 45;
  const reqB = puzzle.requiredAngleB || 135;

  useEffect(() => {
    const matchA = Math.abs(angleA - reqA) <= 3;
    const matchB = Math.abs(angleB - reqB) <= 3;

    if (matchA && matchB) {
      setIsHittingTarget(true);
    } else {
      setIsHittingTarget(false);
    }
  }, [angleA, angleB, reqA, reqB]);

  const handleAngleAChange = (val) => {
    setAngleA(parseInt(val, 10));
    heistAudio.playKeyClick();
  };

  const handleAngleBChange = (val) => {
    setAngleB(parseInt(val, 10));
    heistAudio.playKeyClick();
  };

  const handleEngageBeam = () => {
    heistAudio.playLaserHum();
    if (isHittingTarget) {
      heistAudio.playSuccessChime();
      onSolved('engineer', puzzle.clueRevealed);
    } else {
      heistAudio.playAlarmSiren();
      onFail('engineer', `Laser beam deflected off-target! Sensor misaligned.`);
    }
  };

  const mirrorAX = 38;
  const mirrorAY = 35;
  const mirrorBX = 70;
  const mirrorBY = 68;
  const targetX = puzzle.sensorTargetX || 88;
  const targetY = puzzle.sensorTargetY || 38;

  return (
    <div className="forest-card p-5 sm:p-6 space-y-4 font-sans text-sm border-[3px] border-[#03140C] bg-[#051811]/90 shadow-[6px_6px_0px_#020C07]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#03140C] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping"></div>
          <span className="text-xs font-black uppercase text-[#F59E0B] tracking-wider flex items-center space-x-1 font-mono">
            <Compass className="w-4 h-4 text-[#F59E0B]" />
            <span>THE ENGINEER COCKPIT — {puzzle.title}</span>
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#10B981] bg-[#03140C] px-2 py-0.5 border border-[#10B981]/40 font-mono">
          DISCIPLINE: {puzzle.discipline}
        </span>
      </div>

      <div className="bg-[#03140C]/90 p-3 border border-emerald-500/30 text-xs">
        <p className="font-bold text-[#F59E0B]">📐 Applied Geometry & Trajectory Goal:</p>
        <p className="text-emerald-100 mt-0.5">{puzzle.prompt}</p>
      </div>

      <div className="relative w-full h-56 bg-[#020B06] border-2 border-[#03140C] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="12" cy="78" r="3.5" fill="#EF4444" stroke="#03140C" strokeWidth="1" />
          <text x="7" y="90" fill="#EF4444" fontSize="3.5" fontWeight="bold" fontFamily="monospace">EMITTER</text>

          <g transform={`translate(${mirrorAX}, ${mirrorAY}) rotate(${angleA - 45})`}>
            <line x1="-7" y1="0" x2="7" y2="0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.5" fill="#FFF" />
          </g>
          <text x={mirrorAX - 6} y={mirrorAY - 4} fill="#F59E0B" fontSize="3" fontFamily="monospace">MIRROR A ({angleA}°)</text>

          <g transform={`translate(${mirrorBX}, ${mirrorBY}) rotate(${angleB - 45})`}>
            <line x1="-7" y1="0" x2="7" y2="0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.5" fill="#FFF" />
          </g>
          <text x={mirrorBX - 6} y={mirrorBY + 7} fill="#F59E0B" fontSize="3" fontFamily="monospace">MIRROR B ({angleB}°)</text>

          <rect 
            x={targetX - 4} 
            y={targetY - 4} 
            width="8" 
            height="8" 
            fill={isHittingTarget ? "#10B981" : "#334155"} 
            stroke={isHittingTarget ? "#10B981" : "#03140C"} 
            strokeWidth="1"
          />
          <text x={targetX - 6} y={targetY - 6} fill={isHittingTarget ? "#10B981" : "#94A3B8"} fontSize="3" fontWeight="bold" fontFamily="monospace">
            SENSOR {isHittingTarget ? "[LOCKED]" : "[OFFLINE]"}
          </text>

          <line x1="12" y1="78" x2={mirrorAX} y2={mirrorAY} stroke="#EF4444" strokeWidth="1.5" opacity="0.9" />

          {Math.abs(angleA - reqA) <= 12 && (
            <line 
              x1={mirrorAX} 
              y1={mirrorAY} 
              x2={mirrorBX} 
              y2={mirrorBY} 
              stroke="#F59E0B" 
              strokeWidth="1.5" 
              strokeDasharray={isHittingTarget ? "none" : "2,2"}
              opacity="0.9" 
            />
          )}

          {isHittingTarget && (
            <line 
              x1={mirrorBX} 
              y1={mirrorBY} 
              x2={targetX} 
              y2={targetY} 
              stroke="#10B981" 
              strokeWidth="2.5" 
              className="animate-pulse"
            />
          )}
        </svg>

        <div className="absolute top-2 right-2 bg-[#020B06]/90 border border-emerald-500/40 px-2 py-1 text-[10px] font-mono text-emerald-300">
          BEAM ALIGNMENT: <span className={isHittingTarget ? "text-[#10B981] font-black" : "text-amber-400"}>
            {isHittingTarget ? "100% (COAXIAL)" : `${Math.max(10, 100 - Math.abs(angleA - reqA) * 2 - Math.abs(angleB - reqB) * 2)}%`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mirror A Controls with Touch-Friendly Step Buttons */}
        <div className="bg-[#03140C] p-3 border border-emerald-900/60 space-y-2 rounded-lg">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#F59E0B] font-bold">Mirror A Angle (θ₁):</span>
            <span className="text-white font-black">{angleA}°</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSolved || angleA <= 0}
              onClick={() => handleAngleAChange(Math.max(0, angleA - 1))}
              className="w-11 h-11 bg-[#0A261B] text-[#F59E0B] border border-[#03140C] flex items-center justify-center font-mono font-black text-sm hover:bg-[#F59E0B] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
              title="Step Mirror A -1°"
              aria-label="Decrease Mirror A angle by 1 degree"
            >
              -1°
            </button>
            <input
              type="range"
              min="0"
              max="180"
              disabled={isSolved}
              value={angleA}
              onChange={(e) => handleAngleAChange(e.target.value)}
              className="w-full accent-[#F59E0B] cursor-pointer touch-none h-6"
            />
            <button
              type="button"
              disabled={isSolved || angleA >= 180}
              onClick={() => handleAngleAChange(Math.min(180, angleA + 1))}
              className="w-11 h-11 bg-[#0A261B] text-[#F59E0B] border border-[#03140C] flex items-center justify-center font-mono font-black text-sm hover:bg-[#F59E0B] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
              title="Step Mirror A +1°"
              aria-label="Increase Mirror A angle by 1 degree"
            >
              +1°
            </button>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0°</span>
            <span>Target: {reqA}°</span>
            <span>180°</span>
          </div>
        </div>

        {/* Mirror B Controls with Touch-Friendly Step Buttons */}
        <div className="bg-[#03140C] p-3 border border-emerald-900/60 space-y-2 rounded-lg">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#F59E0B] font-bold">Mirror B Angle (θ₂):</span>
            <span className="text-white font-black">{angleB}°</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSolved || angleB <= 0}
              onClick={() => handleAngleBChange(Math.max(0, angleB - 1))}
              className="w-11 h-11 bg-[#0A261B] text-[#10B981] border border-[#03140C] flex items-center justify-center font-mono font-black text-sm hover:bg-[#10B981] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
              title="Step Mirror B -1°"
              aria-label="Decrease Mirror B angle by 1 degree"
            >
              -1°
            </button>
            <input
              type="range"
              min="0"
              max="180"
              disabled={isSolved}
              value={angleB}
              onChange={(e) => handleAngleBChange(e.target.value)}
              className="w-full accent-[#10B981] cursor-pointer touch-none h-6"
            />
            <button
              type="button"
              disabled={isSolved || angleB >= 180}
              onClick={() => handleAngleBChange(Math.min(180, angleB + 1))}
              className="w-11 h-11 bg-[#0A261B] text-[#10B981] border border-[#03140C] flex items-center justify-center font-mono font-black text-sm hover:bg-[#10B981] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
              title="Step Mirror B +1°"
              aria-label="Increase Mirror B angle by 1 degree"
            >
              +1°
            </button>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0°</span>
            <span>Target: {reqB}°</span>
            <span>180°</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-3">
          {isSolved ? (
            <>
              <span className="flex items-center space-x-1.5 text-[#10B981] font-black text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>REFRACTION LOCKED</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B] font-game font-black text-xs px-2.5 py-0.5 rounded-full shadow-[2px_3px_6px_rgba(0,0,0,0.3),inset_1px_1px_2px_rgba(254,243,199,0.3),inset_-1px_-1px_2px_rgba(69,26,3,0.5)] animate-pulse">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>+400 XP GAINED</span>
              </span>
            </>
          ) : (
            <span className="text-xs font-mono text-emerald-300">
              {isHittingTarget ? "⚡ Sensor target acquired!" : "Align both mirrors to complete beam"}
            </span>
          )}
        </div>

        <button
          onClick={handleEngageBeam}
          disabled={isSolved}
          className={`px-5 py-2.5 font-black uppercase text-xs border-[2px] border-[#03140C] shadow-[3px_3px_0px_#020C07] transition-all flex items-center space-x-2 ${
            isSolved
              ? 'bg-[#0A3020] text-emerald-300 cursor-default'
              : 'bg-[#F59E0B] text-[#02140D] hover:bg-[#FBBF24] active:translate-x-0.5 hover-sheen'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isSolved ? 'Locked' : 'Engage Laser Beam'}</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(EngineerLaserGrid);
