// Application Constants

export const APP_CONFIG = {
  name: 'NoteMart',
  description: 'Premium Study Notes Marketplace',
  version: '1.0.0',
  author: 'NoteMart Team',
  supportEmail: 'support@notemart.com',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
  defaultAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
} as const;

export const ROUTES = {
  HOME: '/',
  NOTES: '/notes',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CART: '/cart',
  PROFILE: '/profile',
  SPEECH_DEMO: '/speech-demo',
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_LISTINGS: '/seller/listings',
  SELLER_UPLOAD: '/seller/listings/new',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MODERATION: '/admin/moderation',
  ADMIN_USERS: '/admin/users',
} as const;

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Business',
  'Economics',
  'Psychology',
  'Literature',
  'History',
  'Philosophy',
  'Medicine',
  'Law',
  'Art',
  'Other'
] as const;

export const GRADE_LEVELS = [
  'High School',
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Graduate',
  'PhD'
] as const;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' }
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 10, label: 'Under $10' },
  { min: 10, max: 25, label: '$10 - $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: Infinity, label: 'Over $100' }
] as const;

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin'
} as const;

export const NOTE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50
} as const;

export const API_ENDPOINTS = {
  NOTES: '/api/notes',
  USERS: '/api/users',
  AUTH: '/api/auth',
  CART: '/api/cart',
  PAYMENTS: '/api/payments',
  UPLOADS: '/api/uploads'
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER: 'notemart_user',
  CART: 'notemart_cart',
  THEME: 'notemart_theme',
  SEARCH_HISTORY: 'notemart_search_history'
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    SIGNUP: 'Account created successfully!',
    CART_ADD: 'Item added to cart!',
    CART_REMOVE: 'Item removed from cart!',
    NOTE_UPLOAD: 'Note uploaded successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!'
  },
  ERROR: {
    LOGIN_FAILED: 'Invalid email or password',
    SIGNUP_FAILED: 'Failed to create account',
    NETWORK_ERROR: 'Network error. Please try again.',
    UPLOAD_FAILED: 'Failed to upload file',
    UNAUTHORIZED: 'You must be logged in to perform this action',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type'
  }
} as const;