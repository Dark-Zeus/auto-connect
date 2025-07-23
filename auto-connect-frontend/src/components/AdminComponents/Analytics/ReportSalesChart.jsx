import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function MonthlySalesBarChart() {
  // Sales data defined inside the component
  const salesData = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 2100 },
    { month: "Mar", sales: 800 },
    { month: "Apr", sales: 1600 },
    { month: "May", sales: 1800 },
    { month: "Jun", sales: 900 },
    { month: "Jul", sales: 1300 },
  ];

  return (
    <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-50 tw:p-8 tw:rounded-3xl tw:shadow-2xl tw:w-full tw:border tw:border-blue-100">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
        <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-800 tw:tracking-tight">
          📊 Monthly Sales Report{" "}
          <span className="tw:text-base tw:font-semibold tw:text-blue-400">
            2025
          </span>
        </h2>
        <span className="tw:bg-blue-100 tw:text-blue-700 tw:px-4 tw:py-1 tw:rounded-full tw:text-xs tw:font-bold tw:shadow">
          Updated: July 2025
        </span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#dbeafe"
          />
          <XAxis
            dataKey="month"
            className="tw:text-sm"
            tick={{ fill: "#1e40af", fontWeight: 600 }}
            axisLine={{ stroke: "#93c5fd" }}
            tickLine={false}
          />
          <YAxis
            className="tw:text-sm"
            tick={{ fill: "#64748b", fontWeight: 500 }}
            axisLine={{ stroke: "#93c5fd" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #93c5fd",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#1e293b",
              boxShadow: "0 4px 24px 0 #dbeafe",
            }}
            labelStyle={{ color: "#2563eb", fontWeight: 700 }}
            cursor={{ fill: "#dbeafe" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: 16,
              fontWeight: 600,
              color: "#2563eb",
            }}
          />
          <Bar
            dataKey="sales"
            name="Sales (LKR)"
            fill="url(#barGradient)"
            radius={[12, 12, 0, 0]}
            barSize={32}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}