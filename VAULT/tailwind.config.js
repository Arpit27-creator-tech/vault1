/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        game: ['"Chakra Petch"', 'sans-serif'],
        display: ['"Chakra Petch"', '"Orbitron"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        ink: '#03140C',
        forestDark: '#06120E',
        forestDeep: '#081E15',
        forestCard: '#0B2A1F',
        forestEmerald: '#10B981',
        forestMint: '#34D399',
        mintText: '#6EE7B7',
        bodyText: '#CFE8DC',
        sunGold: '#FBBF24',
        sunAmber: '#F59E0B',
        sunOrange: '#FB923C',
        roleCyan: '#22D3EE',
        roleAmber: '#FBBF24',
        roleLime: '#A3E635',
        roleViolet: '#C084FC',
        flowerCoral: '#EF4444',
        woodOak: '#D97706'
      },
      boxShadow: {
        'clay-card': '12px 16px 32px rgba(0, 0, 0, 0.45), inset 3px 3px 6px rgba(255, 255, 255, 0.14), inset -4px -4px 10px rgba(0, 0, 0, 0.55)',
        'clay-panel': '16px 24px 44px rgba(0, 0, 0, 0.55), inset 3px 3px 6px rgba(255, 255, 255, 0.12), inset -5px -5px 12px rgba(0, 0, 0, 0.6)',
        'clay-btn': '4px 6px 14px rgba(0, 0, 0, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.25), inset -3px -3px 6px rgba(0, 0, 0, 0.5)',
        'clay-btn-active': '1px 2px 5px rgba(0, 0, 0, 0.25), inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -1px -1px 3px rgba(255, 255, 255, 0.1)',
        'clay-input': 'inset 3px 3px 6px rgba(0, 0, 0, 0.65), inset -2px -2px 4px rgba(255, 255, 255, 0.06)',
        'clay-badge': '2px 3px 6px rgba(0, 0, 0, 0.25), inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.2), inset -2px -2px 4px rgba(0, 0, 0, 0.45)',
        'clay-emerald': '6px 8px 18px rgba(2, 30, 20, 0.45), inset 2px 2px 4px rgba(110, 231, 183, 0.3), inset -3px -3px 6px rgba(1, 24, 15, 0.6)',
        'clay-amber': '6px 8px 18px rgba(30, 14, 2, 0.45), inset 2px 2px 4px rgba(252, 211, 77, 0.3), inset -3px -3px 6px rgba(24, 8, 2, 0.6)',
        'clay-coral': '6px 8px 18px rgba(30, 4, 8, 0.45), inset 2px 2px 4px rgba(252, 165, 165, 0.3), inset -3px -3px 6px rgba(30, 4, 8, 0.6)',
        'clay-cyan': '6px 8px 18px rgba(2, 20, 32, 0.45), inset 2px 2px 4px rgba(125, 211, 252, 0.3), inset -3px -3px 6px rgba(2, 20, 32, 0.6)',
        'clay-purple': '6px 8px 18px rgba(24, 6, 36, 0.45), inset 2px 2px 4px rgba(216, 180, 254, 0.3), inset -3px -3px 6px rgba(24, 6, 36, 0.6)',
        'neo-sm': '3px 4px 10px rgba(0, 0, 0, 0.35), inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.15), inset -2px -2px 5px rgba(0, 0, 0, 0.45)',
        'neo': '5px 7px 16px rgba(0, 0, 0, 0.4), inset 2px 2px 4px rgba(255, 255, 255, 0.16), inset -3px -3px 7px rgba(0, 0, 0, 0.5)',
        'neo-md': '8px 12px 24px rgba(0, 0, 0, 0.45), inset 2.5px 2.5px 5px rgba(255, 255, 255, 0.16), inset -3.5px -3.5px 8px rgba(0, 0, 0, 0.55)',
        'neo-lg': '12px 18px 36px rgba(0, 0, 0, 0.5), inset 3px 3px 6px rgba(255, 255, 255, 0.18), inset -4px -4px 10px rgba(0, 0, 0, 0.6)',
        'neo-xl': '16px 24px 48px rgba(0, 0, 0, 0.55), inset 3.5px 3.5px 7px rgba(255, 255, 255, 0.2), inset -5px -5px 12px rgba(0, 0, 0, 0.65)',
        'neo-emerald': '6px 8px 18px rgba(2, 30, 20, 0.45), inset 2px 2px 4px rgba(110, 231, 183, 0.3), inset -3px -3px 6px rgba(1, 24, 15, 0.6)',
        'neo-gold': '6px 8px 18px rgba(30, 14, 2, 0.45), inset 2px 2px 4px rgba(252, 211, 77, 0.3), inset -3px -3px 6px rgba(24, 8, 2, 0.6)',
        'neo-coral': '6px 8px 18px rgba(30, 4, 8, 0.45), inset 2px 2px 4px rgba(252, 165, 165, 0.3), inset -3px -3px 6px rgba(30, 4, 8, 0.6)'
      }
    },
  },
  plugins: [],
}
