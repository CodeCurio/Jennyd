"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { UserCircle, Lock, Loader2, Save, Eye, EyeOff } from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Populate from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("id", user.id);

    if (error) {
      addToast({ title: "Error", message: error.message, type: "error" });
    } else {
      await refreshProfile();
      addToast({ title: "Saved", message: "Profile updated successfully.", type: "success" });
    }

    setIsSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    // Verify current password by re-signing in
    if (user?.email) {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        setPasswordError("Current password is incorrect.");
        setIsSavingPassword(false);
        return;
      }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      addToast({ title: "Updated", message: "Password changed successfully.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }

    setIsSavingPassword(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Personal Information</h3>
            <p className="text-xs text-gray-400">Update your name and phone number</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
          {/* Avatar/Initials */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8962f] flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {(profile?.full_name || user?.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900">{profile?.full_name || "Set your name"}</p>
              <p className="text-sm text-gray-500 font-mono">{user?.email}</p>
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 mt-1">Email address cannot be changed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Change Password</h3>
            <p className="text-xs text-gray-400">Keep your account secure with a strong password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-5">
          {passwordError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full pl-3.5 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full pl-3.5 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
