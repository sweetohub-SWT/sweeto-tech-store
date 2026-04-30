import React from 'react';
import { Shield, Target, Award, Users } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const AboutPage = () => {
  const { storeSettings } = useStoreData();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full">
          <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-color)] mb-8 animate-in slide-in-from-bottom duration-700">
            Our Identity
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-[0.9] mb-8 animate-in slide-in-from-bottom duration-1000">
            Redefining <span className="text-[var(--primary-color)]">Technology</span> Retail.
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in duration-1000 delay-500">
            At {storeSettings.shopName || 'Sweeto Hubs'}, we don't just sell gadgets. We curate experiences, bridging the gap between innovative engineering and high-end lifestyle.
          </p>
        </div>
      </section>

      {/* Mission & Vision - Glassmorphism Cards */}
      <section className="py-20 px-6 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-color)] to-blue-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)] mb-8">
                  <Target size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Our Mission</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  To provide the most sophisticated technology solutions with an uncompromising commitment to quality, accessibility, and professional service. We aim to be the definitive destination for those who demand excellence from their digital tools.
                </p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8">
                  <Award size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Our Vision</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  To revolutionize the tech retail landscape in Africa and beyond, setting new standards for curated inventory and premium customer experiences that inspire innovation and productivity in every household and workplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Editorial Grid */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-black/20">
        <div className="max-w-[1500px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
              Why <span className="text-[var(--primary-color)]">Choose Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Shield, title: 'Authenticity', desc: '100% genuine products directly from authorized global distributors.' },
              { icon: Users, title: 'Expert Support', desc: 'Professional tech consultants ready to help you find the perfect match.' },
              { icon: Award, title: 'Premium Warranty', desc: 'Industry-leading protection plans for complete peace of mind.' },
              { icon: Award, title: 'Curated Tech', desc: 'We only stock what we would use ourselves. Only the best makes the cut.' }
            ].map((feature, i) => (
              <div key={i} className="space-y-6 group">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center text-gray-400 group-hover:text-[var(--primary-color)] group-hover:scale-110 transition-all">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{feature.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Philosophy Section */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-10">
          Built for the <span className="text-[var(--primary-color)]">Innovators</span>
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-loose">
          Every product in our catalog is selected based on a strict set of criteria: Performance, Design, and Durability. We believe that technology should be an extension of your creative self, not a barrier. Join us on our journey to provide the best tools for the next generation of builders.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
