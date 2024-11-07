export const PRODUCT_CATEGORIES = [
  'Elektaroonig',  // Electronics
  'Dharka',        // Clothing
  'Guriga',        // Home
  'Cunto',         // Food
  'Buugaag',       // Books
  'Ciyaaraha',     // Sports
  'Gaadiid',       // Vehicles
  'Kale'           // Others
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SELLER: 'seller'
};

export const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' }
];

// Add more constants as needed 