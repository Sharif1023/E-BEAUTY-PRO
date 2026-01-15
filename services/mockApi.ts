
import { User, Product, Order, OrderStatus, Category } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';

const STORAGE_KEYS = {
  USERS: 'eshop_users',
  PRODUCTS: 'eshop_products',
  ORDERS: 'eshop_orders',
  CURRENT_USER: 'eshop_current_user',
  CATEGORIES: 'eshop_categories'
};

const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Default admin with a password for testing
    const adminUser: any = {
      id: 'admin_1',
      name: 'Admin User',
      email: 'admin@eshop.com',
      role: 'admin',
      password: 'password123'
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
};

initializeStorage();

export const mockApi = {
  // Auth
  login: async (email: string, password?: string): Promise<User | null> => {
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    
    // In a real app we'd check password, here we accept anything for admin email for convenience 
    // unless a specific check is requested.
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },
  register: async (name: string, email: string, password?: string): Promise<User> => {
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: any = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'user',
      password: password || 'password123'
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },
  requestPasswordReset: async (email: string): Promise<boolean> => {
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.some(u => u.email === email);
  },
  resetPassword: async (email: string, newPassword: string): Promise<boolean> => {
    const users: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
      users[index].password = newPassword;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },
  getProductById: async (id: string): Promise<Product | undefined> => {
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return products.find(p => p.id === id);
  },
  saveProduct: async (product: Partial<Product>): Promise<Product> => {
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    if (product.id) {
      const index = products.findIndex(p => p.id === product.id);
      products[index] = { ...products[index], ...product } as Product;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[index];
    } else {
      const newProduct = {
        ...product,
        id: 'p' + Math.random().toString(36).substr(2, 9),
        rating: 4.5,
        reviews: 0,
        image: product.image || 'https://picsum.photos/seed/new/600/600'
      } as Product;
      products.push(newProduct);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return newProduct;
    }
  },
  deleteProduct: async (id: string) => {
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  },

  // Orders
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: OrderStatus.PENDING
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },
  getOrders: async (): Promise<Order[]> => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },
  getOrderById: async (id: string): Promise<Order | undefined> => {
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.find(o => o.id === id);
  },
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.filter(o => o.userId === userId).reverse();
  },
  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  },
  saveCategory: async (category: Partial<Category>): Promise<Category> => {
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    if (category.id) {
      const index = categories.findIndex(c => c.id === category.id);
      categories[index] = { ...categories[index], ...category } as Category;
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return categories[index];
    } else {
      const newCategory = {
        ...category,
        id: 'c' + Math.random().toString(36).substr(2, 9),
        slug: category.name?.toLowerCase().replace(/\s+/g, '-') || 'new-cat',
        image: category.image || 'https://picsum.photos/seed/cat/400/400'
      } as Category;
      categories.push(newCategory);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return newCategory;
    }
  },
  deleteCategory: async (id: string) => {
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  },

  // Stats
  getStats: async () => {
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    
    const revenue = orders.filter(o => o.status !== OrderStatus.CANCELLED).reduce((sum, o) => sum + o.total, 0);
    return {
      revenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
      totalCategories: categories.length,
      recentSales: orders.slice(-5).reverse()
    };
  }
};
