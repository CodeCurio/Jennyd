"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setIsSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[75vh] md:min-h-[calc(100vh-80px-280px)] bg-white border-b border-neutral-100">
      
      {/* Left Column: Ambient Luxury Perfume Graphic (Desktop only, Edge-to-Edge) */}
      <div className="hidden md:flex md:w-1/2 relative bg-black select-none">
        <img
          src="/assets/product image 5.jpeg"
          alt="Jennyd Scents Password Reset"
          className="absolute inset-0 w-full h-full object-cover opacity-75 object-center"
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
            Reset Password
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans font-light max-w-sm">
            Retrieve your credentials and recover access to your profile securely.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Action Panel (Centered, Edge-to-Edge) */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-16 px-6 sm:px-12 md:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md flex flex-col gap-6 sm:gap-8">
          
          {isSent ? (
            <div className="text-center py-4 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center animate-bounce">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-semibold text-gray-900">Check Your Email</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light max-w-sm px-2">
                  We&apos;ve sent a secure password reset link to <span className="font-semibold text-gray-800">{email}</span>.
                </p>
              </div>
              <Link
                href="/account/login"
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col justify-center w-full gap-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-950 tracking-wide">Reset Password</h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed font-light font-sans">
                  Enter your email address and we will mail you a link to reset your password.
                </p>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="bg-red-50 text-red-655 text-xs sm:text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-655 rounded-full flex-shrink-0 animate-ping" />
                  <p className="font-semibold">{error}</p>
                </div>
              )}

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full !mt-6 py-3.5 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
                </button>
              </form>

              {/* Back to Login option */}
              <div className="pt-4 border-t border-neutral-100 text-center">
                <Link 
                  href="/account/login" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
