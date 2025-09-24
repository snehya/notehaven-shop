/**
 * @fileoverview Call-to-Action section component for landing page
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ParallaxBackground, FadeInSection } from '@/components/effects/ParallaxComponents';

/**
 * CTA section props interface
 */
interface CTASectionProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Call-to-Action section component - Final conversion section
 * 
 * Features:
 * - Parallax background effects
 * - Gradient background with animated elements
 * - Primary and secondary CTA buttons
 * - Compelling headline and description
 * - Responsive button layout
 */
export const CTASection: React.FC<CTASectionProps> = memo(({ className }) => {
  return (
    <section className={`relative overflow-hidden ${className || ''}`}>
      <ParallaxBackground
        speed={0.2}
        className="bg-gradient-primary text-white"
        minHeight="auto"
      >
        <div className="container text-center space-y-8 py-20 relative z-10">
          {/* Main Headline */}
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Studies?</h2>
          </FadeInSection>
          
          {/* Supporting Text */}
          <FadeInSection delay={200}>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join the largest community of students sharing knowledge and earning together.
            </p>
          </FadeInSection>
          
          {/* Call-to-Action Buttons */}
          <FadeInSection delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary-light transform hover:scale-105 transition-all duration-200" 
                asChild
              >
                <Link to={ROUTES.SIGNUP} aria-label="Get started with a free account">
                  Get Started Free
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-white-transparent transform hover:scale-105 transition-all duration-200" 
                asChild
              >
                <Link to={ROUTES.NOTES} aria-label="Browse available study notes">
                  Browse Notes
                </Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </ParallaxBackground>
    </section>
  );
});

CTASection.displayName = 'CTASection';