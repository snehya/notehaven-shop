/**
 * @fileoverview How It Works section component for landing page
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

/**
 * Process step interface
 */
interface ProcessStep {
  /** Step number */
  number: string;
  /** Step title */
  title: string;
  /** List of features/benefits */
  features: string[];
  /** Call-to-action button text */
  buttonText: string;
  /** Button destination route */
  buttonRoute: string;
  /** Button variant */
  buttonVariant?: 'default' | 'outline';
}

/**
 * How It Works section props interface
 */
interface HowItWorksSectionProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Pre-defined process steps
 */
const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: "1",
    title: "For Buyers",
    features: [
      "Browse our extensive library",
      "Preview notes before purchasing",
      "Download instantly after payment"
    ],
    buttonText: "Start Browsing",
    buttonRoute: ROUTES.NOTES,
    buttonVariant: "default"
  },
  {
    number: "2",
    title: "For Sellers",
    features: [
      "Upload your quality notes",
      "Set your own prices",
      "Earn money with each sale"
    ],
    buttonText: "Start Selling",
    buttonRoute: ROUTES.SIGNUP,
    buttonVariant: "default"
  },
  {
    number: "3",
    title: "Quality First",
    features: [
      "Expert moderation team",
      "Student rating system",
      "Money-back guarantee"
    ],
    buttonText: "Learn More",
    buttonRoute: "/about",
    buttonVariant: "outline"
  }
] as const;

/**
 * Individual process step card component
 */
const ProcessStepCard: React.FC<{ step: ProcessStep; index: number }> = memo(({ step }) => (
  <Card className="shadow-card">
    <CardHeader className="text-center">
      <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
        {step.number}
      </div>
      <CardTitle className="text-2xl">{step.title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Features List */}
      <div className="space-y-3">
        {step.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      {/* Call-to-Action Button */}
      <Button 
        className="w-full" 
        variant={step.buttonVariant as "default" | "outline"} 
        asChild
      >
        <Link to={step.buttonRoute} aria-label={`${step.buttonText} - ${step.title}`}>
          {step.buttonText}
        </Link>
      </Button>
    </CardContent>
  </Card>
));

ProcessStepCard.displayName = 'ProcessStepCard';

/**
 * How It Works section component - Explains the platform process
 * 
 * Features:
 * - Three-step process explanation
 * - Features checklist for each step
 * - Call-to-action buttons
 * - Responsive grid layout
 */
export const HowItWorksSection: React.FC<HowItWorksSectionProps> = memo(({ className }) => {
  return (
    <section className={`py-20 bg-muted/30 ${className || ''}`}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-primary">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>
        
        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStepCard 
              key={step.title} 
              step={step} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorksSection.displayName = 'HowItWorksSection';