"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { Search, Loader2, Users, TrendingUp, DollarSign, UserCheck, X, FileText, Calendar, Mail, Phone, ShoppingBag, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  admin_notes: string | null;
}

interface CustomerStats {
  ordersCount: number;
  totalSpent: number;
  aov: number;
}

export default function AdminCustomersPage() {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Note/Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [hasNotesColumn, setHasNotesColumn] = useState(true); // Defensive flag

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Customers
      const { data: customerData, error: customerError } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, created_at, admin_notes")
        .eq("role", "customer");

      // Handle missing admin_notes column gracefully
      if (customerError && customerError.message.includes("admin_notes")) {
        setHasNotesColumn(false);
        const { data: fallbackData } = await supabase
          .from("profiles")
          .select("id, email, full_name, phone, created_at")
          .eq("role", "customer");
        setCustomers(
          fallbackData?.map((c: any) => ({
            ...c,
            admin_notes: null
          })) || []
        );
      } else if (customerData) {
        setCustomers(customerData);
      }

      // 2. Fetch Orders to calculate Lifetime Value (LTV)
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, user_id, total, created_at, fulfillment_status, order_number");
      
      setOrders(ordersData || []);
    } catch (err: any) {
      addToast({ title: "Fetch Error", message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map user_id to lifetime stats
  const statsMap = useMemo(() => {
    const map: Record<string, CustomerStats> = {};
    
    // Initialize stats for each customer
    customers.forEach(c => {
      map[c.id] = { ordersCount: 0, totalSpent: 0, aov: 0 };
    });

    // Populate from orders
    orders.forEach(order => {
      if (order.user_id && map[order.user_id]) {
        // Only count valid, non-failed/non-cancelled orders for LTV
        if (order.fulfillment_status !== "cancelled") {
          const stats = map[order.user_id];
          stats.ordersCount += 1;
          stats.totalSpent += Number(order.total) || 0;
        }
      }
    });

    // Calculate AOV
    Object.keys(map).forEach(userId => {
      const stats = map[userId];
      if (stats.ordersCount > 0) {
        stats.aov = Math.round(stats.totalSpent / stats.ordersCount);
      }
    });

    return map;
  }, [customers, orders]);

  // Aggregate values for Overview Cards
  const overviewStats = useMemo(() => {
    const totalCustomers = customers.length;
    let totalLtv = 0;
    let topSpender = { name: "N/A", value: 0 };

    Object.keys(statsMap).forEach(userId => {
      const stats = statsMap[userId];
      totalLtv += stats.totalSpent;

      if (stats.totalSpent > topSpender.value) {
        const customer = customers.find(c => c.id === userId);
        if (customer) {
          topSpender = {
            name: customer.full_name || customer.email,
            value: stats.totalSpent
          };
        }
      }
    });

    const avgLtv = totalCustomers > 0 ? Math.round(totalLtv / totalCustomers) : 0;

    return {
      totalCustomers,
      avgLtv,
      topSpender
    };
  }, [customers, statsMap]);

  // Filtered List based on Search Query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(c => 
      (c.full_name && c.full_name.toLowerCase().includes(q)) || 
      c.email.toLowerCase().includes(q) || 
      (c.phone && c.phone.includes(q))
    );
  }, [customers, searchQuery]);

  // Open Details Dialog
  const handleOpenDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAdminNotes(customer.admin_notes || "");
    
    // Filter orders belonging to this customer
    const userOrders = orders.filter(o => o.user_id === customer.id);
    setCustomerOrders(userOrders);
  };

  // Save Admin Notes
  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ admin_notes: adminNotes })
        .eq("id", selectedCustomer.id);

      if (error) throw error;

      // Update local state
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, admin_notes: adminNotes } : c));
      addToast({ title: "Saved", message: "Admin notes updated successfully.", type: "success" });
      setSelectedCustomer(null);
    } catch (err: any) {
      addToast({ title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white border border-gray-150 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading customers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Customer Relationship Management</h1>
      </div>

      {/* Migration Notice */}
      {!hasNotesColumn && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-bold">Admin Notes Column Missing</p>
            <p className="mt-1">
              To enable customer admin notes editing, please run the following SQL command in your{" "}
              <a href="https://supabase.com/dashboard" target="_blank" className="underline font-bold">Supabase SQL Editor</a>:
            </p>
            <code className="block bg-amber-100 p-2 rounded mt-2 font-mono text-[10px] select-all cursor-pointer">
              ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin_notes TEXT;
            </code>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.totalCustomers}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Customers</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{overviewStats.avgLtv.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg. Customer LTV</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-gray-900 truncate">{overviewStats.topSpender.name}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Top Spender (₹{overviewStats.topSpender.value.toLocaleString("en-IN")})</p>
          </div>
        </div>
      </div>

      {/* Filter and Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Customer Listing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-y border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Total Spend (LTV)</th>
                <th className="px-6 py-3">Avg. Order Value</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const stats = statsMap[customer.id] || { ordersCount: 0, totalSpent: 0, aov: 0 };
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-xs uppercase">
                            {(customer.full_name || customer.email || "?")[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">{customer.full_name || "Guest Customer"}</span>
                            <span className="text-xs text-gray-500 font-mono lowercase">{customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {format(new Date(customer.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-xs">
                        {customer.phone || "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {stats.ordersCount}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{stats.totalSpent.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-500">
                        ₹{stats.aov.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDetails(customer)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & Notes Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => !isSavingNotes && setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="font-bold text-gray-900 text-lg">Customer Profile Details</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-xl uppercase shadow-sm">
                    {(selectedCustomer.full_name || selectedCustomer.email || "?")[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-wide">{selectedCustomer.full_name || "Guest Customer"}</h4>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" /> Member Since {format(new Date(selectedCustomer.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Lifetime spent</p>
                      <p className="text-base font-black text-gray-900 mt-0.5">₹{(statsMap[selectedCustomer.id]?.totalSpent || 0).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="border-l border-gray-200 pl-4">
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Orders</p>
                      <p className="text-base font-black text-gray-900 mt-0.5">{(statsMap[selectedCustomer.id]?.ordersCount || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Contact & Orders */}
                <div className="space-y-4">
                  <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Contact Details
                  </h5>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 text-xs space-y-4">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Email Address</span>
                      <span className="font-mono text-sm text-gray-900 select-all font-semibold break-all">{selectedCustomer.email}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</span>
                      <span className="font-mono text-sm text-gray-900 select-all font-semibold">{selectedCustomer.phone || "No phone added"}</span>
                    </div>
                  </div>

                  <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1.5 pt-2">
                    <ShoppingBag className="w-3.5 h-3.5" /> Order History
                  </h5>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 max-h-48 overflow-y-auto">
                    {customerOrders.length === 0 ? (
                      <p className="p-4 text-xs text-center text-gray-500">No orders placed.</p>
                    ) : (
                      customerOrders.map(order => (
                        <div key={order.id} className="p-3 flex justify-between items-center text-xs font-semibold">
                          <div>
                            <span className="font-mono font-bold text-gray-900 block">{order.order_number}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              order.fulfillment_status === "cancelled" ? "bg-red-100 text-red-800" :
                              order.fulfillment_status === "shipped" || order.fulfillment_status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>{order.fulfillment_status}</span>
                            <span className="font-mono font-bold text-gray-900">₹{Number(order.total).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column: Admin Notes */}
                <div className="space-y-3 flex flex-col h-full">
                  <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Admin Notes
                  </h5>
                  {hasNotesColumn ? (
                    <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes about customer preferences, premium shipping requests, custom discounts..."
                        className="w-full flex-1 p-4 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] resize-none"
                      />
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                      >
                        {isSavingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        {isSavingNotes ? "Saving..." : "Save Notes"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-800">
                      <p className="font-bold">Admin notes are currently disabled.</p>
                      <p className="mt-1">Add the `admin_notes` column to the profiles table to unlock customer notes.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
