import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const fetchMonthlyRevenue = async (year) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const revenueData = monthNames.map((month) => ({
        month,
        revenue: parseFloat((Math.random() * 10000 + 2000).toFixed(2)),
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

  return (
    <div className="tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg tw:mt-6">
      <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-4">
        Monthly Revenue Trend – {year}
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={true} tickFormatter={(val) => `$${val / 1000}k`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueTrendChart;
