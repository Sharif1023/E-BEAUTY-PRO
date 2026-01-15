
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Package, ShoppingCart, 
  Settings, LogOut, ChevronRight, Plus, 
  Trash2, Edit, CheckCircle, Clock, AlertCircle,
  X, Image as ImageIcon, Tags, Wallet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockApi } from '../services/mockApi';
import { Product, Order, OrderStatus, Category } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'categories'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [s, p, o, c] = await Promise.all([
      mockApi.getStats(),
      mockApi.getProducts(),
      mockApi.getOrders(),
      mockApi.getCategories()
    ]);
    setStats(s);
    setProducts(p);
    setOrders(o);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await mockApi.updateOrderStatus(id, status);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await mockApi.deleteProduct(id);
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await mockApi.deleteCategory(id);
      fetchData();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await mockApi.saveProduct(editingProduct);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchData();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await mockApi.saveCategory(editingCategory);
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchData();
    }
  };

  if (loading && !stats) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-2 text-indigo-600" size={24} /> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'stats', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Tags },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => navigate('/')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            <LogOut size={20} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'stats' && stats && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Categories', value: stats.totalCategories, icon: Tags, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                    <card.icon size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Performance</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Mon', rev: 1200 }, { name: 'Tue', rev: 2100 }, 
                      { name: 'Wed', rev: 800 }, { name: 'Thu', rev: 2780 }, 
                      { name: 'Fri', rev: 1890 }, { name: 'Sat', rev: 3390 }, 
                      { name: 'Sun', rev: 4490 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f9fafb'}} />
                      <Bar dataKey="rev" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {order.id.split('-')[1].substr(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">${order.total.toFixed(2)} • {order.items.length} items</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab('orders')} className="w-full text-center py-2 text-indigo-600 text-sm font-bold hover:underline">View All Orders</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
                <p className="text-gray-500">Inventory Management</p>
              </div>
              <button 
                onClick={() => { setEditingProduct({ name: '', price: 0, category: categories[0]?.name || '', stock: 0, description: '' }); setIsProductModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${p.stock < 10 ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : 'text-gray-600'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Categories</h1>
                <p className="text-gray-500">Organize your catalog</p>
              </div>
              <button 
                onClick={() => { setEditingCategory({ name: '', image: '' }); setIsCategoryModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus size={20} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <img src={cat.image} className="w-12 h-12 rounded-2xl object-cover" alt={cat.name} />
                    <div>
                      <h3 className="font-bold text-gray-900">{cat.name}</h3>
                      <p className="text-xs text-gray-400">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600"><Edit size={18} /></button>
                     <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-indigo-600">{o.id}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900 font-medium">Customer #{o.userId.substr(0,4)}</div>
                        <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">${o.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select 
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            className={`appearance-none text-[10px] font-bold uppercase px-3 py-1.5 pr-8 rounded-lg outline-none cursor-pointer transition-all ${
                              o.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' :
                              o.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {Object.values(OrderStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none opacity-50" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs px-3 py-1 rounded-lg transition-colors">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="p-12 text-center text-gray-400">No orders found.</div>}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black text-gray-900">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name</label>
                  <input 
                    required 
                    value={editingProduct.name} 
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                  <select 
                    value={editingProduct.category} 
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price ($)</label>
                  <input 
                    type="number" step="0.01" required 
                    value={editingProduct.price} 
                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Initial Stock</label>
                  <input 
                    type="number" required 
                    value={editingProduct.stock} 
                    onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1 col-span-full">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                  <div className="flex space-x-2">
                    <input 
                      value={editingProduct.image} 
                      onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="https://..."
                    />
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border">
                      {editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 col-span-full">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={3}
                    value={editingProduct.description} 
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex space-x-4">
                 <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black text-gray-900">{editingCategory.id ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name</label>
                  <input 
                    required 
                    value={editingCategory.name} 
                    onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                  <div className="flex space-x-2">
                    <input 
                      value={editingCategory.image} 
                      onChange={e => setEditingCategory({...editingCategory, image: e.target.value})}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="https://..."
                    />
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border">
                      {editingCategory.image ? <img src={editingCategory.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex space-x-4">
                 <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
