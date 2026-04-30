import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { Mail, Search, Trash2, Download, Users, X } from 'lucide-react';

const SubscribersPage = () => {
  const { subscribers, deleteSubscriber } = useStoreData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return [...(subscribers || [])]
      .sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
      .filter(s => !term || s.email.toLowerCase().includes(term));
  }, [subscribers, search]);

  const handleExport = () => {
    const csv = ['Email,Subscribed At', ...filtered.map(s =>
      `${s.email},${new Date(s.subscribedAt).toLocaleString()}`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this subscriber?')) {
      await deleteSubscriber(id);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-[var(--border-color)]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Newsletter Subscribers</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Emails collected from your storefront footer</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Count badge */}
              <div className="bg-gray-50 dark:bg-slate-950 px-5 py-3 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-3">
                <Users size={16} className="text-[var(--primary-color)]" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white font-mono leading-none">{(subscribers || []).length}</p>
                </div>
              </div>
              {/* Export CSV */}
              <button
                onClick={handleExport}
                disabled={filtered.length === 0}
                className="flex items-center gap-2 px-5 py-3 bg-[var(--primary-color)] hover:opacity-90 disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[var(--primary-color)]/30 active:scale-95"
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Table / Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <Mail className="h-16 w-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">
              {search ? 'No subscribers match your search.' : 'No subscribers yet.'}
            </p>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">
              Subscribers will appear here once customers sign up via the footer form.
            </p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">#</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Email</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Subscribed At</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub, i) => (
                    <tr key={sub.id} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-400 dark:text-slate-500">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center shrink-0">
                            <Mail size={14} className="text-[var(--primary-color)]" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400 font-mono">
                        {new Date(sub.subscribedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                          title="Remove subscriber"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-950/30">
              <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                Showing {filtered.length} of {(subscribers || []).length} subscriber{(subscribers || []).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribersPage;
