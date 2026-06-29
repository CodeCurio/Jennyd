import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronLeft, MapPin, User, CreditCard, Box } from "lucide-react";
import { OrderActionsClient } from "@/components/admin/OrderActionsClient";

export const revalidate = 0; // Disable cache for admin details

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // Fetch Order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/admin/orders" className="text-blue-600 hover:underline">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  // Fetch Order Items
  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(slug, metadata)")
    .eq("order_id", orderId);

  const orderItems = items || [];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest flex items-center gap-3">
              Order {order.order_number}
              <span className="text-xs tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">
                {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Badges */}
            <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md ${
              order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.payment_status}
            </span>
            <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md ${
              order.fulfillment_status === 'shipped' || order.fulfillment_status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {order.fulfillment_status === 'processing' ? 'packed' : order.fulfillment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <OrderActionsClient 
          orderId={order.id} 
          currentFulfillment={order.fulfillment_status} 
          currentPayment={order.payment_status} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Items & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Box className="w-4 h-4 text-gray-500" /> Purchased Items
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {orderItems.map((item: any) => {
                const imageUrl = item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                const productSlug = item.products?.slug;

                return (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-16 h-16 relative bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                      <Image src={imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">
                        {productSlug ? (
                          <Link href={`/products/${productSlug}`} target="_blank" className="hover:underline">
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">₹{Number(item.unit_price).toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{Number(item.line_total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Totals */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{Number(order.shipping_cost).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                <span className="text-xl font-black">₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Customer Details */}
        <div className="space-y-6">
          
          {/* Customer Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" /> Customer
              </h2>
            </div>
            <div className="p-4 text-sm space-y-3">
              <div>
                <p className="font-medium text-gray-900">{order.shipping_address?.fullName || "Guest Customer"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Contact Info</p>
                <p className="text-blue-600 hover:underline break-all">{order.email}</p>
                {order.shipping_address?.phone && (
                  <p className="text-gray-700">{order.shipping_address.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" /> Shipping Address
              </h2>
            </div>
            <div className="p-4 text-sm space-y-1 text-gray-700">
              <p className="font-medium">{order.shipping_address?.fullName}</p>
              <p>{order.shipping_address?.addressLine1}</p>
              {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}</p>
              <p>{order.shipping_address?.country}</p>
            </div>
          </div>

          {/* Payment Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" /> Payment Details
              </h2>
            </div>
            <div className="p-4 text-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gateway</span>
                <span className="font-medium">Razorpay</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-xs">{order.razorpay_payment_id || "N/A"}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
