import React from 'react';
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
  GraduationCap
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  subject: string;
  grade?: string;
  university?: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalSales: number;
  };
  rating: number;
  totalRatings: number;
  downloads: number;
  pages: number;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
}

interface NoteCardProps {
  note: Note;
  showStatus?: boolean;
  size?: 'default' | 'compact';
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  showStatus = false, 
  size = 'default' 
}) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

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
      description: `${note.title} has been added to your cart.`,
    });
  };

  const cardClassName = size === 'compact' 
    ? "note-card h-auto" 
    : "note-card h-[400px]";

  return (
    <Card className={cardClassName}>
      <CardHeader className="p-0">
        <Link to={`/notes/${note.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
            <img
              src={note.thumbnail}
              alt={note.title}
              className="note-preview w-full h-full object-cover transition-transform duration-300"
            />
            {showStatus && (
              <Badge 
                className={`absolute top-2 right-2 status-${note.status}`}
              >
                {note.status}
              </Badge>
            )}
            <div className="absolute top-2 left-2">
              <span className="price-tag">
                ${note.price.toFixed(2)}
              </span>
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex-1">
        <div className="space-y-2">
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
          <Link to={`/notes/${note.id}`}>
            <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
              {note.title}
            </h3>
          </Link>

          {/* University */}
          {note.university && (
            <p className="text-xs text-muted-foreground">{note.university}</p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{note.rating.toFixed(1)}</span>
                <span className="ml-1">({note.totalRatings})</span>
              </div>
              <div className="flex items-center">
                <Download className="w-3 h-3 mr-1" />
                <span>{note.downloads}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                <span>{note.pages}p</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={note.seller.avatar} />
              <AvatarFallback className="text-xs">
                {note.seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {note.seller.name}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{note.seller.rating.toFixed(1)}</span>
                <span className="ml-1">• {note.seller.totalSales} sales</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/notes/${note.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};