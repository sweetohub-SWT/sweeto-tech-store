import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, Star, Tag } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const QuickLinksBar = () => {
  const { t } = useLocale();

  const quickLinks = [
    {
      id: 'best-sellers',
      label: t('bestSellers'),
      sub: t('shopNow'),
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-500',
      href: '/search',
    },
    {
      id: 'new-arrivals',
      label: t('newArrivals'),
      sub: t('shopNow'),
      icon: Sparkles,
      color: 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]',
      href: '/search',
    },
    {
      id: 'top-rated',
      label: t('topRated'),
      sub: t('shopNow'),
      icon: Star,
      color: 'bg-purple-100 text-purple-500',
      href: '/search',
    },
    {
      id: 'on-sale',
      label: t('onSale'),
      sub: t('shopNow'),
      icon: Tag,
      color: 'bg-green-100 text-green-500',
      href: '/search',
    },
  ];

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4">
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className="flex items-center gap-2 sm:gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group min-w-0"
            >
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon size={16} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm font-black text-gray-900 dark:text-white tracking-tight truncate">{item.label}</p>
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--primary-color)] group-hover:opacity-80 transition-colors">
                  {item.sub} →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickLinksBar;
