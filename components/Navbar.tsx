import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  cartItemsCount: number;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartItemsCount, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-1 flex justify-start shrink-0">
            <Link to="/" className="text-2xl font-bold text-pink-600 tracking-tight">BEAUTY PRO</Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-pink-600 font-bold transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-pink-600 font-bold transition-colors">Shop</Link>
            <Link to="/track" className="text-gray-600 hover:text-pink-600 font-bold flex items-center transition-colors">
              <Truck size={18} className="mr-1.5" /> Track
            </Link>
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex flex-1 items-center space-x-4 justify-end">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-10'}`}>
              <form onSubmit={handleSearchSubmit} className="w-full flex items-center">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                  placeholder="Search products..."
                  className={`w-full bg-gray-50 border border-gray-100 rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all ${isSearchExpanded ? 'opacity-100' : 'opacity-0 cursor-default pointer-events-none'}`}
                />
                <button 
                  type="button"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="absolute right-0 p-2 text-gray-400 hover:text-pink-600 z-10 transition-colors"
                >
                  <Search size={22} />
                </button>
              </form>
            </div>

            <Link to="/cart" className="p-2 text-gray-400 hover:text-pink-600 relative transition-colors">
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4 ml-2">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-xs font-black border border-pink-100">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-bold text-sm">{user.name.split(' ')[0]}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="p-2 text-gray-400 hover:text-pink-600 transition-colors" title="Admin Dashboard">
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-pink-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-pink-700 transition duration-150 ease-in-out shadow-lg shadow-pink-100">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-4">
             <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className="p-2 text-gray-400">
              <Search size={24} />
            </button>
            <Link to="/cart" className="relative p-2 text-gray-400">
               <ShoppingCart size={24} />
               {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchExpanded && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-600">
              <Search size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 px-6 space-y-4 shadow-2xl absolute w-full z-40">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 font-bold text-lg">Home</Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 font-bold text-lg">Shop</Link>
          <Link to="/track" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 font-bold text-lg">Track Order</Link>
          <hr className="border-gray-100" />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 font-bold">My Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-pink-600 font-bold">Admin Dashboard</Link>
              )}
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-red-600 font-bold">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-2 text-pink-600 font-black text-lg">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;