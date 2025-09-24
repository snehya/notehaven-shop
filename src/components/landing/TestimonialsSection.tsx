/**
 * @fileoverview Testimonials section component for landing page
 * @author NoteMarket Team
 * @created 2024
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { FadeInSection } from '@/components/effects/ParallaxComponents';

/**
 * Individual testimonial interface
 */
interface Testimonial {
  /** Customer name */
  name: string;
  /** Customer role/title */
  role: string;
  /** University/institution */
  university: string;
  /** Testimonial content */
  content: string;
  /** Star rating (1-5) */
  rating: number;
  /** Avatar image URL */
  avatar: string;
}

/**
 * Testimonials section props interface
 */
interface TestimonialsSectionProps {
  /** Custom className for styling */
  className?: string;
}

/**
 * Pre-defined testimonials data
 */
const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    university: "MIT",
    content: "NoteMart saved my GPA! The quality of notes here is incredible, and I even earn money selling my own.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
  },
  {
    name: "Alex Rodriguez",
    role: "Business Student",
    university: "Harvard",
    content: "As a busy student, having access to well-organized notes from top performers is a game-changer.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
  },
  {
    name: "Emily Johnson",
    role: "Pre-Med Student",
    university: "Stanford",
    content: "I've earned over $3,000 selling my biology notes. It's amazing how my study habits can help others!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily"
  }
] as const;

/**
 * Star rating component
 */
const StarRating: React.FC<{ rating: number; className?: string }> = memo(({ rating, className }) => (
  <div className={`flex ${className || ''}`} aria-label={`${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        aria-hidden="true"
      />
    ))}
  </div>
));

StarRating.displayName = 'StarRating';

/**
 * Individual testimonial card component
 */
const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = memo(({ testimonial, index }) => (
  <FadeInSection delay={index * 200}>
    <Card className="shadow-card group hover:shadow-elevated transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-background to-muted/30">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={testimonial.avatar}
              alt={`${testimonial.name}'s avatar`}
              className="w-12 h-12 rounded-full group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-primary transition-colors duration-300">
              {testimonial.name}
            </h3>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            <p className="text-sm text-muted-foreground font-medium">{testimonial.university}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StarRating rating={testimonial.rating} className="mb-4" />
        <blockquote className="text-muted-foreground italic leading-relaxed">
          "{testimonial.content}"
        </blockquote>
      </CardContent>
    </Card>
  </FadeInSection>
));

TestimonialCard.displayName = 'TestimonialCard';

/**
 * Testimonials section component - Displays customer testimonials
 * 
 * Features:
 * - Customer photos and information
 * - Star ratings
 * - Responsive grid layout
 * - Lazy loading for images
 * - Accessible star ratings
 */
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = memo(({ className }) => {
  return (
    <section className={`py-20 relative ${className || ''}`}>
      <div className="container">
        {/* Section Header */}
        <FadeInSection>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-primary">What Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful students who trust NoteMart
            </p>
          </div>
        </FadeInSection>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard 
              key={`${testimonial.name}-${testimonial.university}`} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';