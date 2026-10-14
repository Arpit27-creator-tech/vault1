import React, { useState, useEffect } from 'react';
import { FlaskConical, Plus, Minus, CheckCircle2, AlertTriangle, Sparkles, Thermometer, Droplets } from 'lucide-react';
import { heistAudio } from './HeistAudioEngine';

function ScientistLab({ puzzle, onSolved, onFail, isSolved }) {
  const [reagents, setReagents] = useState([]);
  const [ph, setPh] = useState(6.0);
  const [isReacting, setIsReacting] = useState(false);

  useEffect(() => {
    if (puzzle?.reagents) {
      setReagents(puzzle.reagents.map(r => ({ ...r })));
      setPh(6.0);
      setIsReacting(false);
    }
  }, [puzzle]);

  const handleAdjustCoeff = (index, delta) => {
    heistAudio.playKeyClick();
    setReagents(prev => {
      const updated = [...prev];
      const newCoeff = Math.min(updated[index].max || 5, Math.max(updated[index].min || 1, updated[index].currentCoeff + delta));
      updated[index].currentCoeff = newCoeff;
      return updated;
    });
  };

  const handleAdjustPh = (delta) => {
    heistAudio.playKeyClick();
    setPh(prev => Math.min(14.0, Math.max(1.0, Number((prev + delta).toFixed(1)))));
  };

  const handleSynthesize = () => {
    heistAudio.playChemicalBubble();
    setIsReacting(true);

    setTimeout(() => {
      try {
        const allMatched = reagents.every(r => r.currentCoeff === r.requiredCoeff);
        const phOk = Math.abs(ph - (puzzle.targetPh || 7.0)) <= 0.8;

        if (allMatched && phOk) {
          heistAudio.playSuccessChime();
          onSolved('scientist', puzzle.clueRevealed);
        } else {
          heistAudio.playAlarmSiren();
          if (!allMatched) {
            onFail('scientist', 'Reaction stoichiometry unbalanced! Unstable residue detected.');
          } else {
            onFail('scientist', 'pH buffer out of tolerance range for dissolution.');
          }
        }
      } finally {
        setIsReacting(false);
      }
    }, 600);
  };

  return (
    <div className="forest-card p-5 sm:p-6 space-y-4 font-sans text-sm border-[3px] border-[#03140C] bg-[#051811]/90 shadow-[6px_6px_0px_#020C07]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#03140C] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#0EA5E9] animate-pulse"></div>
          <span className="text-xs font-black uppercase text-[#0EA5E9] tracking-wider flex items-center space-x-1 font-mono">
            <FlaskConical className="w-4 h-4 text-[#0EA5E9]" />
            <span>THE SCIENTIST COCKPIT — {puzzle.title}</span>
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#10B981] bg-[#03140C] px-2 py-0.5 border border-[#10B981]/40 font-mono">
          DISCIPLINE: {puzzle.discipline}
        </span>
      </div>

      <div className="bg-[#03140C]/90 p-3 border border-emerald-500/30 text-xs">
        <p className="font-bold text-[#0EA5E9]">🧪 Chemical Stoichiometry & Synthesis Goal:</p>
        <p className="text-emerald-100 mt-0.5">{puzzle.prompt}</p>
      </div>

      <div className="bg-[#020B06] p-4 border-2 border-[#03140C] text-center space-y-2 rounded-lg">
        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
          Target Reaction Formulation
        </span>
        <p className="text-base sm:text-lg font-mono font-black text-[#F59E0B]">
          {puzzle.equation}
        </p>
      </div>

      <div className="space-y-2.5">
        <span className="text-xs font-mono font-bold text-emerald-300">Adjust Reagent Molar Quantities:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reagents.map((r, idx) => (
            <div key={idx} className="bg-[#03140C] p-3 border border-emerald-900/60 flex items-center justify-between rounded-lg">
              <div>
                <p className="text-xs font-bold text-[#F0FDF4]">{r.name}</p>
                <span className="text-[10px] font-mono text-emerald-400">Moles: {r.currentCoeff}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <button
                  disabled={isSolved || r.currentCoeff <= (r.min || 1)}
                  onClick={() => handleAdjustCoeff(idx, -1)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#0A261B] text-emerald-200 border border-[#03140C] flex items-center justify-center font-black hover:bg-[#10B981] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation shadow-sm stepper-btn"
                  title="Decrease Moles"
                  aria-label={`Decrease moles for ${r.name}`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-7 text-center font-mono font-black text-base text-[#F59E0B]">
                  {r.currentCoeff}
                </span>
                <button
                  disabled={isSolved || r.currentCoeff >= (r.max || 5)}
                  onClick={() => handleAdjustCoeff(idx, 1)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-[#0A261B] text-emerald-200 border border-[#03140C] flex items-center justify-center font-black hover:bg-[#10B981] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation shadow-sm stepper-btn"
                  title="Increase Moles"
                  aria-label={`Increase moles for ${r.name}`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#03140C] p-3 border border-emerald-900/60 space-y-2 rounded-lg">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#0EA5E9] font-bold flex items-center space-x-1">
            <Droplets className="w-3.5 h-3.5" />
            <span>pH Solution Buffer:</span>
          </span>
          <span className="text-white font-black">{ph.toFixed(1)} pH</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSolved || ph <= 1.0}
            onClick={() => handleAdjustPh(-0.1)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#0A261B] text-[#0EA5E9] border border-[#03140C] flex items-center justify-center font-mono font-black text-xs hover:bg-[#0EA5E9] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
            title="Step pH -0.1"
            aria-label="Decrease pH buffer by 0.1"
          >
            -0.1
          </button>
          <input
            type="range"
            min="1.0"
            max="14.0"
            step="0.1"
            disabled={isSolved}
            value={ph}
            onChange={(e) => setPh(parseFloat(e.target.value))}
            className="w-full accent-[#0EA5E9] cursor-pointer touch-none h-6"
          />
          <button
            type="button"
            disabled={isSolved || ph >= 14.0}
            onClick={() => handleAdjustPh(0.1)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#0A261B] text-[#0EA5E9] border border-[#03140C] flex items-center justify-center font-mono font-black text-xs hover:bg-[#0EA5E9] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
            title="Step pH +0.1"
            aria-label="Increase pH buffer by 0.1"
          >
            +0.1
          </button>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Acidic (1.0)</span>
          <span className="text-[#F59E0B]">Target: {puzzle.targetPh || 7.0} pH</span>
          <span>Basic (14.0)</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-3">
          {isSolved ? (
            <>
              <span className="flex items-center space-x-1.5 text-[#10B981] font-black text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>REAGENT SYNTHESIZED</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B] font-game font-black text-xs px-2.5 py-0.5 rounded-full shadow-[2px_3px_6px_rgba(0,0,0,0.3),inset_1px_1px_2px_rgba(254,243,199,0.3),inset_-1px_-1px_2px_rgba(69,26,3,0.5)] animate-pulse">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>+400 XP GAINED</span>
              </span>
            </>
          ) : (
            <span className="text-xs font-mono text-emerald-300">
              {isReacting ? "Bubbling reaction in progress..." : "Balance all reagents to dissolve hinge"}
            </span>
          )}
        </div>

        <button
          onClick={handleSynthesize}
          disabled={isSolved || isReacting}
          className={`px-5 py-2.5 font-black uppercase text-xs border-[2px] border-[#03140C] shadow-[3px_3px_0px_#020C07] transition-all flex items-center space-x-2 ${
            isSolved
              ? 'bg-[#0A3020] text-emerald-300 cursor-default'
              : 'bg-[#0EA5E9] text-[#02140D] hover:bg-[#38BDF8] active:translate-x-0.5 hover-sheen'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{isReacting ? 'Synthesizing...' : isSolved ? 'Compound Ready' : 'Synthesize Reagent'}</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(ScientistLab);
