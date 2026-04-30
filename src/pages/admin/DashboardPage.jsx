import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { useStoreData } from '../../contexts/StoreDataContext';
import { Package, Grid3x3, Settings, Plus, Edit, Trash2, TrendingUp, Users, ShoppingCart, Warehouse, Receipt, AlertTriangle, MousePointer2, Video, Globe, Database, Search, BarChart3, BrainCircuit } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAdminAuth();
  const { t } = useAdminLocale();
  const { products, categories, storeSettings, formatPrice, salesRecords, visits, videoAds, searchLogs } = useStoreData();

  const lowStockProducts = products.filter(p => (p.lowStockThreshold || 0) > 0 && (p.stockQuantity || 0) <= (p.lowStockThreshold || 0));

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalCategories: categories.length,
    totalOrders: salesRecords.length,
    totalRevenue: salesRecords.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
    lowStockCount: lowStockProducts.length,
    totalVisits: visits.length,
    totalAds: videoAds ? videoAds.length : 0,
    missedDemand: searchLogs.filter(log => log.resultsCount === 0).length
  };

  const quickActions = [
    {
      title: t('addProduct'),
      description: 'Add a new product to your store',
      icon: Plus,
      link: '/admin/products/add',
      color: 'bg-[var(--primary-color)]'
    },
    {
      title: t('addCategory'),
      description: 'Create a new product category',
      icon: Plus,
      link: '/admin/categories/add',
      color: 'bg-green-500'
    },
    {
      title: t('manageStock'),
      description: 'Manage inventory & stock levels',
      icon: Warehouse,
      link: '/admin/stock',
      color: 'bg-amber-500'
    },
    {
      title: t('recordSale'),
      description: 'Record a new sale transaction',
      icon: Receipt,
      link: '/admin/sales',
      color: 'bg-purple-500'
    },
    {
      title: t('storeSettings'),
      description: 'Configure your store settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-slate-500'
    },
    {
      title: 'Market Intelligence',
      description: 'View customer demand & trends',
      icon: BrainCircuit,
      link: '/admin/analytics?tab=market',
      color: 'bg-indigo-600'
    },
    {
      title: 'Audience Analytics',
      description: 'Traffic & visitor demographics',
      icon: BarChart3,
      link: '/admin/analytics?tab=audience',
      color: 'bg-blue-600'
    },
    {
      title: 'Video Ads',
      description: 'Manage marketing commercials',
      icon: Video,
      link: '/admin/video-ads',
      color: 'bg-pink-500'
    },
    {
      title: 'Storefront',
      description: 'View the live public website',
      icon: Globe,
      link: '/',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 pb-20">
      {/* Dynamic Header Section */}
      <div className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-10">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-[var(--primary-color)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-color)] opacity-80">System Command Center</span>
              </div>
              <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none mb-4">
                {t('welcome')}, <span className="text-[var(--primary-color)]">{user?.username}</span>
              </h1>
              <p className="text-xl font-bold text-gray-500 dark:text-gray-400 italic max-w-2xl leading-relaxed">
                {storeSettings.storeTagline || "Architecting the future of premium retail excellence."}
              </p>
            </div>

            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right duration-700">
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-white dark:border-white/5 shadow-2xl shadow-black/5 flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Architecture</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white uppercase italic">{storeSettings.shopName}</p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Status</p>
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm font-bold text-green-500 uppercase">Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 -mt-10 relative z-20">
        {/* Stats Grid - High Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total Inventory', val: stats.totalProducts, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Market Segments', val: stats.totalCategories, icon: Grid3x3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Sales Velocity', val: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Total Revenue', val: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <div key={i} className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white dark:border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}>
                <stat.icon size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                {stat.val}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time Data</span>
                <div className="flex gap-1">
                  {[1,2,3].map(j => <div key={j} className={`w-1 h-1 rounded-full ${stat.color} opacity-20`} />)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Hub */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 dark:text-slate-600">Strategic Hub</h2>
            <div className="h-px flex-grow bg-gray-100 dark:bg-white/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white dark:border-white/5 group hover:bg-[var(--primary-color)] transition-all duration-500"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:bg-white group-hover:text-[var(--primary-color)] transition-all`}>
                  <action.icon size={22} className="text-white group-hover:text-inherit" />
                </div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase italic group-hover:text-white transition-colors">{action.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1 group-hover:text-white/60 transition-colors">Access Panel</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Activity Stream */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white dark:border-white/5 overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic leading-none">Activity Pulse</h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2">Real-time synchronization</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase tracking-widest">System Active</div>
                </div>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/5">
                  {/* Stock Feed */}
                  <div className="p-8 space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Inventory
                    </h4>
                    <div className="space-y-5">
                      {products.slice(-3).reverse().map(p => (
                        <div key={p.id} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 dark:text-white truncate uppercase italic">{p.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Newly Cataloged</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Feed */}
                  <div className="p-8 space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Sales Log
                    </h4>
                    <div className="space-y-5">
                      {salesRecords.slice(-3).reverse().map(s => (
                        <div key={s.id} className="flex items-center justify-between gap-4 group">
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 dark:text-white truncate uppercase italic">{s.productName}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.quantitySold} Units Sold</p>
                          </div>
                          <p className="text-xs font-black text-purple-500 italic">+{formatPrice(s.totalPrice)}</p>
                        </div>
                      ))}
                      {salesRecords.length === 0 && <p className="text-[10px] font-bold text-gray-400 uppercase italic opacity-50">Waiting for data...</p>}
                    </div>
                  </div>

                  {/* Health Feed */}
                  <div className="p-8 space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Critical
                    </h4>
                    <div className="space-y-5">
                      {lowStockProducts.slice(0, 3).map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-4 group">
                          <div className="min-w-0">
                            <p className="text-xs font-black text-red-500 truncate uppercase italic">{p.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inventory Depleted</p>
                          </div>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black rounded-lg">LVL: {p.stockQuantity}</span>
                        </div>
                      ))}
                      {lowStockProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                            <BrainCircuit size={20} />
                          </div>
                          <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">All Assets Healthy</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: Quick List */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white dark:border-white/5 p-8 shadow-2xl">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic mb-8 flex items-center justify-between">
                Fresh Inventory
                <Link to="/admin/products" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition-all">
                  <TrendingUp size={14} />
                </Link>
              </h3>
              
              <div className="space-y-6">
                {products.slice(-5).reverse().map((product) => (
                  <div key={product.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1rem] overflow-hidden border border-gray-100 dark:border-white/5">
                        <img src={product.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-125" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase italic leading-tight">{product.name}</p>
                        <p className="text-[10px] font-bold text-[var(--primary-color)] tracking-tight">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Edit size={14} className="text-gray-400 hover:text-[var(--primary-color)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metric */}
            <div className="bg-[var(--primary-color)] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-4">Conversion Alpha</p>
                <div className="flex items-end gap-3 mb-6">
                  <h4 className="text-5xl font-black italic leading-none">+{Math.round((stats.totalOrders / (stats.totalVisits || 1)) * 100)}%</h4>
                  <TrendingUp className="mb-1 animate-bounce" size={24} />
                </div>
                <p className="text-xs font-bold leading-relaxed text-white/80">
                  Your storefront architecture is currently converting at an elite level. 
                  Optimize your video ads to scale this trajectory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
