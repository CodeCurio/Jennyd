"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/store/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setIsLoading(false);
    } else {
      router.push("/account");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[75vh] md:min-h-[calc(100vh-80px-280px)] bg-white border-b border-neutral-100">
      
      {/* Left Column: Ambient Luxury Perfume Graphic (Desktop only, Edge-to-Edge) */}
      <div className="hidden md:flex md:w-1/2 relative bg-black select-none">
        <img
          src="/assets/product image 2.jpeg"
          alt="Jennyd Scents Ambient Background"
          className="absolute inset-0 w-full h-full object-cover opacity-75 object-center animate-fade-in"
        />
        {/* Dark gold-infused radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/35 to-transparent" />
        
        {/* Brand narrative at bottom */}
        <div className="absolute bottom-16 left-16 right-16 z-10 text-left text-white">
          <span className="font-serif text-2xl tracking-widest text-[#D4AF37] font-normal uppercase block mb-2">
            Jennyd
          </span>
          <span className="h-[1.5px] w-14 bg-[#D4AF37] block mb-5" />
          <h2 className="text-3xl font-serif font-normal leading-tight mb-2">
            Artisanal Blends
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans font-light max-w-sm">
            Crafted for the extraordinary. Natural essential oils, hand-poured to linger.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Login Panel (Centered, Edge-to-Edge) */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-16 px-6 sm:px-12 md:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md flex flex-col gap-6 sm:gap-8">
          
          {/* Header */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-950 tracking-wide">Welcome Back</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed font-light font-sans">
              Sign in to access your dashboard, order history, and custom profiles.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs sm:text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 animate-ping" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Google Login Action */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 active:scale-[0.98] bg-white shadow-2xs cursor-pointer"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500" />
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Visual Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or email sign-in</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50/40 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-600 tracking-wide">Password</label>
                <Link href="/account/forgot-password" className="text-xs text-[#D4AF37] font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-neutral-50/40 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full !mt-6 py-3.5 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Action Links Below Form */}
          <div className="pt-4 border-t border-neutral-100 text-center text-xs sm:text-sm text-gray-500 flex flex-col items-center gap-1">
            <span>Don&apos;t have an account? <Link href="/account/signup" className="font-bold text-[#D4AF37] hover:underline">Create Account</Link></span>
          </div>

        </div>
      </div>
    </div>
  );
}
