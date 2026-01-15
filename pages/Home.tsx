import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Headset, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { mockApi } from '../services/mockApi';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  onAddToCart: (p: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const prods = await mockApi.getProducts();
      const cats = await mockApi.getCategories();
      setFeaturedProducts(prods.filter(p => p.isFeatured).slice(0, 4));
      setCategories(cats.filter(c => !c.parentId));
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-bold text-gray-400 animate-pulse uppercase tracking-widest text-sm">Loading Experience</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 relative">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[650px] bg-pink-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Beauty Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="flex items-center space-x-2 text-pink-300 font-bold tracking-widest uppercase mb-4">
            <Sparkles size={16} />
            <span>Summer Glow Collection 2024</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-3xl">
            Reveal Your <br />
            <span className="text-pink-300">Natural Beauty.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed">
            Premium makeup, skincare, and fragrances curated to enhance your everyday glow. Professional quality, delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/shop" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center justify-center shadow-xl shadow-pink-900/40">
              Shop Collection <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Makeup', desc: 'Eyes, Lips & Face', icon: Sparkles, color: 'bg-pink-600', link: '/shop?category=Makeup' },
            { label: 'Skincare', desc: 'Serums & Cleansers', icon: Heart, color: 'bg-emerald-500', link: '/shop?category=Skincare' },
            { label: 'My Orders', icon: ShieldCheck, color: 'bg-indigo-500', link: '/profile' },
            { label: 'Fragrance', desc: 'Luxury Scents', icon: Star, color: 'bg-orange-500', link: '/shop?category=Fragrance' },
          ].map((item, idx) => (
            <Link key={idx} to={item.link} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900">{item.label}</h3>
              <p className="text-xs text-gray-500 mt-1">Explore category</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Editor's Picks</h2>
            <p className="text-gray-500 mt-2">Must-have essentials for your beauty routine</p>
          </div>
          <Link to="/shop" className="text-pink-600 font-bold flex items-center hover:text-pink-800 transition-colors">
            View All Catalog <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* Categories Department Strip */}
      <section id="categories" className="bg-gray-50 py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore by Department</h2>
            <p className="text-gray-500 mt-2">Find professional care for every need</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.name}`} className="relative group overflow-hidden rounded-2xl h-64 shadow-sm">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-center">{cat.name}</h3>
                  <span className="mt-2 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Discover</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Sparkles, title: 'Authentic Brands', desc: '100% genuine guaranteed' },
            { icon: ShieldCheck, title: 'Safe Formulas', desc: 'Dermatologically tested' },
            { icon: Heart, title: 'Cruelty Free', desc: 'No animal testing' },
            { icon: Headset, title: 'Beauty Advisory', desc: 'Expert help center' }
          ].map((benefit, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-4 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <benefit.icon size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-500">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;