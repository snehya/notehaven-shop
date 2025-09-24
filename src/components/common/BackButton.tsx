import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  fallbackUrl?: string;
  children?: React.ReactNode;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  variant = 'ghost', 
  size = 'default',
  className = '',
  fallbackUrl = '/',
  children 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to a specific route if no history
      navigate(fallbackUrl);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleBack}
      className={`flex items-center space-x-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {children ? <span>{children}</span> : <span>Back</span>}
    </Button>
  );
};