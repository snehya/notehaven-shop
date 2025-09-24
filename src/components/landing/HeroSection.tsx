/**
 * @fileoverview Hero section component for landing page
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Star, Users } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { ParallaxBackground, ParallaxContainer, FadeInSection } from '@/components/effects/ParallaxComponents';

/**
 * Hero section interface
 */
interface HeroSectionProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Hero section component - Main landing page hero with CTA buttons
 * 
 * Features:
 * - Parallax background effects
 * - Animated floating elements
 * - Fade-in animations on scroll
 * - Primary and secondary call-to-action buttons
 * - Student count badge
 * - Responsive typography
 */
export const HeroSection: React.FC<HeroSectionProps> = memo(({ className }) => {
  return (
    <section className={`relative overflow-hidden ${className || ''}`}>
      {/* Parallax Background */}
      <ParallaxBackground
        speed={0.3}
        className="bg-gradient-hero text-white"
        minHeight="100vh"
      >
        {/* Floating Background Elements */}
        <ParallaxContainer speed={0.1} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        </ParallaxContainer>

        {/* Animated Icons */}
        <ParallaxContainer speed={0.2} className="absolute inset-0 pointer-events-none">
          <BookOpen className="absolute top-32 right-1/4 w-8 h-8 text-white/20 animate-pulse" />
          <Star className="absolute top-60 left-1/3 w-6 h-6 text-secondary/30 animate-bounce" />
          <Users className="absolute bottom-40 right-1/3 w-10 h-10 text-white/15 animate-pulse" />
        </ParallaxContainer>

        {/* Main Content */}
        <div className="relative z-10 container min-h-screen flex items-center py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Student Count Badge */}
            <FadeInSection delay={200}>
              <Badge className="bg-secondary/20 text-secondary-light border-secondary/30 backdrop-blur-sm">
                🎓 Join 50,000+ Students Worldwide
              </Badge>
            </FadeInSection>
            
            {/* Main Heading */}
            <FadeInSection delay={400}>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Your Academic Success,{' '}
                <span className="text-gradient-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-secondary-light">
                  Monetized
                </span>
              </h1>
            </FadeInSection>
            
            {/* Subheading */}
            <FadeInSection delay={600}>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Buy premium study notes from top students or turn your own notes into a profitable side hustle. 
                Quality education materials, fairly priced.
              </p>
            </FadeInSection>
            
            {/* Call-to-Action Buttons */}
            <FadeInSection delay={800}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary-light text-lg px-8 py-3 transform hover:scale-105 transition-all duration-200" 
                  asChild
                >
                  <Link to={ROUTES.NOTES} aria-label="Browse available study notes">
                    Browse Notes
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-white-transparent text-lg px-8 py-3 transform hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link to={ROUTES.SIGNUP} aria-label="Sign up to start selling notes">
                    Start Selling
                  </Link>
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </ParallaxBackground>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';