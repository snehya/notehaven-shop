/**
 * @fileoverview Parallax wrapper components for scroll effects
 * @author NoteMarket Team
 * @created 2024
 */

import React, { forwardRef, ReactNode } from 'react';
import { useParallax, useScrollFadeIn } from '@/hooks/useParallax';
import { cn } from '@/lib/utils';

/**
 * Parallax container props interface
 */
interface ParallaxContainerProps {
  /** Child components */
  children: ReactNode;
  /** Parallax speed (0-1) */
  speed?: number;
  /** Custom className */
  className?: string;
  /** Whether parallax is enabled */
  enabled?: boolean;
  /** Scroll offset before effect starts */
  offset?: number;
}

/**
 * Parallax Container Component - Applies parallax effect to children
 */
export const ParallaxContainer = forwardRef<HTMLDivElement, ParallaxContainerProps>(
  ({ children, speed = 0.3, className, enabled = true, offset = 0 }, ref) => {
    const { transform } = useParallax({ speed, enabled, offset });

    return (
      <div
        ref={ref}
        className={cn('will-change-transform', className)}
        style={{ transform }}
      >
        {children}
      </div>
    );
  }
);

ParallaxContainer.displayName = 'ParallaxContainer';

/**
 * Fade in section props interface
 */
interface FadeInSectionProps {
  /** Child components */
  children: ReactNode;
  /** Custom className */
  className?: string;
  /** Intersection threshold */
  threshold?: number;
  /** Animation delay in ms */
  delay?: number;
}

/**
 * Fade In Section Component - Animates children on scroll into view
 */
export const FadeInSection = forwardRef<HTMLDivElement, FadeInSectionProps>(
  ({ children, className, threshold = 0.1, delay = 0 }, ref) => {
    const { style, ref: fadeRef } = useScrollFadeIn(threshold);

    const combinedRef = (node: HTMLDivElement | null) => {
      fadeRef(node);
      if (ref) {
        if (typeof ref === 'function') ref(node);
        else ref.current = node;
      }
    };

    return (
      <div
        ref={combinedRef}
        className={cn('will-change-transform', className)}
        style={{
          ...style,
          transitionDelay: `${delay}ms`
        }}
      >
        {children}
      </div>
    );
  }
);

FadeInSection.displayName = 'FadeInSection';

/**
 * Parallax background props interface
 */
interface ParallaxBackgroundProps {
  /** Background image URL */
  imageUrl?: string;
  /** Background overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Parallax speed */
  speed?: number;
  /** Custom className */
  className?: string;
  /** Child content */
  children?: ReactNode;
  /** Minimum height */
  minHeight?: string;
}

/**
 * Parallax Background Component - Background with parallax effect
 */
export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  imageUrl,
  overlayOpacity = 0.4,
  speed = 0.5,
  className,
  children,
  minHeight = '100vh'
}) => {
  const { transform } = useParallax({ speed, enabled: !!imageUrl });

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ minHeight }}
    >
      {/* Parallax Background Image */}
      {imageUrl && (
        <div
          className="absolute inset-0 w-full h-[120%] bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url(${imageUrl})`,
            transform: `${transform} scale(1.1)`,
            top: '-10%'
          }}
        />
      )}
      
      {/* Overlay */}
      {imageUrl && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};