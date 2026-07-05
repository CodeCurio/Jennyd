"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, X, Ticket, RefreshCw, Calendar, Tag, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number;
  usage_limit: number | null;
  times_used: number;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  // Modal display state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState<number | "">("");
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCoupons = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      addToast({ title: "Error fetching coupons", message: error.message, type: "error" });
    } else {
      setCoupons(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCode("");
    setType("percentage");
    setValue("");
    setMinOrderAmount(0);
    setUsageLimit("");
    setValidFrom("");
    setValidTo("");
    setIsActive(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value);
    setMinOrderAmount(coupon.min_order_amount || 0);
    setUsageLimit(coupon.usage_limit ?? "");
    
    if (coupon.valid_from) {
      setValidFrom(new Date(coupon.valid_from).toISOString().substring(0, 16));
    } else {
      setValidFrom("");
    }
    if (coupon.valid_to) {
      setValidTo(new Date(coupon.valid_to).toISOString().substring(0, 16));
    } else {
      setValidTo("");
    }
    setIsActive(coupon.is_active);
    setIsModalOpen(true); // Open Modal for editing
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;
    
    setIsSubmitting(true);
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    setIsSubmitting(false);

    if (error) {
      addToast({ title: "Error deleting", message: error.message, type: "error" });
    } else {
      addToast({ title: "Deleted", message: "Coupon deleted successfully.", type: "success" });
      setCoupons(coupons.filter(c => c.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || value === "") return;
    setIsSubmitting(true);

    const payload = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      min_order_amount: Number(minOrderAmount),
      usage_limit: usageLimit === "" ? null : Number(usageLimit),
      valid_from: validFrom ? new Date(validFrom).toISOString() : null,
      valid_to: validTo ? new Date(validTo).toISOString() : null,
      is_active: isActive
    };

    if (editingId) {
      const { error } = await supabase.from("coupons").update(payload).eq("id", editingId);
      if (error) {
        addToast({ title: "Update Failed", message: error.message, type: "error" });
      } else {
        addToast({ title: "Updated", message: "Coupon updated successfully.", type: "success" });
        setIsModalOpen(false);
        resetForm();
        fetchCoupons();
      }
    } else {
      const { error } = await supabase.from("coupons").insert([payload]);
      if (error) {
        addToast({ title: "Creation Failed", message: error.message, type: "error" });
      } else {
        addToast({ title: "Created", message: "Coupon created successfully.", type: "success" });
        setIsModalOpen(false);
        resetForm();
        fetchCoupons();
      }
    }
    setIsSubmitting(false);
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-4 font-sans max-w-7xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-wider flex items-center gap-3 text-gray-900">
            <Ticket className="w-8 h-8 text-black" strokeWidth={1.5} /> Coupons Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 font-medium">Create discount vouchers, track sales impact, and manage store rules</p>
        </div>

        {/* Create Coupon Trigger Button */}
        <button
          onClick={handleOpenCreate}
          className="bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-none flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Voucher
        </button>
      </div>

      {/* Controls / Search Bar */}
      <div className="bg-white p-4 border border-gray-150 rounded-xl flex gap-3 items-center shadow-xs">
        <input
          type="text"
          placeholder="Search active vouchers by code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-black uppercase font-bold tracking-wider placeholder-gray-400"
        />
        <button 
          onClick={fetchCoupons} 
          disabled={isLoading}
          className="p-2.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition-all"
          title="Refresh list"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-3 bg-white border border-gray-150 rounded-xl shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading vouchers...</span>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-150 rounded-xl shadow-xs text-gray-500">
          <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-350" strokeWidth={1} />
          <p className="text-sm font-bold uppercase tracking-wider text-gray-700">No Vouchers Found</p>
          {searchQuery && <p className="text-xs text-gray-450 mt-1">Try resetting your search query.</p>}
        </div>
      ) : (
        /* Full-width responsive 3-column ticket cards grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const isExpired = coupon.valid_to && new Date(coupon.valid_to) < new Date();
            const usagePercentage = coupon.usage_limit ? Math.round((coupon.times_used / coupon.usage_limit) * 100) : 0;
            const isBeingEdited = editingId === coupon.id;
            
            return (
              <div 
                key={coupon.id} 
                className={`bg-white border rounded-xl shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                  isBeingEdited 
                    ? "ring-2 ring-amber-500 border-transparent shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-amber-50/5" 
                    : "border-gray-200"
                }`}
              >
                {/* Top Row: Tag Code & Edit Actions */}
                <div className="p-5 pb-4 flex justify-between items-start border-b border-dashed border-gray-200 relative">
                  {/* Ticket Notch Left */}
                  <div className="absolute bottom-0 -left-2.5 w-5 h-5 rounded-full bg-gray-50 border-r border-gray-200 translate-y-2.5 z-10" />
                  {/* Ticket Notch Right */}
                  <div className="absolute bottom-0 -right-2.5 w-5 h-5 rounded-full bg-gray-50 border-l border-gray-200 translate-y-2.5 z-10" />

                  <div className="space-y-1">
                    {/* Dotted border ticket code badge */}
                    <span className={`inline-block border-2 border-dashed font-mono font-bold text-sm uppercase tracking-wider px-3.5 py-1 ${
                      isBeingEdited 
                        ? "border-amber-500 bg-amber-50 text-amber-900" 
                        : "border-gray-400 bg-gray-50 text-gray-900"
                    }`}>
                      {coupon.code}
                    </span>
                    <div className="text-[10px] text-gray-450 font-bold uppercase tracking-widest mt-1">
                      {coupon.type === "percentage" ? "Percentage Discount" : "Flat Cash Discount"}
                    </div>
                  </div>

                  {/* Action buttons / Editing badge */}
                  <div className="flex items-center gap-2">
                    {isBeingEdited && (
                      <span className="bg-amber-500 text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs animate-pulse">
                        Editing
                      </span>
                    )}
                    <button
                      onClick={() => handleEdit(coupon)}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        isBeingEdited ? "bg-amber-100 text-amber-950" : "hover:bg-gray-100 text-gray-600"
                      }`}
                      title="Edit Voucher"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-1.5 rounded-md hover:bg-red-55 text-gray-450 hover:text-red-650 transition-all cursor-pointer"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Detailed values */}
                <div className="p-5 pt-5 space-y-4">
                  
                  {/* Large value text */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-gray-900 font-mono">
                      {coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </span>
                    {/* Status Label badge */}
                    {coupon.is_active && !isExpired ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-700 text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                        {isExpired ? "Expired" : "Disabled"}
                      </span>
                    )}
                  </div>

                  {/* Grid parameters */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">
                    
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Min Spend</span>
                      <span className="text-gray-800 font-mono">₹{coupon.min_order_amount.toLocaleString()}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block">Redeemed</span>
                      <span className="text-gray-800 font-mono">
                        {coupon.times_used} <span className="text-gray-400">/ {coupon.usage_limit ?? "∞"}</span>
                      </span>
                    </div>

                    <div className="col-span-2 space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Valid Until
                      </span>
                      <span className="text-gray-700 font-mono text-[10px]">
                        {coupon.valid_to ? new Date(coupon.valid_to).toLocaleDateString("en-IN", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        }) : "Permanent Voucher"}
                      </span>
                    </div>

                  </div>

                  {/* Usage bar */}
                  {coupon.usage_limit && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                        <span>Usage Level</span>
                        <span>{usagePercentage}%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${Math.min(usagePercentage, 100)}%` }} />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Spacious Premium Modal for Creating/Editing Coupons */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        className="max-w-2xl w-full border-t-4 border-t-black"
      >
        <div className="space-y-5 font-sans">
          
          {/* Modal Header */}
          <div className="border-b border-gray-150 pb-3">
            <h2 className="text-xl font-serif font-black uppercase tracking-wider flex items-center gap-2 text-gray-900">
              <Tag className="w-5 h-5" />
              {editingId ? `Modify Voucher: ${code}` : "Create New Voucher"}
            </h2>
            <p className="text-[11px] text-gray-500 font-medium mt-1">Configure discount values, rules, and validity thresholds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold text-gray-750">
            
            {/* Row 1: Code */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Voucher Code *</label>
              <input
                type="text"
                placeholder="e.g. FESTIVAL15"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white uppercase font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
              />
              <p className="text-[10px] text-gray-400">Codes are capitalized automatically on save (e.g. <code>festival15</code> becomes <code>FESTIVAL15</code>).</p>
            </div>

            {/* Row 2: Type & Value (Spacious Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Discount Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-black cursor-pointer text-sm font-bold"
                >
                  <option value="percentage">Percentage discount (%)</option>
                  <option value="fixed">Fixed flat discount (₹)</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">
                  {type === "percentage" ? "Percentage Value (%) *" : "Cash Amount (₹) *"}
                </label>
                <input
                  type="number"
                  placeholder={type === "percentage" ? "15" : "500"}
                  required
                  min="1"
                  value={value}
                  onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black font-mono text-sm font-bold"
                />
              </div>
            </div>

            {/* Row 3: Minimum Spend & Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black font-mono text-sm"
                />
                <span className="text-[10px] text-gray-400 font-medium block flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-gray-400" /> Vouchers only apply if order sum meets this limit.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Voucher Usage Limit</label>
                <input
                  type="number"
                  placeholder="Unlimited usage"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black font-mono text-sm"
                />
                <span className="text-[10px] text-gray-400 font-medium block">
                  Leave empty if voucher can be redeemed infinitely.
                </span>
              </div>
            </div>

            {/* Row 4: Starts From & Expires On */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Active From (Date)</label>
                <input
                  type="datetime-local"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Expires On (Date)</label>
                <input
                  type="datetime-local"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-black text-sm"
                />
              </div>
            </div>

            {/* Row 5: Status checkbox */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-black cursor-pointer rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="isActive" className="text-gray-700 select-none cursor-pointer font-bold tracking-wider text-xs uppercase">
                Publish Voucher status as Active
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 flex gap-4 border-t border-gray-100 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="py-3.5 px-6 border border-gray-250 hover:bg-gray-50 text-[11px] font-bold uppercase tracking-widest text-gray-600 transition-all cursor-pointer rounded-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !code || value === ""}
                className="bg-black hover:bg-gray-800 text-white text-[11px] font-bold uppercase tracking-widest py-3.5 px-8 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none min-w-[150px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingId ? "Update Voucher" : "Save Voucher"}
              </button>
            </div>

          </form>
        </div>
      </Modal>

    </div>
  );
}
