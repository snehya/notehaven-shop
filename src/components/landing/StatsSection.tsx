/**
 * @fileoverview Statistics section component for landing page
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { Users, BookOpen, TrendingUp, DollarSign } from 'lucide-react';
import { FadeInSection } from '@/components/effects/ParallaxComponents';

/**
 * Individual statistic interface
 */
interface Statistic {
  /** Display label for the statistic */
  label: string;
  /** Formatted value to display */
  value: string;
  /** Icon component to display */
  icon: React.ReactNode;
}

/**
 * Statistics section props interface
 */
interface StatsSectionProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Pre-defined statistics data
 */
const STATISTICS: readonly Statistic[] = [
  { 
    label: "Active Students", 
    value: "50,000+", 
    icon: <Users className="h-5 w-5" aria-hidden="true" /> 
  },
  { 
    label: "Notes Available", 
    value: "100,000+", 
    icon: <BookOpen className="h-5 w-5" aria-hidden="true" /> 
  },
  { 
    label: "Universities", 
    value: "500+", 
    icon: <TrendingUp className="h-5 w-5" aria-hidden="true" /> 
  },
  { 
    label: "Total Earnings", 
    value: "$2M+", 
    icon: <DollarSign className="h-5 w-5" aria-hidden="true" /> 
  }
] as const;

/**
 * Individual statistic item component
 */
const StatItem: React.FC<{ stat: Statistic; index: number }> = memo(({ stat, index }) => (
  <FadeInSection delay={index * 150}>
    <div className="text-center space-y-2 group hover:scale-105 transition-transform duration-300">
      <div className="flex justify-center text-primary group-hover:text-secondary transition-colors duration-300" aria-hidden="true">
        {stat.icon}
      </div>
      <div className="text-3xl font-bold text-primary" aria-label={`${stat.value} ${stat.label}`}>
        {stat.value}
      </div>
      <div className="text-muted-foreground text-sm">
        {stat.label}
      </div>
    </div>
  </FadeInSection>
));

StatItem.displayName = 'StatItem';

/**
 * Statistics section component - Displays key platform metrics
 * 
 * Features:
 * - Responsive grid layout
 * - Icon and value pairing
 * - Accessible labels and descriptions
 * - Memoized for performance
 */
export const StatsSection: React.FC<StatsSectionProps> = memo(({ className }) => {
  return (
    <section className={`py-16 bg-muted/50 ${className || ''}`}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATISTICS.map((stat, index) => (
            <StatItem 
              key={stat.label} 
              stat={stat} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';