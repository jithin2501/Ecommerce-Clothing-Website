import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import { CartProvider } from './context/CartContext';
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
          <Route path="/contact"                            element={<ContactPage />} />
          <Route path="/account"                            element={<PersonInformation />} />
          <Route path="/account/addresses"                  element={<ManageAddresses />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;