import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const isWishlisted = (id) => wishlist.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}