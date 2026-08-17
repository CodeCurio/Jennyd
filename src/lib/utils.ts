import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductVariantInfo(
  product: {
    title?: string;
    metadata?: any;
    type?: string;
    variantInfo?: string;
  },
  selectedSize?: string
): string {
  if (product.variantInfo) return product.variantInfo;

  const sizes = product.metadata?.sizes || [];
  const sizeFromMeta = sizes.length > 0 ? sizes[0].size : undefined;

  let size = selectedSize || sizeFromMeta;

  if (!size && product.title) {
    const titleLower = product.title.toLowerCase();
    const match = titleLower.match(/(\d+\s*ml|\d+\s*oz|\d+\s*g)/i);
    if (match) {
      size = match[0].replace(/\s+/g, "");
    } else if (titleLower.includes("50ml") || titleLower.includes("50 ml")) {
      size = "50ml";
    } else if (titleLower.includes("100ml") || titleLower.includes("100 ml")) {
      size = "100ml";
    } else if (titleLower.includes("12ml") || titleLower.includes("12 ml")) {
      size = "12ml";
    } else if (titleLower.includes("6ml") || titleLower.includes("6 ml")) {
      size = "6ml";
    }
  }

  if (!size) {
    size = "100ml";
  }

  const type = product.metadata?.type || product.type || "Extrait";
  return `${size} ${type}`.trim();
}

