
import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-pink-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <Link to={`/product/${product.id}`} className="bg-white p-3 rounded-xl text-pink-900 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110 shadow-lg" title="Quick View">
            <Eye size={20} />
          </Link>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-white p-3 rounded-xl text-pink-900 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110 shadow-lg"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        {product.isFeatured && (
          <span className="absolute top-4 left-4 bg-pink-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
            Featured
          </span>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-[10px] text-pink-500 uppercase font-bold tracking-widest mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg hover:text-pink-600 transition-colors mb-2 leading-tight">{product.name}</h3>
        </Link>
        <div className="flex items-center space-x-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-pink-500 text-pink-500' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-bold ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="text-xs font-bold uppercase tracking-widest text-pink-600 hover:text-pink-800 transition-colors border-b-2 border-transparent hover:border-pink-600 pb-0.5"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
