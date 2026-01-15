
import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Phone, Mail, ChevronRight, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { Order, User as UserType, OrderStatus } from '../types';

interface ProfileProps {
  user: UserType | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      const userOrders = await mockApi.getUserOrders(user.id);
      setOrders(userOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user || loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 mb-6">{user.email}</p>
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
              {user.role} Member
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center">
              <MapPin size={18} className="mr-2 text-indigo-600" /> Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-600">{user.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="text-gray-600">{user.address || 'No shipping address saved'}</span>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors text-sm">
              Edit Profile Info
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Order History</h1>
              <p className="text-gray-500">Manage and track your previous purchases</p>
            </div>
            <Link to="/track" className="text-indigo-600 font-bold text-sm hover:underline flex items-center">
              Track using ID <ChevronRight size={16} />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                        <p className="font-bold text-gray-900">{order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Placed On</p>
                        <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</p>
                        <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-600' :
                        'bg-indigo-50 text-indigo-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                       <div className="flex -space-x-3 overflow-hidden">
                         {order.items.slice(0, 4).map((item, i) => (
                           <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 overflow-hidden">
                             <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                           </div>
                         ))}
                         {order.items.length > 4 && (
                           <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 text-[10px] font-bold text-gray-600">
                             +{order.items.length - 4}
                           </div>
                         )}
                       </div>
                       <div className="flex space-x-4">
                         <Link 
                           to="/track" 
                           onClick={() => localStorage.setItem('track_id', order.id)}
                           className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
                         >
                           Track Shipment <ChevronRight size={14} className="ml-1" />
                         </Link>
                         <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
                           View Details
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm">When you place an order, it will appear here for you to track and manage.</p>
              <Link to="/shop" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                Shop Our Collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
