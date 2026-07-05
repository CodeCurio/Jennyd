"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { MapPin, Plus, Edit2, Trash2, Star, Loader2, X } from "lucide-react";

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
      // If setting as default, unset all others first
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
        addToast({ title: "Added", message: "New address added.", type: "success" });
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
      addToast({ title: "Updated", message: "Default address changed.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {/* Address Cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No saved addresses</h3>
          <p className="text-sm text-gray-500 mb-6">Add your first address for quicker checkout.</p>
          <button
            onClick={openAddForm}
            className="inline-block bg-black text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-xl border shadow-sm p-5 relative transition-all ${
                addr.is_default ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/20" : "border-gray-100"
              }`}
            >
              {addr.is_default && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" /> Default
                  </span>
                </div>
              )}

              <p className="font-bold text-sm text-gray-900 uppercase tracking-wide">{addr.full_name}</p>
              {addr.phone && <p className="text-xs text-gray-500 mt-0.5 font-mono">{addr.phone}</p>}
              <div className="mt-3 text-xs text-gray-600 space-y-0.5 leading-relaxed">
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>{addr.city}, {addr.state} - {addr.zip}</p>
                <p className="text-gray-400 uppercase tracking-wider text-[10px] font-bold mt-1">{addr.country}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                <button
                  onClick={() => openEditForm(addr)}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#b8962f] transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" /> Set Default
                  </button>
                )}
                <button
                  onClick={() => setDeleteConfirm(addr.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              {/* Delete Confirm Inline */}
              {deleteConfirm === addr.id && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center justify-between gap-3">
                  <p className="text-xs text-red-600 font-medium">Delete this address?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-200 bg-white">Cancel</button>
                    <button onClick={() => handleDelete(addr.id)} className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900">{editingId ? "Edit Address" : "Add New Address"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address Line 1 *</label>
                <input required value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address Line 2</label>
                <input value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">City *</label>
                  <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">State *</label>
                  <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">PIN Code *</label>
                  <input required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
                <label htmlFor="is_default" className="text-sm text-gray-600 font-medium cursor-pointer">Set as default address</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
