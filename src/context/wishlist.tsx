import type { NextPage } from 'next';
import { createContext, useContext, useState } from 'react';

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

  const addToWishlist = (planetId: string) => {
    setWishlist((prevWishlist) => [...prevWishlist, planetId]);
  };

  const removeFromWishlist = (planetId: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== planetId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
