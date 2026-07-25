"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none text-center leading-tight cursor-pointer rounded-none";

    const variants = {
      primary: "bg-foreground text-background hover:bg-black",
      secondary: "bg-secondary-background text-foreground hover:bg-gray-200",
      outline: "border border-gray-300 bg-transparent text-foreground hover:border-gray-400",
      ghost: "bg-transparent text-foreground hover:bg-secondary-background",
    };

    const sizes = {
      sm: "min-h-[36px] py-2 px-3 sm:px-4 text-xs tracking-wider uppercase",
      md: "min-h-[44px] py-2.5 px-4 sm:px-6 text-xs sm:text-sm tracking-wider uppercase",
      lg: "min-h-[50px] py-3 px-6 sm:px-8 text-sm sm:text-base tracking-wider uppercase",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Shimmer effect inside a clipped absolute container */}
        {variant === "primary" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              initial={{ x: "-150%" }}
              whileHover={{ x: "150%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        )}
        <span className="relative z-10 flex items-center justify-center gap-2 text-center leading-snug w-full">
          {children}
        </span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";
