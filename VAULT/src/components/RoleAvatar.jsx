import React from 'react';
import { Terminal, Zap, FlaskConical, Key, Cpu, Shield, Sparkles } from 'lucide-react';

export const ROLE_DETAILS = {
  hacker: {
    code: 'C-01',
    title: 'Hacker',
    discipline: 'CS & Logic',
    color: '#22D3EE',
    bg: 'rgba(34, 211, 238, 0.15)',
    border: 'rgba(34, 211, 238, 0.45)',
    glow: 'rgba(34, 211, 238, 0.35)',
    icon: Terminal
  },
  engineer: {
    code: 'P-02',
    title: 'Engineer',
    discipline: 'Physics & Optics',
    color: '#FBBF24',
    bg: 'rgba(251, 191, 36, 0.15)',
    border: 'rgba(251, 191, 36, 0.45)',
    glow: 'rgba(251, 191, 36, 0.35)',
    icon: Zap
  },
  scientist: {
    code: 'S-03',
    title: 'Scientist',
    discipline: 'Biochem & Titration',
    color: '#A3E635',
    bg: 'rgba(163, 230, 53, 0.15)',
    border: 'rgba(163, 230, 53, 0.45)',
    glow: 'rgba(163, 230, 53, 0.35)',
    icon: FlaskConical
  },
  crypto: {
    code: 'E-04',
    title: 'Cryptographer',
    discipline: 'Math & Ciphers',
    color: '#C084FC',
    bg: 'rgba(192, 132, 252, 0.15)',
    border: 'rgba(192, 132, 252, 0.45)',
    glow: 'rgba(192, 132, 252, 0.35)',
    icon: Key
  }
};

export function normalizeRoleKey(roleStr = '') {
  const r = String(roleStr).toLowerCase();
  if (r.includes('eng') || r.includes('laser') || r.includes('photon') || r.includes('phys')) return 'engineer';
  if (r.includes('sci') || r.includes('chem') || r.includes('bio') || r.includes('synth') || r.includes('flora')) return 'scientist';
  if (r.includes('crypt') || r.includes('cipher') || r.includes('enigma')) return 'crypto';
  return 'hacker';
}

/**
 * Circular illustrated avatar badge for the 4 specialist roles.
 * Provides distinct personality and clear visual recognition across HUD and leaderboards.
 */
export default function RoleAvatar({ 
  role = 'hacker', 
  size = 'md', 
  showCode = false, 
  showGlow = true,
  className = '' 
}) {
  const key = normalizeRoleKey(role);
  const spec = ROLE_DETAILS[key] || ROLE_DETAILS.hacker;
  const Icon = spec.icon;

  const sizeMap = {
    xs: { outer: 'w-6 h-6', icon: 'w-3 h-3', text: 'text-[8px]' },
    sm: { outer: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-[9px]' },
    md: { outer: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-[10px]' },
    lg: { outer: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xs' }
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* Outer circular glow badge */}
      <div 
        className={`${s.outer} rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
        style={{
          background: `radial-gradient(circle at 35% 30%, ${spec.color}35 0%, #061912 75%, #020C07 100%)`,
          border: `1.5px solid ${spec.border}`,
          boxShadow: showGlow ? `0 0 12px ${spec.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.25)` : 'none'
        }}
      >
        <Icon className={`${s.icon}`} style={{ color: spec.color }} />
      </div>

      {showCode && (
        <span 
          className={`absolute -bottom-1 -right-1 font-mono font-black ${s.text} px-1 rounded-sm border`}
          style={{
            backgroundColor: '#020C07',
            borderColor: spec.border,
            color: spec.color
          }}
        >
          {spec.code}
        </span>
      )}
    </div>
  );
}
