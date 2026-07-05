"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variantInfo?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  subtotal: number;
  itemCount: number;
  appliedCoupon: any | null;
  discount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("jennyd_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    const savedCoupon = localStorage.getItem("jennyd_applied_coupon");
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {}
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("jennyd_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (appliedCoupon) {
        localStorage.setItem("jennyd_applied_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("jennyd_applied_coupon");
      }
    }
  }, [appliedCoupon, isInitialized]);

  const addItem = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Recalculate discount whenever subtotal or coupon changes
  const discount = (() => {
    if (!appliedCoupon) return 0;
    if (subtotal < (appliedCoupon.min_order_amount || 0)) {
      return 0; // Invalid because minimum order value is not met
    }
    if (appliedCoupon.type === "percentage") {
      return Math.round(subtotal * (Number(appliedCoupon.value) / 100));
    }
    if (appliedCoupon.type === "fixed") {
      return Math.min(subtotal, Number(appliedCoupon.value));
    }
    return 0;
  })();

  // Remove coupon if subtotal falls below minimum order amount
  useEffect(() => {
    if (appliedCoupon && subtotal < (appliedCoupon.min_order_amount || 0)) {
      setAppliedCoupon(null);
    }
  }, [subtotal, appliedCoupon]);

  const applyCoupon = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        return { success: false, message: "Invalid coupon code" };
      }

      // Check min order amount
      if (subtotal < (data.min_order_amount || 0)) {
        return { 
          success: false, 
          message: `Minimum order value of ₹${data.min_order_amount} required` 
        };
      }

      // Check usage limits
      if (data.usage_limit && data.times_used >= data.usage_limit) {
        return { success: false, message: "Coupon usage limit reached" };
      }

      // Check dates
      const now = new Date();
      if (data.valid_from && new Date(data.valid_from) > now) {
        return { success: false, message: "Coupon is not active yet" };
      }
      if (data.valid_to && new Date(data.valid_to) < now) {
        return { success: false, message: "Coupon has expired" };
      }

      setAppliedCoupon(data);
      return { success: true, message: "Coupon applied successfully!" };
    } catch (err) {
      return { success: false, message: "Error applying coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        subtotal,
        itemCount,
        appliedCoupon,
        discount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
