import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";

const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const fetchMonthlyRevenue = async (year) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const revenueData = monthNames.map((month) => ({
        month,
        revenue: parseFloat((Math.random() * 100000 + 2000).toFixed(2)),
      }));
      resolve(revenueData);
    }, 800);
  });
};

function RevenueTrendChart() {
  const currentYear = new Date().getFullYear();
  const [year] = useState(currentYear);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMonthlyRevenue(year).then(setData);
  }, [year]);

  // Find peak month and total revenue for summary
  const peak = data.reduce(
    (acc, cur) => (cur.revenue > acc.revenue ? cur : acc),
    { revenue: 0 }
  );
  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="tw:bg-white tw:p-8 tw:rounded-2xl tw:shadow-xl tw:relative tw:overflow-hidden tw:border tw:border-green-100 tw:mt-6">
      {/* Decorative background */}
      <div className="tw:absolute tw:top-0 tw:right-0 tw:w-24 tw:h-24 tw:bg-gradient-to-br tw:from-green-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
      <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-16 tw:h-16 tw:bg-gradient-to-tr tw:from-blue-100 tw:to-green-50 tw:rounded-full tw:opacity-50 tw:-z-10"></div>

      <div className="tw:flex tw:items-center tw:gap-2 tw:mb-4">
        <TrendingUp className="tw:w-6 tw:h-6 tw:text-green-500" />
        <h2 className="tw:text-2xl tw:font-bold tw:text-green-800">
          Monthly Revenue Trend – {year}
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.15" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#059669", fontWeight: 600 }} />
          <YAxis
            allowDecimals={true}
            tickFormatter={(val) => `LKR ${(val / 1000).toFixed(1)}k`}
            tick={{ fill: "#059669", fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontWeight: 500,
              boxShadow: "0 4px 24px 0 rgba(16,185,129,0.10)",
            }}
            labelStyle={{ color: "#059669", fontWeight: 700 }}
            formatter={(value) => [`LKR ${value.toLocaleString()}`, "Revenue"]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="url(#revenueLine)"
            strokeWidth={4}
            dot={{
              r: 6,
              stroke: "#10b981",
              strokeWidth: 2,
              fill: "#fff",
              filter: "url(#shadow)",
            }}
            activeDot={{
              r: 10,
              fill: "#10b981",
              stroke: "#fff",
              strokeWidth: 3,
              filter: "url(#shadow)",
            }}
            name="Revenue"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* Summary below chart */}
      <div className="tw:mt-6 tw:flex tw:justify-between tw:items-center tw:gap-4 tw:flex-wrap">
        <div className="tw:bg-green-50 tw:px-4 tw:py-2 tw:rounded-xl tw:text-green-700 tw:font-semibold tw:shadow-sm">
          Peak Month:{" "}
          <span className="tw:text-green-900">{peak.month || "-"}</span>
        </div>
        <div className="tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:text-blue-700 tw:font-semibold tw:shadow-sm">
          Total Revenue:{" "}
          <span className="tw:text-blue-900">LKR {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
}

export default RevenueTrendChart;
