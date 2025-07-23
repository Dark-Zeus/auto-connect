import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Car } from "lucide-react";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

// Simulated data fetch
const fetchMonthlyVehicleSales = async (year) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sales = monthNames.map((month) => ({
        month,
        sales: Math.floor(Math.random() * 100) + 20,
      }));
      resolve(sales);
    }, 600);
  });
};

function VehicleSalesChart() {
  const [data, setData] = useState([]);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchMonthlyVehicleSales(year).then(setData);
  }, [year]);

  // Find peak month and total sales for summary
  const peak = data.reduce(
    (acc, cur) => (cur.sales > acc.sales ? cur : acc),
    { sales: 0 }
  );
  const total = data.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="tw:bg-white tw:p-8 tw:rounded-2xl tw:shadow-xl tw:relative tw:overflow-hidden tw:border tw:border-blue-100">
      {/* Decorative background */}
      <div className="tw:absolute tw:top-0 tw:right-0 tw:w-24 tw:h-24 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
      <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-16 tw:h-16 tw:bg-gradient-to-tr tw:from-indigo-100 tw:to-blue-50 tw:rounded-full tw:opacity-50 tw:-z-10"></div>

      <div className="tw:flex tw:items-center tw:gap-2 tw:mb-4">
        <Car className="tw:w-6 tw:h-6 tw:text-blue-500" />
        <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800">
          Vehicle Sales Progress – {year}
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.15" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#2563eb", fontWeight: 600 }} />
          <YAxis allowDecimals={false} tick={{ fill: "#2563eb", fontWeight: 600 }} />
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
            formatter={(value) => [`${value} sales`, "Sales"]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorSales)"
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
            name="Sales"
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Summary below chart */}
      <div className="tw-mt-6 tw-flex tw-justify-between tw-items-center tw-gap-4 tw-flex-wrap">
        <div className="tw-bg-blue-50 tw:px-4 tw-py-2 tw-rounded-xl tw-text-blue-700 tw-font-semibold tw-shadow-sm">
          Peak Month:{" "}
          <span className="tw-text-blue-900">{peak.month || "-"}</span>
        </div>
        <div className="tw-bg-green-50 tw:px-4 tw-py-2 tw-rounded-xl tw-text-green-700 tw-font-semibold tw-shadow-sm">
          Total Sales:{" "}
          <span className="tw-text-green-900">{total}</span>
        </div>
      </div>
    </div>
  );
}

export default VehicleSalesChart;
