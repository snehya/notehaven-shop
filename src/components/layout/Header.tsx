import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  DollarSign, 
  Settings, 
  LogOut,
  Upload,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-gradient-primary">NoteMarket</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for notes, subjects, topics..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Navigation & User Actions */}
        <div className="flex items-center space-x-4">
          {/* Browse Notes */}
          <Button
            variant={isActive('/notes') ? 'default' : 'ghost'}
            asChild
          >
            <Link to="/notes">Browse Notes</Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="sm" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu or Auth Buttons */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
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
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                {/* Seller Menu Items */}
                {(user.role === 'seller' || user.role === 'admin') && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/seller/dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Seller Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/seller/listings">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/seller/listings/new">
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
                      <Link to="/admin/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/moderation">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Moderation Queue
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};