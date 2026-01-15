
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { User, CartItem, Product } from './types';
import { mockApi } from './services/mockApi';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import OrderTracking from './pages/OrderTracking';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = mockApi.getCurrentUser();
    if (storedUser) setUser(storedUser);

    const storedCart = localStorage.getItem('eshop_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
    
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('eshop_cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => {
    mockApi.logout();
    setUser(null);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  if (loading) return null;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar 
          user={user} 
          cartItemsCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={(p) => addToCart(p, 1)} />} />
            <Route path="/shop" element={<Shop onAddToCart={(p) => addToCart(p, 1)} />} />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={addToCart} />} />
            <Route path="/cart" element={<Cart items={cart} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout items={cart} user={user} onOrderComplete={clearCart} />} />
            <Route path="/login" element={<Auth onLogin={handleLogin} />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/order-success" element={
              <div className="p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle size={48} />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
                <p className="text-gray-500 max-w-md mx-auto">Thank you for your purchase. You can track your order status in your profile or using your Order ID.</p>
                <div className="flex justify-center space-x-4">
                   <Link to="/profile" className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-100">View My Orders</Link>
                   <Link to="/shop" className="bg-gray-100 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-200">Continue Shopping</Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
};

export default App;
