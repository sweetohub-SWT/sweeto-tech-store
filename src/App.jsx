import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

// Providers
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ToastProvider } from './contexts/ToastContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminLocaleProvider } from './contexts/AdminLocaleContext';
import { UserAuthProvider, useUserAuth } from './contexts/UserAuthContext'; // Customer Authentication
import { useStoreData } from './contexts/StoreDataContext';

// Analytics
import analyticsService from './utils/analyticsService';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

import FloatingCartButton from './components/FloatingCartButton';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Toast from './components/Toast';
import CategorySidebar from './components/CategorySidebar';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import SEOHead from './components/SEOHead';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import WelcomeScreen from './components/WelcomeScreen';

// Public Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import YouMayLovePage from './pages/YouMayLovePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SecurityPage from './pages/SecurityPage';
import CookiesPage from './pages/CookiesPage';
import CustomerProfilePage from './pages/CustomerProfilePage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductManagerPage from './pages/admin/ProductManagerPage';
import CategoryManagerPage from './pages/admin/CategoryManagerPage';
import StoreSettingsPage from './pages/admin/StoreSettingsPage';
import StockManagementPage from './pages/admin/StockManagementPage';
import SalesHistoryPage from './pages/admin/SalesHistoryPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import VideoAdsPage from './pages/admin/VideoAdsPage';
import StorefrontLayoutPage from './pages/admin/StorefrontLayoutPage';
import ReviewManagerPage from './pages/admin/ReviewManagerPage';
import HeroManagementPage from './pages/admin/HeroManagementPage';
import HomeCategoryManagementPage from './pages/admin/HomeCategoryManagementPage';

const ScrollToTop = () => {
  const { storeSettings } = useStoreData();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply theme from store settings
  useEffect(() => {
    if (storeSettings?.theme) {
      document.body.setAttribute('data-theme', storeSettings.theme);
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [storeSettings?.theme]);
  return null;
};

const AnalyticsTracker = () => {
  const location = useLocation();
  const { user } = useUserAuth();

  useEffect(() => {
    // Only log paths that are not the admin panel
    if (!location.pathname.startsWith('/admin')) {
      analyticsService.logVisit(location.pathname, user);
    }
  }, [location, user]);

  return null;
};

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col pt-[70px] lg:pt-[84px] overflow-x-hidden relative">
      <Header />
      <CategorySidebar />
      <main className="flex-grow lg:pl-[84px]">
        {/* Global Back Button (Top) */}
        {!isHome && (
          <div className="max-w-none ml-0 px-4 lg:px-8 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group shadow-sm border border-gray-100 dark:border-slate-800"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to results
            </button>
          </div>
        )}
        {children}
      </main>
      <div className="lg:pl-[84px]">
        <Footer />
      </div>

      <FloatingCartButton />
      <FloatingWhatsApp />
    </div>
  );
};

function App() {
  return (
    <LocaleProvider>
      <ToastProvider>
        <UserAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AdminLocaleProvider>
                <AdminAuthProvider>
                  <ScrollToTop />
                  <AnalyticsTracker />
                  <CartDrawer />
                  <WishlistDrawer />
                  <Toast />
                <Routes>
                  {/* Storefront Routes */}
                  <Route path="/" element={<PublicLayout><SEOHead /><HomePage /></PublicLayout>} />
                  <Route path="/category/:categoryName" element={<PublicLayout><CategoryPage /></PublicLayout>} />
                  <Route path="/product/:productId" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
                  <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
                  <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
                  <Route path="/wishlist" element={<PublicLayout><WishlistPage /></PublicLayout>} />
                  <Route path="/login" element={<PublicLayout><CustomerLoginPage /></PublicLayout>} />
                  <Route path="/register" element={<PublicLayout><CustomerRegisterPage /></PublicLayout>} />
                  <Route path="/you-may-love" element={<PublicLayout><YouMayLovePage /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                  <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                  <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
                  <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
                  <Route path="/security" element={<PublicLayout><SecurityPage /></PublicLayout>} />
                  <Route path="/cookies" element={<PublicLayout><CookiesPage /></PublicLayout>} />
                  <Route path="/profile" element={<PublicLayout><CustomerProfilePage /></PublicLayout>} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="products" element={<ProductManagerPage />} />
                    <Route path="products/add" element={<ProductManagerPage />} />
                    <Route path="products/edit/:id" element={<ProductManagerPage />} />
                    <Route path="categories" element={<CategoryManagerPage />} />
                    <Route path="categories/add" element={<CategoryManagerPage />} />
                    <Route path="categories/edit/:id" element={<CategoryManagerPage />} />
                    <Route path="stock" element={<StockManagementPage />} />
                    <Route path="sales" element={<SalesHistoryPage />} />
                    <Route path="settings" element={<StoreSettingsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="video-ads" element={<VideoAdsPage />} />
                    <Route path="layout" element={<StorefrontLayoutPage />} />
                    <Route path="reviews" element={<ReviewManagerPage />} />
                    <Route path="hero" element={<HeroManagementPage />} />
                    <Route path="home-categories" element={<HomeCategoryManagementPage />} />
                  </Route>

                  {/* Universal Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                </AdminAuthProvider>
              </AdminLocaleProvider>
            </CartProvider>
          </WishlistProvider>
        </UserAuthProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}

export default App;
