"use client";

export const dynamic = 'force-dynamic';

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useInvoiceStore } from "@/store/invoice-store";
// import { invoiceService } from "@/lib/services/invoice-service";
// import { formatCurrency } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { dummyInvoices, dashboardStats, chartData } from "@/data/invoices";
import { DollarSign, Briefcase, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { invoices, stats, setInvoices } = useInvoiceStore();
  const { isDark } = useTheme();

  useEffect(() => {
    // Load dummy data for demo
    setInvoices(dummyInvoices as any);
  }, [setInvoices]);

  const recentInvoices = dummyInvoices.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Invoice Card */}
        <div className="bg-gray-800 dark:bg-slate-800 text-white p-8 rounded-xl shadow-lg flex items-start justify-between">
          <div>
            <p className="text-gray-400 dark:text-slate-400 text-sm mb-2">Total invoice</p>
            <h3 className="text-4xl font-bold">
              ${dashboardStats.totalInvoice.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-gray-900" />
          </div>
        </div>

        {/* Amount Paid Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Amount Paid</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                ${dashboardStats.amountPaid.toFixed(2)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-600 dark:text-slate-400" />
            </div>
          </div>
        </div>

        {/* Pending Payment Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Pending Payment</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                ${dashboardStats.pendingPayment.toFixed(2)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600 dark:text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Working Capital</h3>
          </div>
          <select
            title="Select date range"
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 focus:outline-none"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-slate-400">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-slate-400">Expenses</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#475569" : "#e5e7eb"}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#64748b" : "#9ca3af"}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#9ca3af"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
                border: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
                borderRadius: "8px",
                color: isDark ? "#f1f5f9" : "#000",
              }}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              wrapperStyle={{
                color: isDark ? "#94a3b8" : "#9ca3af",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#B8E53E"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Invoice</h3>
          </div>
          <Link href="/dashboard/invoices" className="text-primary hover:underline text-sm font-medium">
            View All <span className="ml-1">→</span>
          </Link>
        </div>

        {/* Table Header */}
        <div className="px-8 py-4 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-700 grid grid-cols-6 gap-4 text-sm text-gray-600 dark:text-slate-400 font-medium">
          <span>NAME/CLIENT</span>
          <span>DATE</span>
          <span>ORDERS/TYPE</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>

        {/* Table Rows */}
        {recentInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="px-8 py-5 border-b border-gray-200 dark:border-slate-700 grid grid-cols-6 gap-4 items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            {/* Name/Client */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {invoice.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{invoice.clientName}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">Inv: {invoice.invoiceNumber}</p>
              </div>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-gray-900 dark:text-slate-200">{invoice.date}</p>
            </div>

            {/* Orders/Type */}
            <div>
              <p className="text-sm text-gray-900 dark:text-slate-200">{invoice.orderType}</p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-200">
                ${invoice.amount.toFixed(2)}
              </p>
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                }`}
              >
                {invoice.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>

            {/* Action */}
            <div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg" title="More options">
                <MoreVertical className="w-5 h-5 text-gray-400 dark:text-slate-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
