/**
 * @fileoverview Header component - Main navigation bar with search functionality
 * @author NoteMarket Team
 * @created 2024
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  ShoppingCart, 
  User, 
  BookOpen, 
  Settings, 
  LogOut,
  Upload,
  BarChart3,
  Mic,
  MicOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

/**
 * Header search form props interface
 */
interface SearchFormProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * User dropdown menu props interface
 */
interface UserMenuProps {
  user: UserType | null;
  onLogout: () => void;
}

/**
 * Search form component - Optimized search functionality with voice input
 */
const SearchForm: React.FC<SearchFormProps> = memo(({ 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit 
}) => {
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const [hasUsedVoice, setHasUsedVoice] = useState(() => {
    // Check if user has used voice search before
    return localStorage.getItem('notemart_voice_search_used') === 'true';
  });

  const {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    onResult: (result) => {
      onSearchChange(result);
      // Mark voice search as used
      if (!hasUsedVoice) {
        localStorage.setItem('notemart_voice_search_used', 'true');
        setHasUsedVoice(true);
      }
      // Auto-submit search after voice input completes
      setTimeout(() => {
        // Create a proper form submission event
        const form = document.querySelector('form[data-search-form]') as HTMLFormElement;
        if (form) {
          const event = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(event);
        }
      }, 500);
    },
    onError: (errorMsg) => {
      console.error('Voice search error:', errorMsg);
      setShowVoiceHint(false);
    },
    silenceTimeout: 3000
  });

  // Show voice hint for new users
  React.useEffect(() => {
    if (isSupported && !hasUsedVoice) {
      const timer = setTimeout(() => {
        setShowVoiceHint(true);
        setTimeout(() => setShowVoiceHint(false), 3000); // Hide after 3 seconds
      }, 2000); // Show after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isSupported, hasUsedVoice]);

  // Update search query with real-time transcript
  React.useEffect(() => {
    if (transcript && isListening) {
      onSearchChange(transcript);
    }
  }, [transcript, isListening, onSearchChange]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setShowVoiceHint(false);
    } else {
      resetTranscript();
      startListening();
      setShowVoiceHint(false); // Hide hint when user clicks
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-8">
      <form onSubmit={onSearchSubmit} className="relative" data-search-form>
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" 
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={isListening ? "🎤 Listening for voice input..." : "Search for notes, subjects, topics... (Try the mic!)"}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-10 pr-12 py-2 w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20",
            isListening && "ring-2 ring-red-400 bg-red-50/50 border-red-300"
          )}
          aria-label="Search notes"
          autoComplete="off"
        />
        
        {/* Voice Search Button */}
        {isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMicClick}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-all duration-200 rounded-full flex items-center justify-center",
              isListening 
                ? "text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
            aria-label={isListening ? "Stop voice search" : "Start voice search"}
            title={isListening ? "Click to stop listening" : "Click to search by voice"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}
        
        {/* First-time user hint */}
        {isSupported && showVoiceHint && !isListening && (
          <div className="absolute -top-12 right-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-lg shadow-lg animate-bounce">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
            </div>
            Try voice search! 🎤
          </div>
        )}
        
        {/* Voice feedback indicator */}
        {isListening && (
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center">
            <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce-delay-1"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce-delay-2"></div>
              </div>
              <span>Listening... Speak now</span>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center">
            <div className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full shadow-sm border border-red-200">
              {error}
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

SearchForm.displayName = 'SearchForm';

/**
 * User dropdown menu component - Handles authentication and role-based navigation
 */
const UserMenu: React.FC<UserMenuProps> = memo(({ user, onLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button 
        variant="ghost" 
        className="relative h-8 w-8 rounded-full"
        aria-label={`User menu for ${user.name}`}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-1 leading-none">
          <p className="font-medium">{user.name}</p>
          <p className="w-[200px] truncate text-sm text-muted-foreground">
            {user.email}
          </p>
          <Badge variant="secondary" className="w-fit text-xs">
            {user.role}
          </Badge>
        </div>
      </div>
      <DropdownMenuSeparator />
      
      <DropdownMenuItem asChild>
        <Link to={user.role === 'seller' ? ROUTES.SELLER_PROFILE : ROUTES.PROFILE}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>

      {/* Seller Menu Items - Only for sellers */}
      {user.role === 'seller' && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.SELLER_DASHBOARD}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Seller Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.SELLER_LISTINGS}>
              <BookOpen className="mr-2 h-4 w-4" />
              My Listings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.SELLER_UPLOAD}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Note
            </Link>
          </DropdownMenuItem>
        </>
      )}

      {/* Admin Menu Items */}
      {user.role === 'admin' && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.ADMIN_DASHBOARD}>
              <Settings className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.ADMIN_MODERATION}>
              <BookOpen className="mr-2 h-4 w-4" />
              Moderation Queue
            </Link>
          </DropdownMenuItem>
        </>
      )}

      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
));

UserMenu.displayName = 'UserMenu';

/**
 * Main Header component - Application navigation and search
 */
export const Header: React.FC = memo(() => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Check if current route is active
   */
  const isActive = useCallback((path: string): boolean => 
    location.pathname === path, [location.pathname]
  );

  /**
   * Handle search form submission
   */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`${ROUTES.NOTES}?search=${encodeURIComponent(trimmedQuery)}`);
    }
  }, [searchQuery, navigate]);

  /**
   * Handle search input changes
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  /**
   * Memoized cart badge - only re-render when totalItems changes
   */
  const cartBadge = useMemo(() => 
    totalItems > 0 ? (
      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
        {totalItems > 99 ? '99+' : totalItems}
      </Badge>
    ) : null,
    [totalItems]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to={ROUTES.HOME} 
          className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          aria-label="NoteMart - Go to homepage"
        >
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl text-gradient-primary">NoteMart</span>
        </Link>

        {/* Search Bar */}
        <SearchForm
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearch}
        />

        {/* Navigation & User Actions */}
        <nav className="flex items-center space-x-4" aria-label="Main navigation">
          {/* Browse Notes */}
          <Button
            variant={isActive(ROUTES.NOTES) ? 'default' : 'ghost'}
            asChild
          >
            <Link to={ROUTES.NOTES}>Browse Notes</Link>
          </Button>

          {/* Cart */}
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="relative"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <Link to={ROUTES.CART}>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartBadge}
            </Link>
          </Button>

          {/* User Menu or Auth Buttons */}
          {isAuthenticated && user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link to={ROUTES.SIGNUP}>Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';