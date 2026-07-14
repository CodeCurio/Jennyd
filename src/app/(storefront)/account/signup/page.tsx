"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/store/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) {
      setError(signUpError);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#fcfaf8]">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-neutral-200/80 shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[580px] md:h-auto select-none">
        
        {/* Left Column: Ambient Luxury Perfume Graphic (Desktop only) */}
        <div className="hidden md:flex md:w-1/2 h-stretch relative overflow-hidden bg-black select-none">
          <img
            src="/assets/product image 4.jpeg"
            alt="Jennyd Scents Join Us Background"
            className="absolute inset-0 w-full h-full object-cover opacity-75 object-center"
          />
          {/* Dark gold-infused radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/35 to-transparent" />
          
          {/* Brand narrative at bottom */}
          <div className="absolute bottom-12 left-12 right-12 z-10 text-left text-white">
            <span className="font-serif text-xl tracking-widest text-[#D4AF37] font-normal uppercase block mb-2">
              Jennyd
            </span>
            <span className="h-[1px] w-12 bg-[#D4AF37] block mb-4" />
            <h2 className="text-2xl md:text-3xl font-serif font-normal leading-tight mb-2">
              Create Account
            </h2>
            <p className="text-gray-300 text-xs leading-relaxed font-sans font-light">
              Join Jennyd Scents for exclusive collections, tailored profiles, and order tracking.
            </p>
          </div>
        </div>

        {/* Right Column: Clean Registration Panel (Scroll Safe & High-End) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col bg-white h-full justify-between">
          <div className="my-auto w-full py-2">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 tracking-wide">Create Account</h2>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed font-light font-sans">
                Join us to experience pure fragrance luxury and tailored benefits.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-red-50 text-red-650 text-xs px-3.5 py-2.5 rounded-xl border border-red-100 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 animate-ping" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Google Login Action */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-neutral-200 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 hover:border-neutral-300 transition-all duration-300 active:scale-[0.98] bg-white shadow-2xs cursor-pointer"
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
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">or register with email</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600 tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-605 text-gray-600 tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Stacked Full Width */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-650 text-gray-600 tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300"
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

              {/* Confirm Password Stacked Full Width */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-650 text-gray-600 tracking-wide">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15 focus:border-[#D4AF37] transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full !mt-6 py-3 bg-black hover:bg-neutral-900 text-white rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Footer inside right panel */}
            <div className="mt-8 pt-4 border-t border-neutral-100 flex flex-col items-center gap-2 text-center text-xs text-gray-500">
              <span>Already have an account? <Link href="/account/login" className="font-bold text-[#D4AF37] hover:underline">Sign In</Link></span>
              <p className="text-[10px] text-gray-400 leading-relaxed font-light px-2 mt-1">
                By registering, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link> & <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
