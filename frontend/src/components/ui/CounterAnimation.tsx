'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from '@/lib/animations';

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CounterAnimation({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animate(timestamp);
    };
    
    const animate = (timestamp: number) => {
      const runtime = timestamp - startTime;
      const relativeProgress = runtime / duration;
      
      if (relativeProgress < 1) {
        const currentCount = Math.min(end * relativeProgress, end);
        setCount(currentCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        cancelAnimationFrame(animationFrame);
      }
    };
    
    animationFrame = requestAnimationFrame(startAnimation);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, duration]);
  
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {prefix}
      {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {suffix}
    </div>
  );
}

// For stats that are not numbers (like "24/7")
export function StaticCounter({ value, className = '' }: { value: string; className?: string }) {
  const { ref, isInView } = useInView();
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      className={`opacity-0 ${isInView ? 'opacity-100 transition-opacity duration-1000' : ''} ${className}`}
    >
      {value}
    </div>
  );
}
