import React, { useState, useEffect, useRef } from 'react';

/**
 * Counts up smoothly from 0 to the target number when scrolled into view.
 * Supports formatted strings like "4,820+", "18,500+", "98.4%", "4 Classes".
 */
export default function CountUp({ value = '0', duration = 1200, className = '' }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Parse target number, prefix, suffix, and decimals
    const str = String(value);
    const match = str.match(/([^\d.]*)([\d,.]+)([^\d.]*)/);
    
    if (!match) {
      setDisplayValue(str);
      return;
    }

    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const target = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const decimals = isDecimal ? (numStr.split('.')[1] || '').length : 0;

    if (isNaN(target)) {
      setDisplayValue(str);
      return;
    }

    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(str);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            let formattedNumber;
            if (isDecimal) {
              formattedNumber = current.toFixed(decimals);
            } else {
              formattedNumber = Math.round(current).toLocaleString();
            }

            setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(str); // ensure exact target string at completion
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
}
