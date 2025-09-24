import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useEffect, 
  useCallback, 
  useMemo 
} from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

/**
 * Cart item interface with comprehensive product information
 */
export interface CartItem {
  readonly id: string;
  readonly title: string;
  readonly price: number;
  readonly thumbnail: string;
  readonly seller: string;
  readonly subject: string;
  readonly addedAt: Date;
  quantity?: number; // For future quantity support
}

/**
 * Cart statistics interface
 */
interface CartStats {
  totalItems: number;
  totalPrice: number;
  formattedTotalPrice: string;
  uniqueItems: number;
}

/**
 * Cart state interface
 */
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Cart context type definition with comprehensive cart operations
 */
interface CartContextType extends CartState, CartStats {
  addItem: (item: Omit<CartItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  hasItem: (id: string) => boolean;
  getItem: (id: string) => CartItem | undefined;
  getTotalBySubject: (subject: string) => number;
  clearError: () => void;
}

/**
 * Cart action types for state management
 */
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_ERROR' };

/**
 * Cart state reducer with comprehensive action handling
 */
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false, error: null };
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity if supported
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
        };
        return { ...state, items: updatedItems, error: null };
      }
      
      // Add new item
      return { 
        ...state, 
        items: [...state.items, action.payload], 
        error: null 
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        error: null,
      };
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      return { ...state, items: updatedItems, error: null };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], error: null };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

/**
 * Initial cart state
 */
const initialState: CartState = {
  items: [],
  isLoading: true,
  error: null,
};

/**
 * Cart context instance
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Custom hook to access cart context
 * @throws {Error} When used outside of CartProvider
 * @returns Cart context value
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Cart provider component props
 */
interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * Safely parses cart data from localStorage
 * @param cartData - Raw cart data string
 * @returns Parsed cart items array
 */
const parseCartData = (cartData: string): CartItem[] => {
  try {
    const parsed = JSON.parse(cartData);
    if (!Array.isArray(parsed)) {
      throw new Error('Cart data is not an array');
    }
    
    return parsed.map(item => ({
      ...item,
      addedAt: new Date(item.addedAt || Date.now()),
      quantity: item.quantity || 1,
    }));
  } catch (error) {
    console.warn('Failed to parse cart data from localStorage:', error);
    return [];
  }
};

/**
 * Safely saves cart data to localStorage
 * @param items - Cart items to save
 */
const saveCartData = (items: CartItem[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart data to localStorage:', error);
  }
};

/**
 * Cart provider component that manages cart state and operations
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * Initialize cart from localStorage on mount
   */
  useEffect(() => {
    const initializeCart = (): void => {
      try {
        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
        if (savedCart) {
          const items = parseCartData(savedCart);
          dispatch({ type: 'SET_ITEMS', payload: items });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart data' });
        // Clear potentially corrupted data
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
      }
    };

    initializeCart();
  }, []);

  /**
   * Save cart to localStorage whenever items change
   */
  useEffect(() => {
    if (!state.isLoading) {
      saveCartData(state.items);
    }
  }, [state.items, state.isLoading]);

  /**
   * Add item to cart
   * @param item - Item to add (without addedAt timestamp)
   */
  const addItem = useCallback((item: Omit<CartItem, 'addedAt'>): void => {
    try {
      const cartItem: CartItem = {
        ...item,
        addedAt: new Date(),
        quantity: 1,
      };
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  }, []);

  /**
   * Remove item from cart
   * @param id - ID of item to remove
   */
  const removeItem = useCallback((id: string): void => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  }, []);

  /**
   * Update item quantity
   * @param id - Item ID
   * @param quantity - New quantity
   */
  const updateItemQuantity = useCallback((id: string, quantity: number): void => {
    try {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item quantity' });
    }
  }, [removeItem]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback((): void => {
    try {
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    }
  }, []);

  /**
   * Check if item exists in cart
   * @param id - Item ID to check
   * @returns True if item exists in cart
   */
  const hasItem = useCallback((id: string): boolean => {
    return state.items.some(item => item.id === id);
  }, [state.items]);

  /**
   * Get specific item from cart
   * @param id - Item ID to retrieve
   * @returns Cart item or undefined
   */
  const getItem = useCallback((id: string): CartItem | undefined => {
    return state.items.find(item => item.id === id);
  }, [state.items]);

  /**
   * Get total price for items of a specific subject
   * @param subject - Subject to filter by
   * @returns Total price for subject items
   */
  const getTotalBySubject = useCallback((subject: string): number => {
    return state.items
      .filter(item => item.subject === subject)
      .reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }, [state.items]);

  /**
   * Clear current error
   */
  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  /**
   * Memoized cart statistics to prevent unnecessary recalculations
   */
  const cartStats = useMemo((): CartStats => {
    const totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    return {
      totalItems,
      totalPrice,
      formattedTotalPrice: formatPrice(totalPrice),
      uniqueItems: state.items.length,
    };
  }, [state.items]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo((): CartContextType => ({
    ...state,
    ...cartStats,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    hasItem,
    getItem,
    getTotalBySubject,
    clearError,
  }), [
    state,
    cartStats,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    hasItem,
    getItem,
    getTotalBySubject,
    clearError,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};