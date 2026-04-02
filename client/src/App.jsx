import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/navbar/Navbar';
import Footer from './components/navbar/Footer';
import HomePage from './pages/Mainpage/HomePage';
import CollectionsPage from './pages/collections/CollectionsPage';
import AgeGroupPage from './pages/collections/AgeGroupPage';
import CollectionDetailPage from './pages/collectiondetails/CollectionDetailPage';
import CartPage from './pages/cart/CartPage';
import ContactPage from './pages/contact/ContactPage';
import PersonInformation from './pages/personinformation/PersonInformation';
import ManageAddresses from './pages/manageaddresses/ManageAddresses';
import MyOrders from './pages/myorders/MyOrders';
import Wishlist from './pages/wishlist/Wishlist';
import MyReviews from './pages/myreviews/MyReviews';
import WriteReview from './pages/myorders/WriteReview';
import SupportHub from './pages/support/SupportHub';
import OrderHelp from './pages/support/OrderHelp';
import ChatSupport from './pages/support/ChatSupport';
import ReviewSubmit from './pages/review/ReviewSubmit';
import Policy from './pages/policy/Policy';

// ── Category pages (folder: src/pages/categories) ───────────────────────────
import OccasionDailyWearFrocks from './pages/categories/OccasionDailyWearFrocks';
import PartyWearCollection from './pages/categories/PartyWearCollection';
import DesignerPremiumFrocks from './pages/categories/DesignerPremiumFrocks';
import TraditionalEthnicFrocks from './pages/categories/TraditionalEthnicFrocks';
import FabricBasedCategories from './pages/categories/FabricBasedCategories';
// ────────────────────────────────────────────────────────────────────────────

import AdminLayout from './admin/layout/AdminLayout';
import Contact from './admin/views/Contactmessage';
import UserManagement from './admin/views/UserManagement';
import ChangeUsername from './admin/views/ChangeUsername';
import ChangePassword from './admin/views/ChangePassword';
import ReviewManagement from './admin/views/reviewmanagement';
import ProductManagement from './admin/views/ProductManagement';
import ProductDetailPage from './admin/views/ProductDetailPage';
import ReviewQRPage from './admin/views/ReviewQRPage';
import ClientManagement from './admin/views/ClientManagement';
import Login from './admin/login/Login';
import ProtectedRoute from './admin/login/Protectedroute';
import UserLogin from './components/auth/Login';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />

        {/* ── Category pages ── */}
        <Route path="/collections/occasion-daily-wear-frocks" element={<OccasionDailyWearFrocks />} />
        <Route path="/collections/party-wear-collection" element={<PartyWearCollection />} />
        <Route path="/collections/designer-premium-frocks" element={<DesignerPremiumFrocks />} />
        <Route path="/collections/traditional-ethnic-frocks" element={<TraditionalEthnicFrocks />} />
        <Route path="/collections/fabric-based-categories" element={<FabricBasedCategories />} />
        {/* ─────────────────── */}

        <Route path="/collections/:ageGroup" element={<AgeGroupPage />} />
        <Route path="/collections/:ageGroup/:productSlug" element={<CollectionDetailPage />} />
        <Route path="/collections/product/:productId" element={<CollectionDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<PersonInformation />} />
        <Route path="/account/addresses" element={<ManageAddresses />} />
        <Route path="/account/orders" element={<MyOrders />} />
        <Route path="/account/wishlist" element={<Wishlist />} />
        <Route path="/account/reviews" element={<MyReviews />} />
        <Route path="/account/write-review" element={<WriteReview />} />
        <Route path="/support" element={<SupportHub />} />
        <Route path="/support/order-help" element={<OrderHelp />} />
        <Route path="/support/chat" element={<ChatSupport />} />
        <Route path="/review" element={<ReviewSubmit />} />
        <Route path="/account/policy/:type" element={<Policy />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Routes>

            {/* Client login — no Navbar/Footer */}
            <Route path="/login" element={<UserLogin />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin protected routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/contact" replace />} />
              <Route path="contact" element={<Contact />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="change-username" element={<ChangeUsername />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="reviews" element={<ReviewManagement />} />
              <Route path="review-qr" element={<ReviewQRPage />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:productId/details" element={<ProductDetailPage />} />
              <Route path="clients" element={<ClientManagement />} />
            </Route>

            {/* All public pages with Navbar + Footer */}
            <Route path="/*" element={<PublicLayout />} />

          </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
