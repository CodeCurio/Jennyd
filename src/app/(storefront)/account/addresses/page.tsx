"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { MapPin, Plus, Edit2, Trash2, Star, Loader2, X, Check } from "lucide-react";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

const EMPTY_FORM: Omit<Address, "id"> = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  is_default: false,
};

export default function AddressBookPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchAddresses = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    setAddresses(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setForm({
      full_name: address.full_name,
      phone: address.phone || "",
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      if (form.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingId) {
        const { error } = await supabase
          .from("addresses")
          .update(form)
          .eq("id", editingId);
        if (error) throw error;
        addToast({ title: "Updated", message: "Address updated successfully.", type: "success" });
      } else {
        const { error } = await supabase
          .from("addresses")
          .insert({ ...form, user_id: user.id });
        if (error) throw error;
        addToast({ title: "Added", message: "New address added to book.", type: "success" });
      }

      setShowForm(false);
      setEditingId(null);
      await fetchAddresses();
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
      setAddresses(addresses.filter((a) => a.id !== id));
      setDeleteConfirm(null);
      addToast({ title: "Deleted", message: "Address removed.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      await supabase.from("addresses").update({ is_default: true }).eq("id", id);
      await fetchAddresses();
      addToast({ title: "Updated", message: "Default address updated.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 bg-white rounded-2xl border border-neutral-200/90 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* ── Page Header ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-neutral-900">Address Book</h2>
          <p className="text-xs text-neutral-400">Save and manage delivery addresses for instant checkout</p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* ── Address Cards Grid ── */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-10 text-center space-y-3">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-900">No saved addresses</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">Add your primary delivery address for 1-click checkout.</p>
          <button
            onClick={openAddForm}
            className="inline-block bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-2xl border p-5 relative transition-all shadow-2xs flex flex-col justify-between ${
                addr.is_default ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/30" : "border-neutral-200/90"
              }`}
            >
              {addr.is_default && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#b8962f] text-[10px] font-bold uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" /> Default
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-neutral-900 uppercase tracking-wide">{addr.full_name}</p>
                  {addr.phone && <p className="text-xs text-neutral-400 font-mono mt-0.5">{addr.phone}</p>}
                </div>

                <div className="text-xs text-neutral-600 leading-relaxed font-sans pt-1">
                  <p>{addr.address_line1}</p>
                  {addr.address_line2 && <p>{addr.address_line2}</p>}
                  <p className="font-medium text-neutral-800">{addr.city}, {addr.state} - {addr.zip}</p>
                  <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider mt-1">{addr.country}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditForm(addr)}
                    className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>

                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:text-[#b8962f] transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Make Default
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setDeleteConfirm(addr.id)}
                  className="text-xs font-bold text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>

              {/* Delete Confirmation Box */}
              {deleteConfirm === addr.id && (
                <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between gap-3 text-xs">
                  <p className="text-red-700 font-medium">Delete address?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDeleteConfirm(null)} 
                      className="px-2.5 py-1 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleDelete(addr.id)} 
                      className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold uppercase tracking-wider"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" 
          onClick={() => !isSubmitting && setShowForm(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-200" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="font-serif font-bold text-neutral-900">{editingId ? "Edit Address" : "Add New Address"}</h3>
              <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Full Name *</label>
                  <input 
                    required 
                    value={form.full_name} 
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-[#D4AF37]" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Phone Number</label>
                  <input 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-[#D4AF37]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Street Address Line 1 *</label>
                <input 
                  required 
                  value={form.address_line1} 
                  onChange={(e) => setForm({ ...form, address_line1: e.target.value })} 
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-[#D4AF37]" 
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Apartment, Suite (Optional)</label>
                <input 
                  value={form.address_line2} 
                  onChange={(e) => setForm({ ...form, address_line2: e.target.value })} 
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-[#D4AF37]" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">City *</label>
                  <input 
                    required 
                    value={form.city} 
                    onChange={(e) => setForm({ ...form, city: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-[#D4AF37]" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">State *</label>
                  <input 
                    required 
                    value={form.state} 
                    onChange={(e) => setForm({ ...form, state: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-[#D4AF37]" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">PIN / Zip *</label>
                  <input 
                    required 
                    value={form.zip} 
                    onChange={(e) => setForm({ ...form, zip: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl font-mono focus:outline-none focus:border-[#D4AF37]" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <label htmlFor="is_default" className="text-xs text-neutral-700 font-semibold cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-neutral-300 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
