"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, isToday, subDays, startOfMonth } from "date-fns";
import { Search, CheckSquare, Square, Eye, Trash2, AlertTriangle, TrendingUp, Package, Clock, Filter, ChevronRight } from "lucide-react";
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
}

export function OrdersTableClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ ids: string[], mode: "single" | "bulk" } | null>(null);
  const { addToast } = useToast();

  const tabs = ["All", "Pending", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"];
  const dateOptions = ["All Time", "Today", "Last 7 Days", "This Month"];

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by Tab
    if (activeTab !== "All") {
      result = result.filter(o => {
        if (activeTab === "Pending") return o.payment_status === "pending" || o.fulfillment_status === "pending";
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
        o.email.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, activeTab, dateFilter, searchQuery]);

  // Metrics calculation
  const totalRevenue = useMemo(() => orders.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + Number(o.total), 0), [orders]);
  const pendingCount = useMemo(() => orders.filter(o => o.fulfillment_status === 'pending' || o.fulfillment_status === 'processing').length, [orders]);

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
      addToast({ title: "Deleted", message: `${ids.length} orders deleted.`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Delete Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37]/10 text-[#b8952c] rounded-md border border-[#D4AF37]/20">Paid</span>;
    if (status === 'failed') return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 rounded-md border border-red-100">Failed</span>;
    return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-600 rounded-md border border-neutral-200">Pending</span>;
  };

  const getFulfillmentBadge = (status: string) => {
    if (status === 'delivered') return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 rounded-md border border-green-200">Delivered</span>;
    if (status === 'shipped') return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 rounded-md border border-blue-200">Shipped</span>;
    if (status === 'processing') return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">Packed</span>;
    if (status === 'cancelled') return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-700 rounded-md border border-red-200">Cancelled</span>;
    return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">Unfulfilled</span>;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Total Revenue</h3>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-black font-mono text-neutral-900 mt-4">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Total Orders</h3>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black font-mono text-neutral-900 mt-4">{orders.length}</p>
        </div>
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-24 h-24 text-white" /></div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Action Required</h3>
            <span className="flex h-3 w-3 relative">
              {pendingCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>}
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <p className="text-3xl font-black font-mono text-white mt-4 relative z-10">{pendingCount} <span className="text-sm font-medium font-sans text-neutral-400">Unfulfilled</span></p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 lg:p-5 border-b border-neutral-100 flex flex-col lg:flex-row justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0 border-b lg:border-b-0 border-neutral-100">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${
                  activeTab === tab ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Date Filter */}
            <div className="relative">
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none pl-9 pr-10 py-2 border border-neutral-200 rounded-lg text-xs font-bold uppercase tracking-wider bg-white focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
              >
                {dateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <Filter className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:w-72">
              <input
                type="text"
                placeholder="Search Order / Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-shadow bg-neutral-50 focus:bg-white"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.size > 0 && (
          <div className="bg-[#D4AF37]/10 px-5 py-3 border-b border-[#D4AF37]/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-bold text-[#b8952c]">{selectedOrders.size} order(s) selected</span>
            <div className="flex gap-2">
              <button onClick={handleBulkMarkShipped} disabled={isUpdating} className="px-4 py-1.5 bg-[#D4AF37] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#b8952c] transition-colors">
                Mark as Shipped
              </button>
              <button onClick={() => setDeleteConfirm({ ids: Array.from(selectedOrders), mode: "bulk" })} className="px-4 py-1.5 bg-red-100 text-red-700 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-200 transition-colors">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                <th className="px-5 py-4 w-10">
                  <button onClick={toggleAll} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                    {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare className="w-4 h-4 text-neutral-900" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-5 py-4">Order Info</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Total</th>
                <th className="px-5 py-4 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-500">No orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className={`group hover:bg-neutral-50/50 transition-colors ${selectedOrders.has(order.id) ? 'bg-neutral-50/80' : ''}`}>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleOrder(order.id)} className="text-neutral-300 hover:text-neutral-900 transition-colors">
                        {selectedOrders.has(order.id) ? <CheckSquare className="w-4 h-4 text-neutral-900" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <Link href={`/admin/orders/${order.id}`} className="font-mono font-bold text-sm text-neutral-900 hover:text-[#D4AF37] transition-colors">
                          {order.order_number}
                        </Link>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">
                          {format(new Date(order.created_at), "MMM dd, yyyy · HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-neutral-600">
                            {(order.shipping_address?.fullName?.[0] || order.email?.[0] || "?").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs text-neutral-900 truncate max-w-[140px] lg:max-w-xs">{order.shipping_address?.fullName || "Guest"}</span>
                          <span className="text-[10px] text-neutral-500 truncate max-w-[140px] lg:max-w-xs font-mono">{order.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {getPaymentBadge(order.payment_status)}
                        {getFulfillmentBadge(order.fulfillment_status)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono font-bold text-sm text-neutral-900">₹{order.total.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setDeleteConfirm({ ids: [order.id], mode: "single" })} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !isUpdating && setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete {deleteConfirm.ids.length} Order{deleteConfirm.ids.length > 1 ? 's' : ''}?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              This action cannot be undone. All data and items will be permanently erased.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} disabled={isUpdating} className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteOrders(deleteConfirm.ids)} disabled={isUpdating} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                {isUpdating ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
