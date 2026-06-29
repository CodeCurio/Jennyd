"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, ChevronDown, CheckSquare, Square, MoreHorizontal, Eye } from "lucide-react";
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
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  const tabs = ["All", "Pending", "Paid", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"];

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by Tab
    if (activeTab !== "All") {
      result = result.filter(o => {
        if (activeTab === "Pending") return o.payment_status === "pending" || o.fulfillment_status === "pending";
        if (activeTab === "Paid") return o.payment_status === "paid";
        if (activeTab === "Packed") return o.fulfillment_status === "processing"; // Mapping processing to packed
        if (activeTab === "Shipped") return o.fulfillment_status === "shipped";
        if (activeTab === "Delivered") return o.fulfillment_status === "delivered";
        if (activeTab === "Cancelled") return o.fulfillment_status === "cancelled";
        if (activeTab === "Returned") return o.payment_status === "refunded"; // Mapping refunded to returned
        return true;
      });
    }

    // Filter by Search Query (Order Number or Email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.order_number.toLowerCase().includes(q) || 
        o.email.toLowerCase().includes(q)
      );
    }

    // Sort by newest first
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, activeTab, searchQuery]);

  const toggleAll = () => {
    if (selectedOrders.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleOrder = (id: string) => {
    const newSet = new Set(selectedOrders);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedOrders(newSet);
  };

  const handleBulkMarkShipped = async () => {
    if (selectedOrders.size === 0) return;
    setIsUpdating(true);
    
    const idsToUpdate = Array.from(selectedOrders);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ fulfillment_status: 'shipped' })
        .in('id', idsToUpdate);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(o => 
        idsToUpdate.includes(o.id) ? { ...o, fulfillment_status: 'shipped' } : o
      ));
      
      setSelectedOrders(new Set());
      addToast({ title: "Orders Updated", message: `${idsToUpdate.length} orders marked as shipped.`, type: "success" });
    } catch (err: any) {
      addToast({ title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFulfillmentBadgeColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800'; // packed
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                  ? "border-black text-black" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by Order # or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          {/* Bulk Action Bar (Visible when items selected) */}
          {selectedOrders.size > 0 && (
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700">{selectedOrders.size} selected</span>
              <button 
                onClick={handleBulkMarkShipped}
                disabled={isUpdating}
                className="bg-black text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Mark as Shipped"}
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-y border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3 w-10">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-black">
                    {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-black" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Fulfillment</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className={`hover:bg-gray-50 ${selectedOrders.has(order.id) ? 'bg-gray-50' : ''}`}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleOrder(order.id)} className="text-gray-400 hover:text-black">
                        {selectedOrders.has(order.id) ? (
                          <CheckSquare className="w-5 h-5 text-black" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.shipping_address?.fullName || "Guest"}</span>
                        <span className="text-xs text-gray-500">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getPaymentBadgeColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getFulfillmentBadgeColor(order.fulfillment_status)}`}>
                        {order.fulfillment_status === 'processing' ? 'packed' : order.fulfillment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm hover:shadow transition-all">
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
