"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "../ui/Button";

export function CartDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif">Your Cart</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-secondary-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-secondary-foreground">
                  <div className="w-24 h-24 bg-secondary-background rounded-full flex items-center justify-center mb-4">
                    <Trash2 size={32} />
                  </div>
                  <p>Your cart is empty.</p>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0, x: 50 }}
                        animate={{ opacity: 1, height: "auto", x: 0 }}
                        exit={{ opacity: 0, height: 0, x: 50 }}
                        className="flex gap-4 overflow-hidden"
                      >
                        <div className="relative w-20 h-24 bg-secondary-background shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-foreground">{item.title}</h3>
                              {item.variantInfo && <p className="text-sm text-secondary-foreground">{item.variantInfo}</p>}
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-secondary-foreground hover:text-destructive">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-300">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-secondary-background">
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-secondary-background">
                                <Plus size={14} />
                              </button>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-secondary-background/50">
                <div className="flex justify-between mb-4 text-lg font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-secondary-foreground mb-6">Shipping and taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={() => setIsDrawerOpen(false)} className="block">
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
