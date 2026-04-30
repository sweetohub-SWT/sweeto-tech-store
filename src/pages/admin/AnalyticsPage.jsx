import React, { useMemo, useState, useEffect } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  MousePointer2, 
  Globe, 
  ArrowLeft, 
  Layers, 
  ExternalLink,
  Calendar,
  Smartphone,
  Monitor,
  Search,
  TrendingUp,
  Eye, 
  Activity, 
  X, 
  Mail, 
  MapPin, 
  Trash2,
  ChevronRight,
  UserPlus,
  UserCheck,
  Sparkles,
  AlertCircle,
  Lightbulb,
  BrainCircuit,
  BarChart3,
  Clock,
  Star,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsPage = () => {
  const { visits, reviews, searchLogs, userLogs, products, storeSettings, users } = useStoreData();
  const { t } = useAdminLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'market'; // 'market' or 'audience'
  
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // --- ANALYTICS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalVisits = visits.length;
    const uniqueSessions = new Set(visits.map(v => v.sessionId)).size;
    
    // Search Stats
    const searchTrends = {};
    const missedSearches = {};
    searchLogs.forEach(log => {
      const q = log.query?.toLowerCase();
      if (!q) return;
      searchTrends[q] = (searchTrends[q] || 0) + 1;
      if (log.resultsCount === 0) {
        missedSearches[q] = (missedSearches[q] || 0) + 1;
      }
    });

    const topSearches = Object.entries(searchTrends)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const topMissed = Object.entries(missedSearches)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Total Duration for Avg calculation
    let totalDurationInSeconds = 0;
    visits.forEach(v => {
      totalDurationInSeconds += (v.duration || 0);
    });
    
    const avgDurationSeconds = totalVisits > 0 ? Math.round(totalDurationInSeconds / totalVisits) : 0;

    const formatDuration = (sec) => {
      if (sec < 60) return `${sec}s`;
      const mins = Math.floor(sec / 60);
      const remainingSecs = sec % 60;
      return `${mins}m ${remainingSecs}s`;
    };

    const today = new Date().toISOString().split('T')[0];
    const visitsToday = visits.filter(v => v.timestamp?.startsWith(today)).length;

    const referrers = {};
    visits.forEach(v => {
      let ref = v.referrerSource || 'Direct';
      referrers[ref] = (referrers[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const pages = {};
    visits.forEach(v => {
      const path = v.path || '/';
      pages[path] = (pages[path] || 0) + 1;
    });
    const topPages = Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const rawCountries = {};
    visits.forEach(v => {
      const country = v.country || 'Unknown';
      rawCountries[country] = (rawCountries[country] || 0) + 1;
    });
    const topCountries = Object.entries(rawCountries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const rawBrowsers = {};
    visits.forEach(v => {
      const browser = v.browser || 'Other';
      rawBrowsers[browser] = (rawBrowsers[browser] || 0) + 1;
    });
    const topBrowsers = Object.entries(rawBrowsers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const devices = { Mobile: 0, Desktop: 0 };
    visits.forEach(v => {
      if (v.device === 'Mobile' || v.device === 'Tablet') {
        devices.Mobile++;
      } else {
        devices.Desktop++;
      }
    });

    return {
      totalVisits,
      uniqueSessions,
      visitsToday,
      avgDuration: formatDuration(avgDurationSeconds),
      topReferrers,
      topPages,
      topCountries,
      topBrowsers,
      devices,
      topSearches,
      topMissed
    };
  }, [visits, searchLogs]);

  const generateAiSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    setTimeout(() => {
      setAiSuggestions([
        { product: "Gaming Laptops", reason: "High search volume (12 searches) with no results.", priority: "High" },
        { product: "Bluetooth Earbuds", reason: "Rising trend in related accessories searches.", priority: "Medium" },
        { product: "iPhone 15 Pro", reason: "Direct search match (5 hits) found in 'missed' category.", priority: "Urgent" }
      ]);
      setIsGeneratingSuggestions(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="p-2.5 bg-gray-50 dark:bg-slate-950 hover:bg-[var(--primary-color)] hover:text-white rounded-2xl transition-all border border-gray-100 dark:border-slate-800 text-gray-500">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase">
                  Data <span className="text-[var(--primary-color)]">Command Center</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-wide">
                  {activeTab === 'market' ? 'Market demand and inventory strategy' : 'Audience demographics and traffic flows'}
                </p>
              </div>
            </div>

            {/* Premium Tab Switcher */}
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700">
              <button 
                onClick={() => handleTabChange('market')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'market' 
                    ? 'bg-white dark:bg-slate-900 text-[var(--primary-color)] shadow-xl' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <BrainCircuit size={16} />
                Market Intelligence
              </button>
              <button 
                onClick={() => handleTabChange('audience')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'audience' 
                    ? 'bg-white dark:bg-slate-900 text-[var(--primary-color)] shadow-xl' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <BarChart3 size={16} />
                Audience Analytics
              </button>
              <button 
                onClick={() => handleTabChange('accounts')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === 'accounts' 
                    ? 'bg-white dark:bg-slate-900 text-[var(--primary-color)] shadow-xl' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Users size={16} />
                User Accounts
              </button>
            </div>

            {activeTab === 'market' && (
              <button 
                onClick={generateAiSuggestions}
                disabled={isGeneratingSuggestions}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {isGeneratingSuggestions ? <Sparkles className="animate-spin" size={16} /> : <Lightbulb size={16} />}
                Get AI Suggestions
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'market' ? (
          <MarketView stats={stats} reviews={reviews} searchLogs={searchLogs} userLogs={userLogs} aiSuggestions={aiSuggestions} onSelect={setSelectedInsight} />
        ) : activeTab === 'audience' ? (
          <AudienceView stats={stats} visits={visits} onSelect={setSelectedInsight} />
        ) : (
          <UserAccountsView users={users} onSelect={setSelectedInsight} />
        )}
      </div>

      {/* Premium Detail Insight Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-end p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-l border-white/20 overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-500"
          >
            {/* Modal Header */}
            <div className="p-10 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 ${selectedInsight.iconBg || 'bg-[var(--primary-color)]/10'} ${selectedInsight.iconColor || 'text-[var(--primary-color)]'} rounded-[1.5rem] flex items-center justify-center shadow-lg`}>
                  {selectedInsight.icon ? <selectedInsight.icon size={32} /> : <Activity size={32} />}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Insight Detail</h2>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Detailed report for this administrative signal</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInsight(null)}
                className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:rotate-90 transition-all shadow-sm border border-gray-100 dark:border-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              {/* Primary Signal Card */}
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block mb-4">Signal Content</span>
                <h3 className="text-2xl font-black italic tracking-tight mb-6">
                  {selectedInsight.signal || selectedInsight.display_name || selectedInsight.email || "System Event"}
                </h3>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[9px] font-black text-white/40 uppercase block mb-1">Volume</span>
                    <span className="text-lg font-mono font-black">{selectedInsight.volume || (selectedInsight.email ? '1 Account' : '1 Event')}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[9px] font-black text-white/40 uppercase block mb-1">Status</span>
                    <span className="text-sm font-black uppercase">{selectedInsight.status || (selectedInsight.email ? 'VERIFIED' : 'ACTIVE')}</span>
                  </div>
                </div>
              </div>

              {/* Data Breakdown */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-4 text-rose-500">
                    <Calendar size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Time Registered</span>
                  </div>
                  <p className="text-lg font-black text-gray-900 dark:text-white font-mono">
                    {selectedInsight.timestamp || selectedInsight.created_at ? new Date(selectedInsight.timestamp || selectedInsight.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                    {selectedInsight.timestamp || selectedInsight.created_at ? new Date(selectedInsight.timestamp || selectedInsight.created_at).toLocaleTimeString() : ''}
                  </p>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-4 text-emerald-500">
                    <Activity size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Signal Category</span>
                  </div>
                  <p className="text-lg font-black text-gray-900 dark:text-white uppercase italic">
                    {selectedInsight.type || 'USER ACCOUNT'}
                  </p>
                </div>
              </div>

              {/* Contact/Details if User */}
              {selectedInsight.email && (
                 <div className="p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Customer Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <Mail className="text-indigo-500 shrink-0" size={20} />
                        <span className="text-sm font-black font-mono truncate">{selectedInsight.email}</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <MapPin className="text-rose-500 shrink-0" size={20} />
                        <span className="text-sm font-black truncate">Region: {selectedInsight.region || 'Global'}</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <Smartphone className="text-emerald-500 shrink-0" size={20} />
                        <span className="text-sm font-black truncate">Device: {selectedInsight.device || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <Globe className="text-blue-500 shrink-0" size={20} />
                        <span className="text-sm font-black truncate">Website: {selectedInsight.website_referrer || 'Direct'}</span>
                      </div>
                    </div>
                 </div>
              )}

              {/* Action Center */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-2">Intelligence Actions</h4>
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl hover:border-indigo-500/50 group transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-500">
                        <Activity size={20} />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-black text-gray-900 dark:text-white block">View Associated Activity</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">See full history for this entity</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-10 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/10">
              <button 
                onClick={() => setSelectedInsight(null)}
                className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MarketView = ({ stats, reviews, searchLogs, userLogs, aiSuggestions, onSelect }) => {
  const [filter, setFilter] = useState('all');

  // Unified Data Preparation for the Intelligence Table
  const tableData = useMemo(() => {
    const data = [];

    // 1. Add Top Searches
    stats.topSearches.forEach(([query, count]) => {
      data.push({
        id: `search-${query}`,
        type: 'SEARCH',
        icon: Search,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        signal: query,
        volume: count,
        volumeLabel: 'Hits',
        status: count > 10 ? 'Trending' : 'Active',
        statusColor: count > 10 ? 'bg-orange-500' : 'bg-blue-500',
        timestamp: new Date().toISOString(), // Fallback
      });
    });

    // 2. Add Missed Opportunities
    stats.topMissed.forEach(([query, count]) => {
      data.push({
        id: `missed-${query}`,
        type: 'MISSED',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50 dark:bg-red-900/20',
        signal: query,
        volume: count,
        volumeLabel: 'Lost Ops',
        status: 'Critical',
        statusColor: 'bg-red-600',
        timestamp: new Date().toISOString(),
      });
    });

    // 3. Add Latest User Actions
    userLogs.slice(0, 10).forEach((log, i) => {
      const uName = log?.userName || 'Anonymous';
      const uAction = log?.action || 'Activity';
      data.push({
        id: `user-${i}`,
        type: 'ACTION',
        icon: UserCheck,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        signal: `${uName}: ${uAction}`,
        volume: 1,
        volumeLabel: 'Event',
        status: 'Live',
        statusColor: 'bg-emerald-500',
        timestamp: log?.timestamp || new Date().toISOString(),
      });
    });

    // 4. Add Latest Feedback
    reviews.slice(0, 10).forEach((r, i) => {
      const rName = r?.name || 'Customer';
      const rComment = r?.comment || 'No comment';
      data.push({
        id: `review-${i}`,
        type: 'FEEDBACK',
        icon: Star,
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
        signal: `${rName}: "${rComment.slice(0, 40)}${rComment.length > 40 ? '...' : ''}"`,
        volume: r?.rating || 0,
        volumeLabel: 'Rating',
        status: (r?.rating || 0) >= 4 ? 'Positive' : 'Neutral',
        statusColor: (r?.rating || 0) >= 4 ? 'bg-green-500' : 'bg-gray-400',
        timestamp: r?.timestamp || new Date().toISOString(),
      });
    });

    // Sort by type priority and then volume
    return data.sort((a, b) => {
      const priority = { 'MISSED': 0, 'SEARCH': 1, 'FEEDBACK': 2, 'ACTION': 3 };
      if (priority[a.type] !== priority[b.type]) return priority[a.type] - priority[b.type];
      return b.volume - a.volume;
    });
  }, [stats, reviews, userLogs]);

  const filteredData = tableData.filter(item => filter === 'all' || item.type === filter);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Market Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Feedback" value={reviews.length} icon={MessageSquare} color="text-green-600" bgColor="bg-green-50 dark:bg-green-900/10" onClick={() => setFilter('FEEDBACK')} />
        <StatCard label="Search Volume" value={searchLogs.length} icon={Search} color="text-orange-600" bgColor="bg-orange-50 dark:bg-orange-900/10" onClick={() => setFilter('SEARCH')} />
        <StatCard label="Missed Searches" value={stats.topMissed.reduce((a, b) => a + b[1], 0)} icon={AlertCircle} color="text-red-600" bgColor="bg-red-50 dark:bg-red-900/10" onClick={() => setFilter('MISSED')} />
        <StatCard label="User Actions" value={userLogs.length} icon={UserCheck} color="text-indigo-600" bgColor="bg-indigo-50 dark:bg-indigo-900/10" onClick={() => setFilter('ACTION')} />
      </div>

      {/* NEW: Demand Rankings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Searched */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl flex items-center justify-center">
              <Search size={20} />
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic">Most Searched</h4>
          </div>
          <div className="space-y-4">
            {stats.topSearches.slice(0, 5).map(([query, count], i) => (
              <div key={query} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-300 dark:text-slate-700 font-mono">0{i+1}</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{query}</span>
                </div>
                <span className="px-2 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-[10px] font-black text-orange-600 font-mono italic">{count} Hits</span>
              </div>
            ))}
            {stats.topSearches.length === 0 && <p className="text-xs text-gray-400 italic">No search data yet</p>}
          </div>
        </div>

        {/* Unmet Demand (Missed) */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-red-100 dark:border-red-900/20 shadow-sm shadow-red-500/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic">Unmet Demand</h4>
          </div>
          <div className="space-y-4">
            {stats.topMissed.slice(0, 5).map(([query, count], i) => (
              <div key={query} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-red-200 dark:text-red-900/40 font-mono">0{i+1}</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{query}</span>
                </div>
                <span className="px-2 py-1 bg-red-50 dark:bg-red-900/30 rounded-lg text-[10px] font-black text-red-600 font-mono italic">-{count} Lost</span>
              </div>
            ))}
            {stats.topMissed.length === 0 && <p className="text-xs text-gray-400 italic">Excellent! No missed searches.</p>}
          </div>
        </div>

        {/* Most Visited (Hot Spots) */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic">Hot Spots</h4>
          </div>
          <div className="space-y-4">
            {stats.topPages.slice(0, 5).map(([page, count], i) => (
              <div key={page} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-300 dark:text-slate-700 font-mono">0{i+1}</span>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{page}</span>
                </div>
                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[10px] font-black text-indigo-600 font-mono italic">{count} View</span>
              </div>
            ))}
            {stats.topPages.length === 0 && <p className="text-xs text-gray-400 italic">No traffic data yet</p>}
          </div>
        </div>
      </div>

      {/* AI Suggestions Engine (Optional Overlay) */}
      {aiSuggestions && (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 rounded-[2.5rem] p-10 border border-indigo-500/30 shadow-2xl">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-indigo-300">
                <Sparkles size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">AI Inventory Strategy</h2>
                <p className="text-indigo-300/80 text-sm font-medium">Data-driven recommendations to boost your sales</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    s.priority === 'Urgent' ? 'bg-red-500 text-white' : 
                    s.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>{s.priority} Priority</span>
                  <h4 className="text-lg font-black text-white mt-4 mb-2 uppercase italic">{s.product}</h4>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">{s.reason}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Main Market Intelligence Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-2xl flex items-center justify-center">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Intelligence Matrix</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aggregated Market Signals</p>
            </div>
          </div>

          <div className="flex bg-gray-50 dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700">
            {['all', 'SEARCH', 'MISSED', 'FEEDBACK', 'ACTION'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-tighter transition-all ${
                  filter === t ? 'bg-white dark:bg-slate-900 text-[var(--primary-color)] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/20">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Intelligence Signal</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume/Impact</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelect(item)}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${item.iconBg} ${item.iconColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <item.icon size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight italic truncate max-w-[300px] block">
                      {item.signal}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-gray-900 dark:text-white font-mono">{item.volume}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.volumeLabel}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-gray-500 font-mono italic">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                    No intelligence signals detected in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AudienceView = ({ stats, visits, onSelect }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Audience Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Global Visits" value={stats.totalVisits} icon={Globe} color="text-rose-600" bgColor="bg-rose-50 dark:bg-rose-900/10" onClick={() => scrollTo('geo-hubs')} />
        <StatCard label="Unique Shoppers" value={stats.uniqueSessions} icon={Users} color="text-indigo-600" bgColor="bg-indigo-50 dark:bg-indigo-900/10" onClick={() => scrollTo('geo-hubs')} />
        <StatCard label="Peak Traffic" value={stats.visitsToday} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/10" onClick={() => scrollTo('traffic-channels')} />
        <StatCard label="Avg Stay" value={stats.avgDuration} icon={Clock} color="text-amber-600" bgColor="bg-amber-50 dark:bg-amber-900/10" onClick={() => scrollTo('traffic-channels')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Geographic Hubs - Redesigned */}
        <div id="geo-hubs" className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-gray-100 dark:border-slate-800 shadow-xl relative overflow-hidden group scroll-mt-32">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500">
                  <Globe size={24} />
                </div>
                Global Influence
              </h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Geographic distribution of your traffic</p>
            </div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{stats.topCountries.length} Countries Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
            {stats.topCountries.map(([country, count], i) => (
              <div 
                key={country} 
                className="space-y-4 group/item cursor-pointer"
                onClick={() => onSelect({ signal: country, volume: count, type: 'GEO', icon: Globe, iconColor: 'text-rose-500', iconBg: 'bg-rose-50' })}
              >
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-300 dark:text-slate-700 font-mono italic">#{i+1}</span>
                    <span className="text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-tight group-hover/item:text-rose-500 transition-colors">{country}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-gray-900 dark:text-white font-mono">{count}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sessions</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-gray-50 dark:bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-gray-100 dark:border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(244,63,94,0.3)]" 
                    style={{ width: `${(count / stats.totalVisits) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Channels */}
        <div id="traffic-channels" className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-10 border border-indigo-500/20 shadow-2xl relative overflow-hidden scroll-mt-32">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
          
          <h3 className="text-xl font-black text-white uppercase tracking-tight italic mb-10 flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-indigo-300">
              <TrendingUp size={24} />
            </div>
            Top Traffic
          </h3>

          <div className="space-y-4 relative z-10">
            {stats.topPages.map(([page, count], i) => (
              <div 
                key={page} 
                onClick={() => onSelect({ signal: page, volume: count, type: 'TRAFFIC', icon: Activity, iconColor: 'text-indigo-400', iconBg: 'bg-white/10' })}
                className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group cursor-pointer block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-mono text-[10px] font-black italic">
                    {i+1}
                  </div>
                  <span className="text-[11px] font-black text-white/70 uppercase tracking-tighter truncate max-w-[140px] group-hover:text-white transition-colors">{page}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-400 font-mono block leading-none">{count}</span>
                    <span className="text-[8px] font-bold text-indigo-300/40 uppercase tracking-[0.2em]">Views</span>
                  </div>
                  <Eye size={14} className="text-white/20 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-10 border-t border-white/5 relative z-10">
            <p className="text-[9px] font-black text-indigo-300/40 uppercase tracking-[0.3em] mb-6">Device Breakdown</p>
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                 <Monitor size={16} className="mx-auto mb-2 text-blue-400" />
                 <span className="text-xs font-black text-white font-mono">{Math.round((stats.devices.Desktop / stats.totalVisits) * 100)}%</span>
              </div>
              <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                 <Smartphone size={16} className="mx-auto mb-2 text-emerald-400" />
                 <span className="text-xs font-black text-white font-mono">{Math.round((stats.devices.Mobile / stats.totalVisits) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bgColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 group overflow-hidden relative transition-all active:scale-95 ${onClick ? 'hover:shadow-xl hover:border-[var(--primary-color)]/20 cursor-pointer' : ''}`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.02] rounded-full translate-x-12 -translate-y-12" />
    <div className="flex items-center gap-6 relative z-10">
      <div className={`p-5 ${bgColor} ${color} rounded-[1.5rem] group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white font-mono">{value}</p>
      </div>
    </div>
  </button>
);

const DeviceStat = ({ label, count, total, icon: Icon, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center group">
      <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-gray-50 dark:bg-slate-950 mb-6 border border-gray-100 dark:border-slate-800">
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{percentage}%</span>
    </div>
  );
}

const UserAccountsView = ({ users, onSelect }) => {
  // Filter to ensure only actual created accounts with emails are counted
  const validAccounts = users.filter(u => u && u.email);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Account Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Accounts" value={validAccounts.length} icon={Users} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-900/10" />
        <StatCard label="New Today" value={validAccounts.filter(u => u.created_at?.startsWith(new Date().toISOString().split('T')[0])).length} icon={UserPlus} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/10" />
        <StatCard label="Verified Emails" value={validAccounts.length} icon={UserCheck} color="text-indigo-600" bgColor="bg-indigo-50 dark:bg-indigo-900/10" />
        <StatCard label="Creation Rate" value="100%" icon={Sparkles} color="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-900/10" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">User Registry</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Only displaying accounts with valid email addresses</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/20">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Origin / Device</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {validAccounts.map((u) => (
                <tr 
                  key={u.id} 
                  onClick={() => onSelect({ ...u, signal: u.display_name, type: 'USER_ACCOUNT', icon: Users, iconColor: 'text-indigo-500', iconBg: 'bg-indigo-50' })}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase">
                        {u.display_name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight italic">
                        {u.display_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-mono lowercase">
                      {u.email}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                        {u.website_referrer || 'Direct'}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {u.device || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black bg-emerald-500 text-white uppercase tracking-widest">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-gray-500 font-mono italic">
                        {u.created_at ? new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'System'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {validAccounts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                    No registered accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
;
