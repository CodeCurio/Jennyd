"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, isToday, subDays, startOfMonth } from "date-fns";
import { Search, CheckSquare, Square, Trash2, AlertTriangle, TrendingUp, Package, Clock, Filter, ChevronRight, Truck, ExternalLink, MessageSquare, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  email: string;
  total: number;
  payment_status: string;
  fulfillment_status: string;
  shipping_address: any;
  metadata: any;
  order_items?: any[];
}

export function OrdersTableClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ ids: string[], mode: "single" | "bulk" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addToast } = useToast();

  const tabs = ["All", "Unfulfilled", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"];
  const dateOptions = ["All Time", "Today", "Last 7 Days", "This Month"];

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by Tab
    if (activeTab !== "All") {
      result = result.filter(o => {
        if (activeTab === "Unfulfilled") return o.fulfillment_status === "pending" || !o.fulfillment_status;
        if (activeTab === "Paid") return o.payment_status === "paid";
        if (activeTab === "Packed") return o.fulfillment_status === "processing";
        if (activeTab === "Shipped") return o.fulfillment_status === "shipped";
        if (activeTab === "Delivered") return o.fulfillment_status === "delivered";
        if (activeTab === "Cancelled") return o.fulfillment_status === "cancelled";
        return true;
      });
    }

    // Filter by Date
    if (dateFilter !== "All Time") {
      const now = new Date();
      result = result.filter(o => {
        const orderDate = new Date(o.created_at);
        if (dateFilter === "Today") return isToday(orderDate);
        if (dateFilter === "Last 7 Days") return orderDate >= subDays(now, 7);
        if (dateFilter === "This Month") return orderDate >= startOfMonth(now);
        return true;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.order_number.toLowerCase().includes(q) || 
        o.email.toLowerCase().includes(q) ||
        (o.shipping_address?.fullName || "").toLowerCase().includes(q) ||
        (o.shipping_address?.phone || "").toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, activeTab, dateFilter, searchQuery]);

  // Metrics calculation
  const totalRevenue = useMemo(() => orders.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + Number(o.total), 0), [orders]);
  const pendingCount = useMemo(() => orders.filter(o => o.fulfillment_status === 'pending' || o.fulfillment_status === 'processing' || !o.fulfillment_status).length, [orders]);

  const toggleAll = () => {
    if (selectedOrders.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleOrder = (id: string) => {
    const newSet = new Set(selectedOrders);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedOrders(newSet);
  };

  const updateSingleOrderStatus = async (orderId: string, newFulfillmentStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('orders').update({ fulfillment_status: newFulfillmentStatus }).eq('id', orderId);
      if (error) throw error;
      
      const targetOrder = orders.find(o => o.id === orderId);

      // Trigger packed email if status is processing
      if (newFulfillmentStatus === 'processing' && targetOrder) {
        try {
          await fetch('/api/emails/order-packed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: targetOrder.email,
              orderNumber: targetOrder.order_number,
              customerName: targetOrder.shipping_address?.fullName || 'Valued Customer',
              items: targetOrder.order_items || [],
              shippingAddress: targetOrder.shipping_address
            })
          });
        } catch (emailErr) {
          console.error("Failed to trigger packed email:", emailErr);
        }
      }

      setOrders(orders.map(o => o.id === orderId ? { ...o, fulfillment_status: newFulfillmentStatus } : o));
      addToast({ title: "Status Updated", message: `Order status set to ${newFulfillmentStatus.toUpperCase()}. Email notification sent!`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkMarkShipped = async () => {
    if (selectedOrders.size === 0) return;
    setIsUpdating(true);
    const idsToUpdate = Array.from(selectedOrders);
    try {
      const { error } = await supabase.from('orders').update({ fulfillment_status: 'shipped' }).in('id', idsToUpdate);
      if (error) throw error;
      setOrders(orders.map(o => idsToUpdate.includes(o.id) ? { ...o, fulfillment_status: 'shipped' } : o));
      setSelectedOrders(new Set());
      addToast({ title: "Orders Updated", message: `${idsToUpdate.length} orders marked as shipped.`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrders = async (ids: string[]) => {
    setIsUpdating(true);
    try {
      const { error: itemsError } = await supabase.from('order_items').delete().in('order_id', ids);
      if (itemsError) throw itemsError;
      const { error: ordersError } = await supabase.from('orders').delete().in('id', ids);
      if (ordersError) throw ordersError;
      setOrders(orders.filter(o => !ids.includes(o.id)));
      setSelectedOrders(prev => {
        const newSet = new Set(prev);
        ids.forEach(id => newSet.delete(id));
        return newSet;
      });
      setDeleteConfirm(null);
      addToast({ title: "Deleted", message: `${ids.length} order(s) deleted.`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Delete Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* Compact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Total Orders</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900 mt-2">{orders.length}</p>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Action Needed</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {pendingCount} <span className="text-xs font-normal text-neutral-400 font-sans">Unfulfilled Orders</span>
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-2xs border border-neutral-200 overflow-hidden">
        
        {/* Compact Toolbar */}
        <div className="p-3 sm:p-4 border-b border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-50/40">
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap rounded-lg transition-all cursor-pointer ${
                  activeTab === tab ? "bg-neutral-900 text-white shadow-2xs" : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Date Filter */}
            <div className="relative">
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-8 pr-7 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold uppercase tracking-wider bg-white focus:outline-none focus:border-neutral-900 cursor-pointer"
              >
                {dateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <Filter className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search order, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900 bg-white"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedOrders.size > 0 && (
          <div className="bg-[#D4AF37]/10 px-4 py-2.5 border-b border-[#D4AF37]/20 flex items-center justify-between animate-in fade-in">
            <span className="text-xs font-bold text-[#b8952c]">{selectedOrders.size} order(s) selected</span>
            <div className="flex gap-2">
              <button onClick={handleBulkMarkShipped} disabled={isUpdating} className="px-3 py-1 bg-[#D4AF37] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#b8952c] cursor-pointer">
                Mark Shipped
              </button>
              <button onClick={() => setDeleteConfirm({ ids: Array.from(selectedOrders), mode: "bulk" })} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-200 cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* High-Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                <th className="px-4 py-3 w-8">
                  <button onClick={toggleAll} className="text-neutral-400 hover:text-neutral-900 cursor-pointer">
                    {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare className="w-3.5 h-3.5 text-neutral-900" /> : <Square className="w-3.5 h-3.5" />}
                  </button>
                </th>
                <th className="px-4 py-3">Order Details</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status Control</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Package className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-neutral-500">No orders match your filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const firstItem = order.order_items?.[0];
                  const itemThumbnail = firstItem?.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                  const itemCount = order.order_items?.length || 1;
                  const cleanPhone = (order.shipping_address?.phone || "").replace(/\D/g, "");
                  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}` : null;

                  return (
                    <tr key={order.id} className={`group hover:bg-neutral-50/60 transition-colors ${selectedOrders.has(order.id) ? 'bg-neutral-50/80' : ''}`}>
                      
                      <td className="px-4 py-3">
                        <button onClick={() => toggleOrder(order.id)} className="text-neutral-300 hover:text-neutral-900 cursor-pointer">
                          {selectedOrders.has(order.id) ? <CheckSquare className="w-3.5 h-3.5 text-neutral-900" /> : <Square className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Order Info */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <Link href={`/admin/orders/${order.id}`} className="font-mono font-bold text-xs text-neutral-900 hover:text-[#D4AF37] transition-colors">
                            #{order.order_number}
                          </Link>
                          <span className="text-[10px] font-mono text-neutral-400 mt-0.5">
                            {format(new Date(order.created_at), "MMM dd, hh:mm a")}
                          </span>
                        </div>
                      </td>

                      {/* Product Thumbnail Avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0 relative">
                            <img src={itemThumbnail} alt="Product" className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-neutral-800 truncate max-w-[150px]">
                              {firstItem?.title || "Fragrance"}
                            </p>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {itemCount > 1 ? `+${itemCount - 1} more items` : firstItem?.variant_info?.size || "100ml"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info & Quick WhatsApp Chat */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-neutral-900 truncate max-w-[130px]">
                              {order.shipping_address?.fullName || "Guest Customer"}
                            </span>
                            {whatsappUrl && (
                              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp" className="text-emerald-600 hover:text-emerald-700 p-0.5">
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 truncate max-w-[130px] font-mono">{order.email}</span>
                        </div>
                      </td>

                      {/* Status Selector Inline */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          
                          {/* Payment status badge */}
                          {order.payment_status === 'paid' ? (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Paid</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded">COD / Pending</span>
                          )}

                          {/* Inline Fulfillment Status Changer */}
                          <select
                            value={order.fulfillment_status || "pending"}
                            onChange={(e) => updateSingleOrderStatus(order.id, e.target.value)}
                            disabled={isUpdating}
                            className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded border border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800 cursor-pointer focus:outline-none"
                          >
                            <option value="pending">🟡 Unfulfilled</option>
                            <option value="processing">📦 Packed</option>
                            <option value="shipped">🚚 Shipped</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-xs text-neutral-900">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link 
                            href={`/admin/orders/${order.id}`} 
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                          <button 
                            onClick={() => setDeleteConfirm({ ids: [order.id], mode: "single" })} 
                            className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={() => !isUpdating && setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center animate-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">Delete {deleteConfirm.ids.length} Order{deleteConfirm.ids.length > 1 ? 's' : ''}?</h3>
            <p className="text-xs text-neutral-500 mb-5">
              This action cannot be undone. Order records and database items will be permanently erased.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} disabled={isUpdating} className="flex-1 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer">Cancel</button>
              <button onClick={() => handleDeleteOrders(deleteConfirm.ids)} disabled={isUpdating} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 cursor-pointer">
                {isUpdating ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
