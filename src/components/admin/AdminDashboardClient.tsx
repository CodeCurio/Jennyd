"use client";

import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from "recharts";
import { TrendingUp, Users, ShoppingBag, IndianRupee, AlertCircle, AlertTriangle, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  metrics: {
    todaySales: number;
    weeklyRevenue: number;
    totalOrders: number;
    aov: number;
    conversionRate: number;
    returningCustomerRate: number;
  };
  alerts: {
    outOfStockCount: number;
    lowStockCount: number;
    failedPaymentsCount: number;
  };
  charts: {
    salesTrend: { date: string; revenue: number }[];
    productPerformance: { name: string; sales: number }[];
    geographicSales: { state: string; revenue: number }[];
    revenueByChannel: { name: string; value: number }[];
  };
}

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB"];

export function AdminDashboardClient({ metrics, alerts, charts }: DashboardProps) {
  
  // Format currency helper
  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest">Business Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time snapshot of your store's performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="bg-black text-white px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Add Product
          </Link>
        </div>
      </div>

      {/* Alerts Section (Only shows if there are alerts) */}
      {(alerts.outOfStockCount > 0 || alerts.lowStockCount > 0 || alerts.failedPaymentsCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.outOfStockCount > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider">Out of Stock</h4>
                <p className="text-xs text-red-600 mt-1">{alerts.outOfStockCount} products currently out of stock.</p>
              </div>
            </div>
          )}
          {alerts.lowStockCount > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wider">Low Inventory</h4>
                <p className="text-xs text-yellow-700 mt-1">{alerts.lowStockCount} products are running low.</p>
              </div>
            </div>
          )}
          {alerts.failedPaymentsCount > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider">Failed Payments</h4>
                <p className="text-xs text-orange-600 mt-1">{alerts.failedPaymentsCount} payments failed recently.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Today's Sales" 
          value={formatCurrency(metrics.todaySales)} 
          icon={<IndianRupee className="w-5 h-5" />} 
          trend="up" 
          trendValue="+12%" 
        />
        <MetricCard 
          title="Weekly Revenue" 
          value={formatCurrency(metrics.weeklyRevenue)} 
          icon={<TrendingUp className="w-5 h-5" />} 
          trend="up" 
          trendValue="+5.4%" 
        />
        <MetricCard 
          title="Total Orders" 
          value={metrics.totalOrders.toString()} 
          icon={<ShoppingBag className="w-5 h-5" />} 
          trend="up" 
          trendValue="+8%" 
        />
        <MetricCard 
          title="Avg Order Value" 
          value={formatCurrency(metrics.aov)} 
          icon={<IndianRupee className="w-5 h-5" />} 
          trend="down" 
          trendValue="-2.1%" 
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${metrics.conversionRate}%`} 
          icon={<Users className="w-5 h-5" />} 
          trend="up" 
          trendValue="+0.6%" 
        />
        <MetricCard 
          title="Returning Customers" 
          value={`${metrics.returningCustomerRate}%`} 
          icon={<Users className="w-5 h-5" />} 
          trend="up" 
          trendValue="+2.4%" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sales Trend */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Sales Trend (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                <RechartsTooltip 
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), "Revenue"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Top Performing Products</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.productPerformance} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827', fontWeight: 500 }} />
                <RechartsTooltip 
                  formatter={(value: any) => [value, "Units Sold"]}
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#000000" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Heatmap (Bar representation) */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Revenue by Region</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.geographicSales} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                <RechartsTooltip 
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), "Revenue"]}
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#4B5563" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Channel */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Revenue by Channel</h3>
          <div className="flex-1 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.revenueByChannel}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {charts.revenueByChannel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => [`${value}%`, "Share"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

// Sub-component for Metric Cards
function MetricCard({ title, value, icon, trend, trendValue }: { title: string, value: string, icon: React.ReactNode, trend: 'up' | 'down', trendValue: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h3>
        <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-black text-gray-900 mb-2">{value}</p>
        <div className={`flex items-center text-xs font-bold tracking-wide ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trendValue} <span className="text-gray-400 font-medium ml-1">vs last period</span>
        </div>
      </div>
    </div>
  );
}
