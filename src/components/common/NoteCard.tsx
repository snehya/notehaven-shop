import React, { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Download, 
  Eye, 
  ShoppingCart, 
  Clock, 
  FileText,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { formatPrice, formatDate, truncateText, cn } from '@/lib/utils';
import { NOTE_STATUS, ROUTES, TOAST_MESSAGES } from '@/lib/constants';

/**
 * Note seller information interface
 */
export interface NoteSeller {
  readonly id: string;
  readonly name: string;
  readonly avatar?: string;
  readonly rating: number;
  readonly totalSales: number;
}

/**
 * Note status type definition
 */
export type NoteStatus = typeof NOTE_STATUS[keyof typeof NOTE_STATUS];

/**
 * Complete note interface with comprehensive information
 */
export interface Note {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly thumbnail: string;
  readonly subject: string;
  readonly grade?: string;
  readonly university?: string;
  readonly seller: NoteSeller;
  readonly rating: number;
  readonly totalRatings: number;
  readonly downloads: number;
  readonly pages: number;
  readonly uploadedAt: Date;
  readonly status: NoteStatus;
  readonly tags: readonly string[];
}

/**
 * NoteCard component props with comprehensive customization options
 */
interface NoteCardProps {
  /** Note data to display */
  note: Note;
  /** Whether to show the note status badge */
  showStatus?: boolean;
  /** Card size variant */
  size?: 'default' | 'compact' | 'large';
  /** Whether to show the seller information */
  showSeller?: boolean;
  /** Whether to show the action buttons */
  showActions?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Loading state for skeleton display */
  isLoading?: boolean;
  /** Custom click handler */
  onClick?: () => void;
  /** Whether this note is already in cart */
  isInCart?: boolean;
}

/**
 * Status color mapping for different note statuses
 */
const STATUS_COLORS: Record<NoteStatus, string> = {
  [NOTE_STATUS.APPROVED]: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
  [NOTE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100',
  [NOTE_STATUS.REJECTED]: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100',
};

/**
 * Size-specific styling configurations
 */
const SIZE_CONFIGS = {
  compact: {
    card: 'h-auto',
    image: 'aspect-[3/2]',
    title: 'text-xs',
    content: 'p-3',
    footer: 'p-3 pt-0',
  },
  default: {
    card: 'h-[400px]',
    image: 'aspect-[4/3]',
    title: 'text-sm',
    content: 'p-4',
    footer: 'p-4 pt-0',
  },
  large: {
    card: 'h-[480px]',
    image: 'aspect-[16/9]',
    title: 'text-base',
    content: 'p-6',
    footer: 'p-6 pt-0',
  },
} as const;

/**
 * Validates note data for required fields
 * @param note - Note object to validate
 * @returns True if note is valid
 */
const validateNote = (note: Note): boolean => {
  return !!(
    note.id &&
    note.title &&
    note.price >= 0 &&
    note.thumbnail &&
    note.subject &&
    note.seller?.id &&
    note.seller?.name &&
    note.rating >= 0 &&
    note.rating <= 5 &&
    note.totalRatings >= 0 &&
    note.downloads >= 0 &&
    note.pages > 0
  );
};

/**
 * Formats large numbers for display (e.g., 1200 -> 1.2K)
 * @param num - Number to format
 * @returns Formatted string
 */
const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Star rating component for displaying ratings
 */
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = memo(({ 
  rating, 
  size = 'sm' 
}) => {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  return (
    <div className="flex items-center" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      <Star className={cn(sizeClass, 'mr-1 fill-yellow-400 text-yellow-400')} />
      <span className="font-medium">{rating.toFixed(1)}</span>
    </div>
  );
});

StarRating.displayName = 'StarRating';

/**
 * Enhanced NoteCard component with performance optimizations and accessibility
 */
export const NoteCard: React.FC<NoteCardProps> = memo(({
  note,
  showStatus = false,
  size = 'default',
  showSeller = true,
  showActions = true,
  className,
  isLoading = false,
  onClick,
  isInCart: isInCartProp,
}) => {
  const { addItem, hasItem } = useCart();
  const { isAuthenticated } = useAuth();

  // Validate note data
  if (!validateNote(note)) {
    console.warn('Invalid note data provided to NoteCard:', note);
    return (
      <Card className={cn('p-4 border-destructive', className)}>
        <div className="flex items-center space-x-2 text-destructive">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Invalid note data</span>
        </div>
      </Card>
    );
  }

  const config = SIZE_CONFIGS[size];
  const isInCart = isInCartProp ?? hasItem(note.id);

  /**
   * Memoized status color calculation
   */
  const statusColor = useMemo(() => 
    STATUS_COLORS[note.status] || STATUS_COLORS[NOTE_STATUS.PENDING],
    [note.status]
  );

  /**
   * Memoized formatted status text
   */
  const formattedStatus = useMemo(() => 
    note.status.charAt(0).toUpperCase() + note.status.slice(1),
    [note.status]
  );

  /**
   * Memoized card styling classes
   */
  const cardClasses = useMemo(() => cn(
    'note-card transition-all duration-300 hover:shadow-elevated group cursor-pointer',
    config.card,
    'relative overflow-hidden',
    className
  ), [config.card, className]);

  /**
   * Handle adding item to cart with error handling
   */
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: TOAST_MESSAGES.ERROR.UNAUTHORIZED,
        variant: "destructive",
      });
      return;
    }

    if (isInCart) {
      toast({
        title: "Already in Cart",
        description: "This item is already in your cart.",
        variant: "default",
      });
      return;
    }

    try {
      addItem({
        id: note.id,
        title: note.title,
        price: note.price,
        thumbnail: note.thumbnail,
        seller: note.seller.name,
        subject: note.subject,
      });

      toast({
        title: "Added to Cart",
        description: `${truncateText(note.title, 30)} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isInCart, addItem, note]);

  /**
   * Handle card click
   */
  const handleCardClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  /**
   * Render loading skeleton
   */
  if (isLoading) {
    return (
      <Card className={cardClasses}>
        <CardHeader className="p-0">
          <div className={cn('bg-muted animate-pulse rounded-t-lg', config.image)} />
        </CardHeader>
        <CardContent className={config.content}>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </CardContent>
        <CardFooter className={config.footer}>
          <div className="flex space-x-2 w-full">
            <div className="h-8 bg-muted animate-pulse rounded flex-1" />
            <div className="h-8 bg-muted animate-pulse rounded flex-1" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cardClasses} onClick={handleCardClick}>
      <CardHeader className="p-0">
        <Link to={`${ROUTES.NOTES}/${note.id}`} className="block">
          <div className={cn('relative overflow-hidden rounded-t-lg', config.image)}>
            <img
              src={note.thumbnail}
              alt={`${note.title} - ${note.subject} notes`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Status Badge */}
            {showStatus && (
              <Badge 
                className={cn('absolute top-2 right-2 text-xs font-medium', statusColor)}
                aria-label={`Status: ${formattedStatus}`}
              >
                {formattedStatus}
              </Badge>
            )}
            
            {/* Price Tag */}
            <div className="absolute top-2 left-2">
              <span className="price-tag bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold shadow-sm">
                {formatPrice(note.price)}
              </span>
            </div>
            
            {/* Upload Date */}
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-background/80">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(note.uploadedAt)}
              </Badge>
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className={cn(config.content, 'flex-1')}>
        <div className="space-y-3">
          {/* Subject and Grade */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              {note.subject}
            </Badge>
            {note.grade && (
              <Badge variant="outline" className="text-xs">
                {note.grade}
              </Badge>
            )}
          </div>

          {/* Title */}
          <Link to={`${ROUTES.NOTES}/${note.id}`}>
            <h3 className={cn(
              'font-semibold leading-tight hover:text-primary transition-colors line-clamp-2',
              config.title
            )}>
              {note.title}
            </h3>
          </Link>

          {/* University */}
          {note.university && (
            <p className="text-xs text-muted-foreground truncate">
              📍 {note.university}
            </p>
          )}

          {/* Statistics */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <StarRating rating={note.rating} />
              <span className="text-xs">({formatLargeNumber(note.totalRatings)})</span>
              
              <div className="flex items-center" title={`${note.downloads} downloads`}>
                <Download className="w-3 h-3 mr-1" />
                <span>{formatLargeNumber(note.downloads)}</span>
              </div>
              
              <div className="flex items-center" title={`${note.pages} pages`}>
                <FileText className="w-3 h-3 mr-1" />
                <span>{note.pages}p</span>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          {showSeller && (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
              <Avatar className="h-6 w-6">
                <AvatarImage 
                  src={note.seller.avatar} 
                  alt={`${note.seller.name}'s avatar`}
                />
                <AvatarFallback className="text-xs bg-primary/10">
                  {note.seller.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {note.seller.name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <StarRating rating={note.seller.rating} />
                  <span className="ml-2">• {formatLargeNumber(note.seller.totalSales)} sales</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      {showActions && (
        <CardFooter className={config.footer}>
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="flex-1"
            >
              <Link to={`${ROUTES.NOTES}/${note.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="flex-1"
              disabled={isInCart}
              variant={isInCart ? "secondary" : "default"}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInCart ? "In Cart" : "Add to Cart"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
});

NoteCard.displayName = 'NoteCard';