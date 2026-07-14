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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#fcfaf8]">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-neutral-200/80 shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[550px] min-h-[500px] select-none">
        
        {/* Left Column: Ambient Luxury Perfume Graphic (Desktop only) */}
        <div className="hidden md:flex md:w-1/2 h-full relative overflow-hidden bg-black select-none">
          <img
            src="/assets/product image 5.jpeg"
            alt="Jennyd Scents Password Reset"
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
              Reset Password
            </h2>
            <p className="text-gray-300 text-xs leading-relaxed font-sans font-light">
              Retrieve your credentials and recover access to your profile securely.
            </p>
          </div>
        </div>

        {/* Right Column: Clean Action Panel (Scroll Safe & High-End) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col bg-white h-full justify-between">
          <div className="my-auto w-full py-2">
            
            {isSent ? (
              <div className="text-center py-4 flex flex-col items-center justify-center gap-5">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-8 h-8 text-green-650" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-gray-900">Check Your Email</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light max-w-sm px-2">
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
              <div className="flex flex-col justify-center">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 tracking-wide">Reset Password</h2>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed font-light font-sans">
                    Enter your email address and we will mail you a link to reset your password.
                  </p>
                </div>

                {/* Error Notification */}
                {error && (
                  <div className="bg-red-50 text-red-600 text-xs px-3.5 py-2.5 rounded-xl border border-red-100 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 animate-ping" />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600 tracking-wide">Email Address</label>
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full !mt-6 py-3 bg-black hover:bg-neutral-900 text-white rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
                    {isLoading ? "Sending Link..." : "Send Reset Link"}
                  </button>
                </form>

                {/* Back to Login option */}
                <div className="mt-8 pt-4 border-t border-neutral-100 text-center">
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
    </div>
  );
}
