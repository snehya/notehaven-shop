/**
 * @fileoverview Landing page - Main marketing page with features and testimonials
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { SEO } from '@/components/common/SEO';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection
} from '@/components/landing';

/**
 * Landing page props interface
 */
interface LandingPageProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Landing page component - Main marketing page for NoteMarket
 * 
 * Features:
 * - SEO optimization with meta tags
 * - Modular section components
 * - Responsive design
 * - Performance optimization with memo
 * - Clear component separation
 */
export const LandingPage: React.FC<LandingPageProps> = memo(({ className }) => {
  return (
    <>
      {/* SEO Meta Tags */}
      <SEO 
        title="NoteMart - Premium Study Notes Marketplace"
        description="Buy and sell premium study notes, academic materials, and educational resources. Join 50,000+ students worldwide sharing knowledge and earning together."
        keywords={[
          'study notes', 
          'academic materials', 
          'university notes', 
          'college notes', 
          'educational resources', 
          'buy notes', 
          'sell notes'
        ]}
      />

      {/* Main Landing Page Content */}
      <div className={`min-h-screen ${className || ''}`}>
        {/* Hero Section - Main value proposition */}
        <HeroSection />

        {/* Statistics Section - Platform metrics */}
        <StatsSection />

        {/* Features Section - Key platform benefits */}
        <FeaturesSection />

        {/* How It Works Section - Process explanation */}
        <HowItWorksSection />

        {/* Testimonials Section - Social proof */}
        <TestimonialsSection />

        {/* Call-to-Action Section - Final conversion */}
        <CTASection />
      </div>
    </>
  );
});

LandingPage.displayName = 'LandingPage';