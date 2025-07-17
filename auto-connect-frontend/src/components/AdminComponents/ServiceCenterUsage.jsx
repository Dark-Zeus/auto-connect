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

// Sample data: monthly updates from three service centers
const data = [
  { month: "Jan", centerA: 30, centerB: 20, centerC: 27 },
  { month: "Feb", centerA: 25, centerB: 22, centerC: 30 },
  { month: "Mar", centerA: 35, centerB: 18, centerC: 28 },
  { month: "Apr", centerA: 40, centerB: 24, centerC: 32 },
  { month: "May", centerA: 28, centerB: 20, centerC: 25 },
  { month: "Jun", centerA: 32, centerB: 27, centerC: 38 },
];

// Transform to calculate total updates per month
const transformedData = data.map((item) => ({
  month: item.month,
  total: item.centerA + item.centerB + item.centerC,
}));

function ServiceCenterUsageLineChart() {
  return (
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-6 tw:w-full tw:mx-auto">
      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-6">
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
          </defs>

          {/* Grid and axes */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          {/* Blue gradient line */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="url(#blueGradient)"
            strokeWidth={3}
            dot={{ r: 5, stroke: "#3B82F6", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 8 }}
            name="Total Updates"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ServiceCenterUsageLineChart;
