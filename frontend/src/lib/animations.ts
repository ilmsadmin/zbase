'use client';

import { useEffect, useState, useRef } from 'react';

// Simple hook to detect if element is in viewport for animations
export function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once element is in view, stop observing
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // When 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, isInView };
}

// Animation classes for elements entering view
export const fadeInClasses = {
  hidden: 'opacity-0 translate-y-10',
  visible: 'opacity-100 translate-y-0 transition-all duration-1000 ease-out',
};

export const fadeInFromLeftClasses = {
  hidden: 'opacity-0 -translate-x-20',
  visible: 'opacity-100 translate-x-0 transition-all duration-1000 ease-out',
};

export const fadeInFromRightClasses = {
  hidden: 'opacity-0 translate-x-20',
  visible: 'opacity-100 translate-x-0 transition-all duration-1000 ease-out',
};

export const scaleInClasses = {
  hidden: 'opacity-0 scale-95',
  visible: 'opacity-100 scale-100 transition-all duration-1000 ease-out',
};
