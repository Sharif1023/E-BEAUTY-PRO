
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Truck, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { CartItem, User as UserType } from '../types';
import { mockApi } from '../services/mockApi';

interface CheckoutProps {
  items: CartItem[];
  user: UserType | null;
  onOrderComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, user, onOrderComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'cod'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal > 150 ? subtotal : subtotal + 15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to complete your order.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await mockApi.createOrder({
        userId: user.id,
        items,
        total,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'
      });
      onOrderComplete();
      navigate('/order-success');
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
              <User size={24} className="mr-2 text-indigo-600" /> Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Address</label>
                <input 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="123 Street Name" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                <input 
                  required
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="New York" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">ZIP Code</label>
                <input 
                  required
                  value={formData.zip}
                  onChange={e => setFormData({...formData, zip: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="10001" 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
              <Wallet size={24} className="mr-2 text-indigo-600" /> Payment Method
            </h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={formData.paymentMethod === 'cod'}
                  onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-indigo-600' : 'border-gray-300'}`}>
                  {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <div className="flex-1">
                  <span className="block font-bold text-gray-900">Cash on Delivery</span>
                  <span className="text-xs text-gray-500">Pay when you receive the package</span>
                </div>
                <Truck size={24} className="text-gray-400" />
              </label>

              <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={formData.paymentMethod === 'online'}
                  onChange={() => setFormData({...formData, paymentMethod: 'online'})}
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${formData.paymentMethod === 'online' ? 'border-indigo-600' : 'border-gray-300'}`}>
                  {formData.paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <div className="flex-1">
                  <span className="block font-bold text-gray-900">Online Payment</span>
                  <span className="text-xs text-gray-500">Secure payment via credit card or PayPal</span>
                </div>
                <CreditCard size={24} className="text-gray-400" />
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center space-x-3 transition-all transform active:scale-95 shadow-xl shadow-indigo-200 text-lg"
          >
            {isSubmitting ? 'Processing Order...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="space-y-6 lg:pl-12 lg:border-l border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 max-h-[500px] overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex space-x-4 items-center border-b border-gray-50 pb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900 text-white p-8 rounded-3xl space-y-4 shadow-xl">
             <div className="flex justify-between items-center opacity-80">
               <span>Subtotal</span>
               <span className="font-bold">${subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center opacity-80">
               <span>Shipping</span>
               <span className="font-bold">{subtotal > 150 ? 'FREE' : '$15.00'}</span>
             </div>
             <div className="pt-4 border-t border-white/20 flex justify-between items-center">
               <span className="text-xl">Order Total</span>
               <span className="text-3xl font-black">${total.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
