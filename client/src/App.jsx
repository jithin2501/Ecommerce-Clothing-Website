import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CollectionsPage from './pages/collections/CollectionsPage';
import AgeGroupPage from './pages/collections/AgeGroupPage';
import CollectionDetailPage from './pages/collectiondetails/CollectionDetailPage';
import CartPage from './pages/cart/CartPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/"                                   element={<HomePage />} />
          <Route path="/collections"                        element={<CollectionsPage />} />
          <Route path="/collections/:ageGroup"              element={<AgeGroupPage />} />
          <Route path="/collections/:ageGroup/:productSlug" element={<CollectionDetailPage />} />
          <Route path="/cart"                               element={<CartPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;