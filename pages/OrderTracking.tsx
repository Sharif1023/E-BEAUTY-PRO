
import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { mockApi } from '../services/mockApi';

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const foundOrder = await mockApi.getOrderById(orderId.trim());
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check your ID and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 1;
      case OrderStatus.PROCESSING: return 2;
      case OrderStatus.SHIPPED: return 3;
      case OrderStatus.DELIVERED: return 4;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Pending', icon: Clock, status: OrderStatus.PENDING },
    { label: 'Processing', icon: Package, status: OrderStatus.PROCESSING },
    { label: 'Shipped', icon: Truck, status: OrderStatus.SHIPPED },
    { label: 'Delivered', icon: CheckCircle, status: OrderStatus.DELIVERED },
  ];

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black text-gray-900">Track Your Order</h1>
        <p className="text-gray-500">Enter your Order ID to see real-time updates on your delivery.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl mb-12">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-ASDF123"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? 'Searching...' : 'Track Order'}
            <ArrowRight size={20} />
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {order && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Status Timeline */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order ID: {order.id}</h3>
                <p className="text-2xl font-black text-gray-900 mt-1">Status: <span className="text-indigo-600">{order.status}</span></p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-400 font-bold uppercase">Estimated Delivery</p>
                <p className="text-lg font-bold text-gray-900">Oct 24, 2024</p>
              </div>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden sm:block" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-1000 hidden sm:block" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              <div className="relative flex flex-col sm:flex-row justify-between space-y-8 sm:space-y-0">
                {steps.map((step, idx) => {
                  const isActive = idx + 1 <= currentStep;
                  const isCurrent = idx + 1 === currentStep;
                  return (
                    <div key={idx} className="flex sm:flex-col items-center sm:text-center group relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                        isActive ? 'bg-indigo-600 text-white border-white ring-4 ring-indigo-50' : 'bg-white text-gray-300 border-gray-100'
                      } ${isCurrent ? 'scale-125' : ''}`}>
                        <step.icon size={20} />
                      </div>
                      <div className="ml-4 sm:ml-0 sm:mt-4">
                        <p className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                          {isActive ? (idx === 0 ? 'Confirmed' : 'Completed') : 'Awaiting'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Items Summary</h4>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-600 font-medium">{item.name} x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Paid</span>
                <span className="text-xl font-black text-indigo-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">Shipping Address</h4>
                <p className="text-gray-900 font-medium leading-relaxed">{order.shippingAddress}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">Contact Details</h4>
                <p className="text-gray-900 font-medium">{order.phone}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">Payment Method</h4>
                <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
