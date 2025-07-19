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
    <div className="tw:bg-white tw:h-[350px] tw:p-6 tw:rounded-2xl tw:shadow-lg">
      <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-4">
        User Registration Progress – {year}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="registrations" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserRegistrationChart;