import React from 'react';
import { ShieldCheck, Lock, Smartphone, Database } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const SecurityPage = () => {
  const { storeSettings } = useStoreData();
  const shopName = storeSettings.shopName || 'SWEETO HUBS';

  const pillars = [
    {
      icon: <Lock size={32} />,
      title: "End-to-End Encryption",
      desc: "Your data is encrypted at every stage of its journey. We use modern SSL/TLS protocols to ensure your connection to SWEETO HUBS is always secure."
    },
    {
      icon: <Database size={32} />,
      title: "Local-First Storage",
      desc: "We prioritize your privacy by keeping your browsing data and cart items in your browser's private local storage, giving you total control."
    },
    {
      icon: <Smartphone size={32} />,
      title: "WhatsApp Verification",
      desc: "Our unique WhatsApp completion flow adds a human layer of security. Every order is verified by a real administrator before processing."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-10 pb-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <ShieldCheck size={14} /> Built for trust
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-8">
            Global <span className="text-blue-500 text-glow-blue">Security</span>
          </h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full mb-10" />
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            At {shopName}, security isn&apos;t just a feature—it&apos;s our foundation. We employ industry-leading protocols to safeguard every interaction.
          </p>
        </div>

        {/* Security Pillars */}
        <div className="space-y-12">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="flex flex-col md:flex-row items-center gap-10 group"
            >
              <div className="w-24 h-24 shrink-0 rounded-3xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-700 shadow-xl group-hover:shadow-blue-500/20 group-hover:-rotate-12">
                {pillar.icon}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-3">{pillar.title}</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-24 p-12 rounded-[4rem] border-4 border-blue-500/20 flex flex-col items-center text-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl -z-10" />
          <ShieldCheck size={64} className="text-blue-500 animate-bounce" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic">100% Secure Checkout</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold max-w-md">
            Our systems are audited regularly to ensure compliance with global digital security standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
