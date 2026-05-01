import React from 'react';
import { Database, Info, Settings, MousePointer2 } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const CookiesPage = () => {
  const { storeSettings } = useStoreData();
  const shopName = storeSettings.shopName || 'SWEETO HUBS';

  const cookieTypes = [
    {
      title: "Essential Cookies",
      use: "Required for basic site functionality, including cart management and account sessions.",
      duration: "Session-based"
    },
    {
      title: "Preference Cookies",
      use: "Remembers your theme selection (Dark/Light mode) and language preferences.",
      duration: "Permanent"
    },
    {
      title: "Local Storage",
      use: "Used to store your shopping cart and wishlist items locally in your browser.",
      duration: "Until cleared"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-10 pb-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Database size={14} /> Data Transparency
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-6">
            Cookie <span className="text-indigo-500">Settings</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
            We use digital identifiers to enhance your premium shopping experience. This page explains how we use cookies and local storage to power {shopName}.
          </p>
        </div>

        {/* Content Table */}
        <div className="overflow-hidden rounded-[3rem] border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Purpose</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Persistence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {cookieTypes.map((type, idx) => (
                <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-8 font-black text-gray-900 dark:text-white uppercase italic text-sm">{type.title}</td>
                  <td className="px-8 py-8 text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{type.use}</td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                      {type.duration}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-10">
          <div className="flex-1 p-10 rounded-[3rem] bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 space-y-4">
            <Info className="text-indigo-500" size={24} />
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">Why we use them?</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Cookies allow us to remember you as you browse, ensuring your cart stays intact and your theme settings are preserved across visits.
            </p>
          </div>
          <div className="flex-1 p-10 rounded-[3rem] bg-indigo-500 text-white space-y-4">
            <Settings size={24} />
            <h3 className="text-xl font-black uppercase italic">Control</h3>
            <p className="text-indigo-100 font-medium leading-relaxed">
              You can clear all cookies and local storage via your browser settings at any time. This will reset your shopping cart and account session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
