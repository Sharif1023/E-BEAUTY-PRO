
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCcw, ChevronLeft, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';

interface ProductDetailsProps {
  onAddToCart: (p: Product, qty: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (id) {
      mockApi.getProductById(id).then(res => {
        if (res) {
          setProduct(res);
          setSelectedImage(res.image);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading details...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium mb-8">
        <ChevronLeft size={20} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {allImages.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-indigo-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2">{product.category}</p>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-400">({product.reviews} customer reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

          <div className="border-y border-gray-100 py-6 space-y-4">
             <div className="flex items-center space-x-6">
               <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Quantity</span>
               <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                 <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                   <Minus size={18} />
                 </button>
                 <span className="px-4 font-bold text-gray-900">{quantity}</span>
                 <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                   <Plus size={18} />
                 </button>
               </div>
               <span className="text-sm text-gray-500">{product.stock} items left in stock</span>
             </div>
             
             <button 
              onClick={() => onAddToCart(product, quantity)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-3 transition-all transform active:scale-95 shadow-lg shadow-indigo-200"
            >
               <ShoppingCart size={22} />
               <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-3 text-xs font-semibold text-gray-600">
              <Truck size={20} className="text-indigo-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-gray-600">
              <ShieldCheck size={20} className="text-indigo-600" />
              <span>2 Year Warranty</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-gray-600">
              <RefreshCcw size={20} className="text-indigo-600" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
