"use client";

import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, required, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    return (
      <div className="relative w-full pt-6">
        <motion.label
          htmlFor={id}
          initial={false}
          animate={{
            y: isFocused || hasValue ? -24 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? "var(--color-accent)" : "var(--color-secondary-foreground)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-4 top-10 origin-left pointer-events-none text-base"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </motion.label>
        <input
          ref={ref}
          id={id}
          required={required}
          className={cn(
            "w-full h-14 px-4 bg-transparent border border-gray-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value.length > 0);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
          }}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
