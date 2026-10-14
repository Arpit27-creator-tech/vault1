import React from 'react';

/**
 * Drifting fireflies and ambient luminous particle field.
 * Adds organic life over the darkened forest backdrop without distracting from content.
 */
const FIREFLIES = [
  { id: 1, top: '14%', left: '12%', size: 4, color: '#34D399', duration: '9s', delay: '0s' },
  { id: 2, top: '26%', left: '84%', size: 3, color: '#FBBF24', duration: '12s', delay: '2s' },
  { id: 3, top: '42%', left: '22%', size: 5, color: '#6EE7B7', duration: '11s', delay: '1.5s' },
  { id: 4, top: '68%', left: '78%', size: 3.5, color: '#22D3EE', duration: '14s', delay: '4s' },
  { id: 5, top: '82%', left: '16%', size: 4, color: '#F59E0B', duration: '10s', delay: '3s' },
  { id: 6, top: '20%', left: '48%', size: 3, color: '#34D399', duration: '8.5s', delay: '0.8s' },
  { id: 7, top: '74%', left: '40%', size: 4.5, color: '#A3E635', duration: '13s', delay: '2.5s' },
  { id: 8, top: '36%', left: '92%', size: 3, color: '#6EE7B7', duration: '10.5s', delay: '5s' },
  { id: 9, top: '88%', left: '88%', size: 4, color: '#FBBF24', duration: '12.5s', delay: '1s' },
  { id: 10, top: '10%', left: '72%', size: 3.5, color: '#34D399', duration: '11s', delay: '3.5s' },
  { id: 11, top: '56%', left: '6%', size: 3, color: '#22D3EE', duration: '9.5s', delay: '4.5s' },
  { id: 12, top: '94%', left: '62%', size: 4, color: '#A3E635', duration: '13s', delay: '2s' },
];

export default function FireflyField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      {FIREFLIES.map((f) => (
        <span
          key={f.id}
          className="firefly-particle absolute rounded-full"
          style={{
            top: f.top,
            left: f.left,
            width: `${f.size}px`,
            height: `${f.size}px`,
            backgroundColor: f.color,
            boxShadow: `0 0 10px ${f.color}, 0 0 20px ${f.color}88`,
            animationDuration: f.duration,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}
