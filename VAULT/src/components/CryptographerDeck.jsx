import React, { useState, useEffect } from 'react';
import { Key, Radio, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { heistAudio } from './HeistAudioEngine';

function CryptographerDeck({ puzzle, onSolved, onFail, isSolved }) {
  const [frequency, setFrequency] = useState(88.0);
  const [userDecryption, setUserDecryption] = useState('');
  const [shiftValue, setShiftValue] = useState(0);

  const targetFreq = puzzle.targetFrequency || 142.5;
  const isFreqLocked = Math.abs(frequency - targetFreq) <= 0.8;

  useEffect(() => {
    setUserDecryption('');
    setShiftValue(0);
    setFrequency(88.0);
  }, [puzzle]);

  const handleFrequencyChange = (val) => {
    const f = parseFloat(val);
    setFrequency(f);
    if (Math.random() < 0.3) {
      heistAudio.playRadioSquelch();
    }
  };

  const handleApplyShift = (shift) => {
    heistAudio.playKeyClick();
    setShiftValue(shift);
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const preview = puzzle.ciphertext.split('').map(char => {
      const idx = chars.indexOf(char.toUpperCase());
      if (idx === -1) return char;
      const newIdx = (idx - shift + 26) % 26;
      return chars[newIdx];
    }).join('');
    
    setUserDecryption(preview);
  };

  const handleVerifyDecryption = (e) => {
    e.preventDefault();
    if (!isFreqLocked) {
      heistAudio.playAlarmSiren();
      onFail('cryptographer', 'Radio frequency out of tune! Signal obscured by static.');
      return;
    }

    const cleanInput = userDecryption.trim().toUpperCase();
    const cleanExpected = puzzle.solution.trim().toUpperCase();

    if (cleanInput === cleanExpected) {
      heistAudio.playSuccessChime();
      onSolved('cryptographer', puzzle.clueRevealed);
    } else {
      heistAudio.playAlarmSiren();
      onFail('cryptographer', 'Cipher solution incorrect! Decryption key rejected.');
    }
  };

  return (
    <div className="forest-card p-5 sm:p-6 space-y-4 font-sans text-sm border-[3px] border-[#03140C] bg-[#051811]/90 shadow-[6px_6px_0px_#020C07]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#03140C] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#A855F7] animate-pulse"></div>
          <span className="text-xs font-black uppercase text-[#A855F7] tracking-wider flex items-center space-x-1 font-mono">
            <Key className="w-4 h-4 text-[#A855F7]" />
            <span>THE CRYPTOGRAPHER COCKPIT — {puzzle.title}</span>
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#F59E0B] bg-[#03140C] px-2 py-0.5 border border-[#10B981]/40 font-mono">
          DISCIPLINE: {puzzle.discipline}
        </span>
      </div>

      <div className="bg-[#03140C]/90 p-3 border border-emerald-500/30 text-xs">
        <p className="font-bold text-[#A855F7]">📻 Signal Intercept & Cipher Goal:</p>
        <p className="text-emerald-100 mt-0.5">{puzzle.prompt}</p>
      </div>

      <div className="bg-[#020B06] p-4 border-2 border-[#03140C] space-y-3 rounded-lg">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-emerald-400 flex items-center space-x-1.5 font-bold">
            <Radio className="w-4 h-4 text-[#10B981]" />
            <span>VHF Receiver Frequency:</span>
          </span>
          <span className={`text-base font-black px-2 py-0.5 border ${
            isFreqLocked 
              ? 'bg-[#10B981] text-[#02140D] border-[#10B981]' 
              : 'bg-[#03140C] text-[#F59E0B] border-emerald-800'
          }`}>
            {frequency.toFixed(1)} MHz {isFreqLocked ? "[LOCKED]" : "[SEARCHING]"}
          </span>
        </div>

        {/* Frequency Slider with Touch Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSolved || frequency <= 88.0}
            onClick={() => handleFrequencyChange(Math.max(88.0, Number((frequency - 0.5).toFixed(1))))}
            className="w-11 h-11 bg-[#0A261B] text-[#A855F7] border border-[#03140C] flex items-center justify-center font-mono font-black text-xs hover:bg-[#A855F7] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
            title="Step Frequency -0.5 MHz"
            aria-label="Decrease frequency by 0.5 MHz"
          >
            -0.5
          </button>
          <input
            type="range"
            min="88.0"
            max="160.0"
            step="0.5"
            disabled={isSolved}
            value={frequency}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            className="w-full accent-[#A855F7] cursor-pointer touch-none h-6"
          />
          <button
            type="button"
            disabled={isSolved || frequency >= 160.0}
            onClick={() => handleFrequencyChange(Math.min(160.0, Number((frequency + 0.5).toFixed(1))))}
            className="w-11 h-11 bg-[#0A261B] text-[#A855F7] border border-[#03140C] flex items-center justify-center font-mono font-black text-xs hover:bg-[#A855F7] hover:text-[#02140D] active:scale-95 transition-all touch-manipulation flex-shrink-0 rounded-lg shadow-sm stepper-btn"
            title="Step Frequency +0.5 MHz"
            aria-label="Increase frequency by 0.5 MHz"
          >
            +0.5
          </button>
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>88.0 MHz</span>
          <span className="text-[#F59E0B]">Target Frequency: {targetFreq} MHz</span>
          <span>160.0 MHz</span>
        </div>
      </div>

      <div className="bg-[#03140C] p-4 border border-emerald-900/60 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-emerald-400 font-bold">Intercepted Ciphertext:</span>
          <span className="text-xs bg-[#A855F7]/30 text-[#A855F7] px-2 py-0.5 border border-[#A855F7]/50 font-bold">
            {puzzle.cipherType}
          </span>
        </div>

        <div className="p-3 bg-[#020B06] border border-[#03140C] text-center">
          <p className="font-mono text-xl font-black tracking-widest text-[#F59E0B]">
            {isFreqLocked ? puzzle.ciphertext : "⚡ [STATIC NOISE — TUNE FREQUENCY] ⚡"}
          </p>
        </div>

        {puzzle.cipherType.includes('Caesar') && isFreqLocked && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-emerald-400 mr-1">Shift Dial:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleApplyShift(s)}
                className={`px-2 py-1 text-xs font-mono font-bold border transition-colors keycap-btn ${
                  shiftValue === s 
                    ? 'bg-[#10B981] text-[#02140D] border-[#10B981]' 
                    : 'bg-[#071E14] text-emerald-300 border-[#03140C] hover:bg-[#10B981]/20'
                }`}
              >
                +{s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleVerifyDecryption} className="space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-emerald-300">Decrypted Plaintext Phrase:</label>
          <input
            type="text"
            required
            disabled={isSolved || !isFreqLocked}
            value={userDecryption}
            onChange={(e) => setUserDecryption(e.target.value)}
            placeholder={isFreqLocked ? "Type or verify deciphered solution..." : "Tune frequency to unlock text pad..."}
            className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-[#10B981] font-mono text-sm font-bold focus:border-[#10B981] outline-none uppercase"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center space-x-3">
            {isSolved ? (
              <>
                <span className="flex items-center space-x-1.5 text-[#10B981] font-black text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>CIPHER DECRYPTED</span>
                </span>
                <span className="inline-flex items-center space-x-1 bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B] font-game font-black text-xs px-2.5 py-0.5 rounded-full shadow-[2px_3px_6px_rgba(0,0,0,0.3),inset_1px_1px_2px_rgba(254,243,199,0.3),inset_-1px_-1px_2px_rgba(69,26,3,0.5)] animate-pulse">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                  <span>+400 XP GAINED</span>
                </span>
              </>
            ) : (
              <span className="text-xs font-mono text-emerald-300">
                {isFreqLocked ? "Frequency locked. Verify translation." : "Match radio frequency first."}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSolved || !isFreqLocked}
            className={`px-5 py-2.5 font-black uppercase text-xs border-[2px] border-[#03140C] shadow-[3px_3px_0px_#020C07] transition-all flex items-center space-x-2 ${
              isSolved
                ? 'bg-[#0A3020] text-emerald-300 cursor-default'
                : !isFreqLocked
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                : 'bg-[#A855F7] text-white hover:bg-[#C084FC] active:translate-x-0.5 hover-sheen'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{isSolved ? 'Decrypted' : 'Verify Cipher'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(CryptographerDeck);
