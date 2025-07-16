import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
    <div className="tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg tw:w-full">
      <h2 className="tw:text-xl tw:font-semibold tw:text-blue-700 tw:mb-4">
        Monthly Sales Report - 2025
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={salesData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" className="tw:text-sm" />
          <YAxis className="tw:text-sm" />
          <Tooltip
            contentStyle={{ fontSize: "10px" }}
            cursor={{ fill: "#e0f2fe" }}
          />
          <Bar
            dataKey="sales"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
