/**
 * @fileoverview Parallax effect hook for scroll-based animations
 * @author NoteMarket Team
 * @created 2024
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Parallax configuration interface
 */
interface ParallaxConfig {
  /** Speed multiplier for parallax effect (0-1, where 0.5 = half speed) */
  speed?: number;
  /** Whether to enable the parallax effect */
  enabled?: boolean;
  /** Offset from top before parallax starts */
  offset?: number;
}

/**
 * Custom hook for parallax scroll effects
 * 
 * @param config - Parallax configuration options
 * @returns Transform style for parallax effect
 */
export const useParallax = (config: ParallaxConfig = {}) => {
  const { speed = 0.5, enabled = true, offset = 0 } = config;
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (!enabled) return;
    setScrollY(window.scrollY);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [handleScroll, enabled]);

  const transform = enabled 
    ? `translateY(${(scrollY - offset) * speed}px)` 
    : 'none';

  return { transform, scrollY };
};

/**
 * Custom hook for fade-in scroll animations
 * 
 * @param threshold - Intersection threshold (0-1)
 * @returns Animation styles and ref
 */
export const useScrollFadeIn = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element, threshold]);

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
  };

  return { style, ref: setElement, isVisible };
};