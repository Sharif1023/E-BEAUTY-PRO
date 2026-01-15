
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, ChevronRight, ArrowLeft, X, Search, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';
import { mockApi } from '../services/mockApi';
import ProductCard from '../components/ProductCard';

interface ShopProps {
  onAddToCart: (p: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const searchTerm = searchParams.get('search') || '';
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(searchParams.get('category') || 'All');
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const prods = await mockApi.getProducts();
      const cats = await mockApi.getCategories();
      setProducts(prods);
      setCategories(cats);
      
      const initialCatName = searchParams.get('category');
      if (initialCatName) {
        const found = cats.find(c => c.name === initialCatName && !c.parentId);
        if (found) setSelectedParentCategory(found);
      }
      setLoading(false);
    };
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategoryName !== 'All') result = result.filter(p => p.category === selectedCategoryName);
    if (selectedSubCategoryName !== 'All') result = result.filter(p => p.subCategory === selectedSubCategoryName);
    if (searchParams.get('featured') === 'true') result = result.filter(p => p.isFeatured);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(result);
  }, [products, selectedCategoryName, selectedSubCategoryName, priceRange, sortBy, searchParams, searchTerm]);

  const parentCategories = categories.filter(c => !c.parentId);
  const subCategories = selectedParentCategory ? categories.filter(c => c.parentId === selectedParentCategory.id) : [];

  const handleParentSelect = (cat: Category) => {
    setSelectedParentCategory(cat);
    setSelectedCategoryName(cat.name);
    setSelectedSubCategoryName('All');
    setSearchParams(params => {
        params.set('category', cat.name);
        return params;
    });
  };

  const handleBackToAll = () => {
    setSelectedParentCategory(null);
    setSelectedCategoryName('All');
    setSelectedSubCategoryName('All');
    setSearchParams(params => {
        params.delete('category');
        params.delete('search');
        return params;
    });
  };

  const clearSearch = () => {
    setSearchParams(params => {
        params.delete('search');
        return params;
    });
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center">
            <SlidersHorizontal size={18} className="mr-2 text-pink-600" /> 
            {selectedParentCategory ? selectedParentCategory.name : 'Categories'}
          </h3>
          {selectedParentCategory && (
            <button onClick={handleBackToAll} className="text-xs font-bold text-pink-600 hover:underline flex items-center">
              <ArrowLeft size={14} className="mr-1" /> Reset
            </button>
          )}
        </div>
        <div className="space-y-1">
          {!selectedParentCategory ? (
            <>
              <button onClick={handleBackToAll} className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategoryName === 'All' ? 'bg-pink-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                <span>All Products</span>
                {selectedCategoryName === 'All' && <ChevronRight size={14} />}
              </button>
              {parentCategories.map(cat => (
                <button key={cat.id} onClick={() => handleParentSelect(cat)} className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategoryName === cat.name ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-100' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <img src={cat.image} className="w-5 h-5 rounded object-cover" alt="" />
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className={selectedCategoryName === cat.name ? 'text-white' : 'text-gray-300'} />
                </button>
              ))}
            </>
          ) : (
            <>
              <button onClick={() => setSelectedSubCategoryName('All')} className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedSubCategoryName === 'All' ? 'bg-pink-50 text-pink-700 font-bold border border-pink-100' : 'text-gray-600 hover:bg-gray-100'}`}>
                <span>View All {selectedParentCategory.name}</span>
                {selectedSubCategoryName === 'All' && <ChevronRight size={14} />}
              </button>
              {subCategories.map(sub => (
                <button key={sub.id} onClick={() => setSelectedSubCategoryName(sub.name)} className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedSubCategoryName === sub.name ? 'bg-pink-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <span>{sub.name}</span>
                  {selectedSubCategoryName === sub.name && <ChevronRight size={14} />}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-4">Price Range</h3>
        <div className="space-y-4 px-1">
          <input type="range" min="0" max="1000" step="10" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-pink-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-xs font-bold text-gray-400">
            <span>$0</span>
            <span className="text-pink-600">Up to ${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-pink-600 animate-pulse">Loading Catalog...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0 border-b border-gray-100 pb-10">
        <div>
          <nav className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 space-x-2">
            <Link to="/" className="hover:text-pink-600">Home</Link>
            <ChevronRight size={10} />
            <span className="text-gray-900">Shop</span>
            {searchTerm && <><ChevronRight size={10} /><span className="text-pink-600">"{searchTerm}"</span></>}
          </nav>
          <h1 className="text-4xl font-bold text-gray-900">{searchTerm ? `Search Results` : (selectedParentCategory ? selectedParentCategory.name : 'All Products')}</h1>
          <p className="text-gray-500 mt-2">{filteredProducts.length} items found</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsFilterDrawerOpen(true)} className="flex items-center space-x-2 bg-white border border-gray-200 px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 lg:hidden shadow-sm">
            <Filter size={18} /><span>Filter</span>
          </button>
          <div className="relative inline-block">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-200 px-6 py-3 pr-12 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 cursor-pointer shadow-sm">
              <option value="newest">Latest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-72 shrink-0"><div className="sticky top-24"><FilterContent /></div></aside>
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Search size={40} className="mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
              <button onClick={handleBackToAll} className="mt-8 bg-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg">Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      {isFilterDrawerOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setIsFilterDrawerOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white z-[70] transform transition-transform duration-300 lg:hidden shadow-2xl ${isFilterDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between mb-8"><h2 className="text-xl font-bold">Filters</h2><button onClick={() => setIsFilterDrawerOpen(false)}><X size={24} /></button></div>
          <div className="flex-1 overflow-y-auto"><FilterContent /></div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
