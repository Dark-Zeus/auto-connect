import React from "react";
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
import { TrendingUp } from "lucide-react";

// Sample data: monthly updates from three service centers
const data = [
  { month: "May", centerA: 0, centerB: 0, centerC: 0 },
  { month: "Jun", centerA: 0, centerB: 0, centerC: 0 },
  { month: "Jul", centerA: 0, centerB: 0, centerC: 0 },
  { month: "Aug", centerA: 0, centerB: 0, centerC: 0 },
  { month: "Sep", centerA: 2, centerB: 2, centerC: 2 },
  { month: "Oct", centerA: 3, centerB: 7, centerC: 3 },
];

// Transform to calculate total updates per month
const transformedData = data.map((item) => ({
  month: item.month,
  total: item.centerA + item.centerB + item.centerC,
}));

function ServiceCenterUsageLineChart() {
  return (
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:w-full tw:relative tw:overflow-hidden tw:border tw:border-blue-100">
      {/* Decorative background */}
      <div className="tw:absolute tw:top-0 tw:right-0 tw:w-32 tw:h-32 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
      <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-24 tw:h-24 tw:bg-gradient-to-tr tw:from-indigo-100 tw:to-blue-50 tw:rounded-full tw:opacity-50 tw:-z-10"></div>

      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-6 tw:flex tw:items-center tw:gap-2">
        <TrendingUp className="tw:w-6 tw:h-6 tw:text-blue-500" />
        Monthly Total Service Center Updates
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          {/* Define a linear gradient for the line stroke */}
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="4"
                floodColor="#3B82F6"
                floodOpacity="0.15"
              />
            </filter>
          </defs>

          {/* Grid and axes */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#2563eb", fontWeight: 600 }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#2563eb", fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e0e7ff",
              color: "#1e293b",
              fontWeight: 500,
              boxShadow: "0 4px 24px 0 rgba(59,130,246,0.10)",
            }}
            labelStyle={{ color: "#2563eb", fontWeight: 700 }}
            formatter={(value) => [`${value} updates`, "Total"]}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ color: "#2563eb" }}
          />

          {/* Blue gradient line with shadow */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="url(#blueGradient)"
            strokeWidth={4}
            dot={{
              r: 6,
              stroke: "#3B82F6",
              strokeWidth: 2,
              fill: "#fff",
              filter: "url(#shadow)",
            }}
            activeDot={{
              r: 10,
              fill: "#3B82F6",
              stroke: "#fff",
              strokeWidth: 3,
              filter: "url(#shadow)",
            }}
            name="Total Updates"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary below chart */}
      <div className="tw-mt-6 tw-flex tw-justify-between tw-items-center tw-gap-4 tw-flex-wrap">
        <div className="tw-bg-blue-50 tw:px-4 tw-py-2 tw-rounded-xl tw-text-blue-700 tw-font-semibold tw-shadow-sm">
          Peak Month:{" "}
          <span className="tw-text-blue-900">
            {
              transformedData.reduce((a, b) => (a.total > b.total ? a : b))
                .month
            }
          </span>
        </div>
        <div className="tw-bg-green-50 tw:px-4 tw-py-2 tw-rounded-xl tw-text-green-700 tw-font-semibold tw-shadow-sm">
          Total Updates:{" "}
          <span className="tw-text-green-900">
            {transformedData.reduce((sum, d) => sum + d.total, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ServiceCenterUsageLineChart;
