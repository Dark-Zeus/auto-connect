import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"
];

// Simulate fetching monthly user registration data
const fetchMonthlyRegistrations = async (year) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const registrations = monthNames.map((month) => ({
        month,
        registrations: Math.floor(Math.random() * 100) + 20,
      }));
      resolve(registrations);
    }, 800);
  });
};

function UserRegistrationChart() {
  const currentYear = new Date().getFullYear();
  const [year] = useState(currentYear);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMonthlyRegistrations(year).then(setData);
  }, [year]);

  return (
    <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-50 tw:p-8 tw:rounded-3xl tw:shadow-2xl tw:w-full tw:border tw:border-blue-100">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
        <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-800 tw:tracking-tight">
          👤 User Registration Progress <span className="tw:text-base tw:font-semibold tw:text-blue-400">{year}</span>
        </h2>
        <span className="tw:bg-blue-100 tw:text-blue-700 tw:px-4 tw:py-1 tw:rounded-full tw:text-xs tw:font-bold tw:shadow">
          Updated: {monthNames[new Date().getMonth()]} {year}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
          <XAxis
            dataKey="month"
            className="tw:text-sm"
            tick={{ fill: "#1e40af", fontWeight: 600 }}
            axisLine={{ stroke: "#93c5fd" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
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
            labelStyle={{ color: "#6366f1", fontWeight: 700 }}
            cursor={{ fill: "#dbeafe" }}
          />
          <Bar
            dataKey="registrations"
            name="Registrations"
            fill="url(#userBarGradient)"
            radius={[12, 12, 0, 0]}
            barSize={32}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserRegistrationChart;
