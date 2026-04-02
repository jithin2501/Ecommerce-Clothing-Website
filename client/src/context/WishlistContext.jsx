import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // ── 1. Fetch wishlist from DB on login ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`http://localhost:5000/api/client-auth/profile/${user.uid}`);
          const data = await res.json();
          if (data.success && data.user) {
            // Map DB 'productId' back to 'id' for frontend consistency if needed, 
            // or just ensure we store them correctly.
            const dbWishlist = (data.user.wishlist || []).map(item => ({
              ...item,
              id: item.productId // Ensure frontend uses 'id' consistently
            }));
            setWishlist(dbWishlist);
          }
        } catch (err) {
          console.error('Failed to fetch wishlist:', err);
        }
      } else {
        setWishlist([]); // Clear on logout
      }
    });
    return () => unsub();
  }, []);

  // ── 2. Sync wishlist to DB whenever it changes ──
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || wishlist.length === 0 && !user) return; 

    const syncTimeout = setTimeout(async () => {
      try {
        // Map 'id' to 'productId' for DB schema
        const syncData = wishlist.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          img: item.img,
          price: String(item.price),
          category: item.category
        }));

        await fetch('http://localhost:5000/api/client-auth/sync-wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, wishlist: syncData })
        });
      } catch (err) {
        console.error('Failed to sync wishlist:', err);
      }
    }, 1000); // Debounce sync by 1s

    return () => clearTimeout(syncTimeout);
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (!auth.currentUser) {
      alert("Please login to add products to your wishlist");
      navigate('/login');
      return;
    }

    setWishlist(prev => {
      const productId = product.id || product._id;
      const exists = prev.find(p => p.id === productId);
      if (exists) return prev.filter(p => p.id !== productId);
      return [...prev, { ...product, id: productId }];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const isWishlisted = (id) => wishlist.some(p => (p.id === id || p._id === id));

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}