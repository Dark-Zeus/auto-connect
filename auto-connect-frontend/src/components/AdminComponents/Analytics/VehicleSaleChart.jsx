import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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

  return (
    <div className="tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg">
      <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-4">
        Vehicle Sales Progress – {year}
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VehicleSalesChart;
