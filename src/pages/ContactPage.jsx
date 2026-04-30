import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Globe } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const ContactPage = () => {
  const { storeSettings } = useStoreData();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full">
          <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[var(--primary-color)]/5 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-color)] mb-8 animate-in slide-in-from-bottom duration-700">
            Get In Touch
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-[0.9] mb-8 animate-in slide-in-from-bottom duration-1000">
            Let's <span className="text-[var(--primary-color)]">Start</span> A Conversation.
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in duration-1000 delay-500">
            Have a question about a product or need professional tech advice? Our specialists are available around the clock to assist you.
          </p>
        </div>
      </section>

      {/* Contact Grid - Editorial Layout */}
      <section className="py-20 px-6 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Info Cards (4 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Phone, label: 'Hotline', value: storeSettings.shopPhone || '+1 (800) SWEETO', sub: 'Mon - Sat, 9am - 6pm' },
                { icon: Mail, label: 'Email', value: storeSettings.contactEmail || 'support@sweetohubs.com', sub: '24/7 Response time' },
                { icon: MapPin, label: 'Main Office', value: storeSettings.shopAddress || '123 Tech Avenue, SV', sub: 'Silicon Valley, CA' },
                { icon: Globe, label: 'Global Sales', value: 'sales@sweetohubs.com', sub: 'Bulk orders & B2B' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] border border-gray-100 dark:border-slate-800 hover:border-[var(--primary-color)]/30 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-gray-400 group-hover:text-[var(--primary-color)] group-hover:scale-110 transition-all mb-6">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{item.label}</h4>
                  <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight mb-1">{item.value}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-[var(--primary-color)] rounded-[2.5rem] text-white shadow-2xl shadow-[var(--primary-color)]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tighter italic">Live Concierge</h4>
                  <p className="text-white/80 text-sm font-medium mt-1">Start a real-time chat with a tech expert now.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 columns) - Glassmorphism */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-color)] to-blue-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative p-10 md:p-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[3rem] shadow-2xl">
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-4">Send a Message</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Expected response time is under 12 hours.</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="ALEXANDER TECH" 
                        className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 px-8 py-5 rounded-2xl text-sm font-bold tracking-tight focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="ALEX@DOMAIN.COM" 
                        className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 px-8 py-5 rounded-2xl text-sm font-bold tracking-tight focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Inquiry Category</label>
                    <select className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 px-8 py-5 rounded-2xl text-sm font-bold tracking-tight focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all appearance-none">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Bulk/Business Orders</option>
                      <option>Shipping & Logistics</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Message Details</label>
                    <textarea 
                      rows="6" 
                      placeholder="TELL US MORE ABOUT YOUR REQUEST..." 
                      className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-slate-800 px-8 py-6 rounded-3xl text-sm font-bold tracking-tight focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    ></textarea>
                  </div>

                  <button className="w-full h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-3xl text-sm font-black uppercase tracking-[0.3em] hover:bg-[var(--primary-color)] dark:hover:bg-[var(--primary-color)] hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group/btn">
                    Dispatch Message
                    <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours Banner */}
      <section className="py-20 px-6 border-t border-gray-100 dark:border-slate-900">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-400">
              <Clock size={28} />
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Concierge Hours</h4>
              <p className="text-sm text-gray-500 font-medium">Always available for your tech needs.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Weekdays</p>
              <p className="text-lg font-black text-gray-900 dark:text-white tracking-tighter italic">9:00 AM - 9:00 PM</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Weekends</p>
              <p className="text-lg font-black text-gray-900 dark:text-white tracking-tighter italic">10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
