import React from 'react';
import { Gavel, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const TermsPage = () => {
  const { storeSettings } = useStoreData();
  const shopName = storeSettings.shopName || 'SWEETO HUBS';

  const terms = [
    {
      title: "Service Usage",
      content: "By accessing this storefront, you agree to use our services for lawful purposes only. SWEETO HUBS reserves the right to refuse service or cancel orders at our discretion."
    },
    {
      title: "Order Process",
      content: "All orders are initiated through our digital storefront and completed via WhatsApp. A confirmed order on the storefront does not constitute a legal contract until payment and delivery terms are finalized with our team."
    },
    {
      title: "Pricing & Availability",
      content: "We strive for accuracy in pricing and stock levels. However, we reserve the right to correct errors or update product information at any time without prior notice."
    },
    {
      title: "Account Security",
      content: "You are responsible for maintaining the confidentiality of your account credentials. Any activities performed through your account are your sole responsibility."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-10 pb-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Gavel size={14} /> Service Agreement
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Terms <span className="text-amber-500">Of Use</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            By using the {shopName} storefront, you agree to abide by the following terms and conditions. These rules ensure a premium and safe experience for all customers.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {terms.map((term, idx) => (
            <div 
              key={idx}
              className="p-10 rounded-[2.5rem] bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-10"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500 shadow-lg">
                <span className="font-black text-lg">0{idx + 1}</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">{term.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {term.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] flex items-center gap-6">
          <AlertCircle size={24} className="text-amber-500 shrink-0" />
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 italic">
            Last updated: May 1, 2026. We reserve the right to modify these terms as our services evolve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
