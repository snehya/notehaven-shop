/**
 * @fileoverview useCart hook - Separate hook file for Fast Refresh compatibility
 * @author NoteMarket Team
 * @created 2024
 */

import { useContext } from 'react';
import { CartContext, type CartContextType } from '@/contexts/CartContext';

/**
 * Custom hook to access cart context
 * @returns Cart context with state and actions
 * @throws Error if used outside CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};