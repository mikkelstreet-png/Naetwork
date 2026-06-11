'use client';
import { useState, useEffect } from 'react';
import type { Dict } from '@/lib/content';

const END_DATE = new Date('2027-01-01T00:00:00');

function calc() {
  const diff = END_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function Countdown({ units }: { units: Dict['hero']['countdownUnits'] }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTime(calc());
    setMounted(true);
    const id = setInterval(() => setTime(calc()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="countdown-widget">
      <p className="countdown-label">Platformen lukker om:</p>
      <div className="countdown-numbers">
        <div className="countdown-item">
          <span className="countdown-num">{time.days}</span>
          <span className="countdown-unit">{units.days}</span>
        </div>
        <div className="countdown-sep">·</div>
        <div className="countdown-item">
          <span className="countdown-num">{time.hours}</span>
          <span className="countdown-unit">{units.hours}</span>
        </div>
        <div className="countdown-sep">·</div>
        <div className="countdown-item">
          <span className="countdown-num">{time.minutes}</span>
          <span className="countdown-unit">{units.minutes}</span>
        </div>
      </div>
    </div>
  );
}
