import type { NextPage } from 'next';
import { createContext, useContext, useEffect, useState } from 'react';

type Wishlist = {
  wishlist: string[];
  addToWishlist: (planetId: string) => void;
  removeFromWishlist: (planetId: string) => void;
};

const WishlistContext = createContext<Wishlist>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {}
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: NextPage = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error('Error parsing wishlist data:', error);
      }
    }
  }, []);

  const saveWishlistToLocalStorage = (wishlist: string[]) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const addToWishlist = (planetId: string) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = [...prevWishlist, planetId];
      saveWishlistToLocalStorage(updatedWishlist);
      return updatedWishlist;
    });
  };

  const removeFromWishlist = (planetId: string) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((id) => id !== planetId);
      saveWishlistToLocalStorage(updatedWishlist);
      return updatedWishlist;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
