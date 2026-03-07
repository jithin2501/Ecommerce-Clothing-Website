import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CollectionsPage from './pages/collections/CollectionsPage';
import AgeGroupPage from './pages/collections/AgeGroupPage';
import CollectionDetailPage from './pages/collectiondetails/CollectionDetailPage';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar — permanent on every page */}
      <Navbar />

      <Routes>
        <Route path="/"                                         element={<HomePage />} />
        <Route path="/collections"                              element={<CollectionsPage />} />
        <Route path="/collections/:ageGroup"                    element={<AgeGroupPage />} />
        <Route path="/collections/:ageGroup/:productSlug"       element={<CollectionDetailPage />} />
      </Routes>

      {/* Footer — permanent on every page */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;