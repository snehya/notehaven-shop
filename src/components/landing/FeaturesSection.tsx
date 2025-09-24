/**
 * @fileoverview Features section component for landing page
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Upload, Shield, Download } from 'lucide-react';
import { FadeInSection } from '@/components/effects/ParallaxComponents';

/**
 * Individual feature interface
 */
interface Feature {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * Features section props interface
 */
interface FeaturesSectionProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Pre-defined features data
 */
const FEATURES: readonly Feature[] = [
  {
    icon: <Search className="h-6 w-6" aria-hidden="true" />,
    title: "Discover Quality Notes",
    description: "Browse thousands of high-quality study materials from top students worldwide."
  },
  {
    icon: <Upload className="h-6 w-6" aria-hidden="true" />,
    title: "Earn from Your Notes",
    description: "Turn your study materials into income by selling to fellow students."
  },
  {
    icon: <Shield className="h-6 w-6" aria-hidden="true" />,
    title: "Quality Guaranteed",
    description: "All notes are moderated by our team to ensure high academic standards."
  },
  {
    icon: <Download className="h-6 w-6" aria-hidden="true" />,
    title: "Instant Access",
    description: "Get immediate access to purchased notes with high-quality PDF downloads."
  }
] as const;

/**
 * Individual feature card component
 */
const FeatureCard: React.FC<{ feature: Feature; index: number }> = memo(({ feature, index }) => (
  <FadeInSection delay={index * 200}>
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 group hover:scale-105 border-0 bg-gradient-to-br from-background to-muted/50">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  </FadeInSection>
));

FeatureCard.displayName = 'FeatureCard';

/**
 * Features section component - Showcases platform key features
 * 
 * Features:
 * - Responsive grid layout (1-2-4 columns)
 * - Interactive hover effects
 * - Icon and gradient styling
 * - Memoized for performance
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = memo(({ className }) => {
  return (
    <section className={`py-20 relative ${className || ''}`}>
      <div className="container">
        {/* Section Header */}
        <FadeInSection>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-primary">Why Choose NoteMart?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built the perfect platform for academic collaboration and success
            </p>
          </div>
        </FadeInSection>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';