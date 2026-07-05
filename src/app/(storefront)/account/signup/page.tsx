"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, UserPlus } from "lucide-react";
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#fcfaf8]">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">Join JennyD Scents for exclusive offers and order tracking.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100 mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-5 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>{" "}and{" "}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link href="/account/login" className="font-bold text-[#D4AF37] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
