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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#fcfaf8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-2">We&apos;ll send you a link to reset your password.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
          {isSent ? (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-500 mb-6">
                We&apos;ve sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
              </p>
              <Link
                href="/account/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100 mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link href="/account/login" className="font-bold text-[#D4AF37] hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
