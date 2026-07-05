"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardProps, setDashboardProps] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // 1. Fetch Orders (For Sales, Revenue, AOV, Failed Payments)
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, total, payment_status, created_at, user_id, email");

      const orders = ordersData || [];

      // Metrics aggregations
      let todaySales = 0;
      let weeklyRevenue = 0;
      let totalRevenue = 0;
      let failedPaymentsCount = 0;
      
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();

      orders.forEach((order) => {
        const orderDate = new Date(order.created_at).getTime();
        const total = Number(order.total) || 0;

        if (order.payment_status === "failed") {
          failedPaymentsCount++;
        } else if (order.payment_status === "paid" || order.payment_status === "pending") {
          totalRevenue += total;
          
          if (orderDate >= startOfDay) {
            todaySales += total;
          }
          if (orderDate >= startOfWeek) {
            weeklyRevenue += total;
          }
        }
      });

      const totalOrders = orders.filter(o => o.payment_status !== "failed").length;
      const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // 2. Fetch Products (For Inventory Alerts)
      const { data: productsData } = await supabase
        .from("products")
        .select("id, stock_quantity, title");
      
      const products = productsData || [];
      
      let outOfStockCount = 0;
      let lowStockCount = 0;

      products.forEach(p => {
        const stock = Number(p.stock_quantity) || 0;
        if (stock === 0) outOfStockCount++;
        else if (stock < 10) lowStockCount++;
      });

      // 3. Mock Complex Data (Conversion Rate, Reorder Rate, Charts)
      const mockedConversionRate = 3.2;
      const mockedReturningCustomerRate = 18.5;

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const salesTrend = days.map((day) => ({
        date: day,
        revenue: Math.floor(Math.random() * 20000) + 5000
      }));

      const productPerformance = [
        { name: "Oud Royale EDP", sales: 120 },
        { name: "Italian Summer 50ML", sales: 98 },
        { name: "Midnight Rose", sales: 85 },
        { name: "Desert Sand", sales: 45 },
        { name: "Ocean Breeze", sales: 30 },
      ];

      const geographicSales = [
        { state: "Maharashtra", revenue: 150000 },
        { state: "Delhi", revenue: 120000 },
        { state: "Karnataka", revenue: 95000 },
        { state: "Gujarat", revenue: 65000 },
        { state: "Tamil Nadu", revenue: 45000 },
      ];

      const revenueByChannel = [
        { name: "Organic Search", value: 45 },
        { name: "Instagram Ads", value: 30 },
        { name: "Direct", value: 15 },
        { name: "Email Marketing", value: 10 },
      ];

      setDashboardProps({
        metrics: {
          todaySales,
          weeklyRevenue,
          totalOrders,
          aov,
          conversionRate: mockedConversionRate,
          returningCustomerRate: mockedReturningCustomerRate
        },
        alerts: {
          outOfStockCount,
          lowStockCount,
          failedPaymentsCount
        },
        charts: {
          salesTrend,
          productPerformance,
          geographicSales,
          revenueByChannel
        }
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !dashboardProps) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white border border-gray-150 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <AdminDashboardClient 
      metrics={dashboardProps.metrics}
      alerts={dashboardProps.alerts}
      charts={dashboardProps.charts}
    />
  );
}
