import { createContext, useContext, useMemo, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readJSON(STORAGE_KEYS.cart, []));

  const persist = (next) => {
    setItems(next);
    writeJSON(STORAGE_KEYS.cart, next);
  };

  const addItem = (product, quantity = 1) => {
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      persist(items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)));
    } else {
      persist([...items, { ...product, quantity }]);
    }
  };

  const removeItem = (id) => persist(items.filter((i) => i.id !== id));

  const setQuantity = (id, quantity) => {
    persist(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, total, count: items.length }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
