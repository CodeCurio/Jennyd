"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, createContext, useContext } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="relative w-80 overflow-hidden premium-card bg-card p-4"
    >
      <button onClick={onRemove} className="absolute right-2 top-2 text-secondary-foreground hover:text-foreground">
        <X size={16} />
      </button>
      <h4 className="font-medium text-foreground">{toast.title}</h4>
      {toast.message && <p className="text-sm text-secondary-foreground mt-1">{toast.message}</p>}
      
      {/* Shrinking progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 3, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${
          toast.type === "error" ? "bg-destructive" : toast.type === "success" ? "bg-success" : "bg-accent"
        }`}
      />
    </motion.div>
  );
}
