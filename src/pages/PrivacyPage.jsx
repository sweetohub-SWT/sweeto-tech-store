import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const PrivacyPage = () => {
  const { storeSettings } = useStoreData();
  const shopName = storeSettings.shopName || 'SWEETO HUBS';

  const sections = [
    {
      icon: <Eye size={24} />,
      title: "Information Collection",
      content: `At ${shopName}, we collect information you provide directly to us when you create an account, place an order, or communicate with us via WhatsApp. This includes your name, phone number, and location details necessary for order fulfillment.`
    },
    {
      icon: <Shield size={24} />,
      title: "Data Protection",
      content: "We implement advanced security measures to protect your personal data. Your account information is stored securely in your browser's local storage and synchronized with our administrative systems only during active transactions."
    },
    {
      icon: <Lock size={24} />,
      title: "WhatsApp Integration",
      content: "When you complete an order, your details are shared with our administrative team via WhatsApp. This ensures a direct and personal communication channel for your order processing without involving third-party payment processors."
    },
    {
      icon: <FileText size={24} />,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information at any time. You can manage your profile directly within your account settings or contact our support team for assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-10 pb-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Shield size={14} /> Legal Transparency
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Privacy <span className="text-[var(--primary-color)]">Policy</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            At {shopName}, your trust is our most valuable asset. We are committed to protecting your privacy and ensuring transparency in how we handle your data.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <div 
              key={idx}
              className="p-10 rounded-[3rem] bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 hover:border-[var(--primary-color)]/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-black/5 flex items-center justify-center text-[var(--primary-color)] mb-8 transition-all group-hover:scale-110 group-hover:rotate-6">
                {section.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 italic">{section.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-12 rounded-[4rem] bg-gray-900 dark:bg-white text-white dark:text-black relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-color)] opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Have Questions?</h2>
              <p className="text-gray-400 dark:text-gray-600 font-medium leading-relaxed">
                Our legal and security teams are available to discuss any concerns you may have regarding your data privacy.
              </p>
            </div>
            <button className="px-10 py-5 bg-[var(--primary-color)] text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[var(--primary-color)]/30">
              Contact Privacy Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
