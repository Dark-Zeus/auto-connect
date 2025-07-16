import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const trafficData = [
  { day: "Mon", Clients: 400 },
  { day: "Tue", Clients: 300 },
  { day: "Wed", Clients: 200 },
  { day: "Thu", Clients: 278 },
  { day: "Fri", Clients: 189 },
  { day: "Sat", Clients: 239 },
  { day: "Sun", Clients: 349 },
];

const payoutData = [
  { month: "Jan", payout: 300000 },
  { month: "Feb", payout: 400000 },
  { month: "Mar", payout: 500000 },
  { month: "Apr", payout: 600000 },
];

const ChartSection = () => {
  return (
    <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:lg:grid-cols-2">
      <div className="tw:p-4 tw:bg-white tw:rounded-lg tw:shadow-md">
        <h3 className="tw:mb-2 tw:text-lg tw:font-semibold">
          Our Clients (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Clients"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="tw:p-4 tw:bg-white tw:rounded-lg tw:shadow-md">
        <h3 className="tw:mb-2 tw:text-lg tw:font-semibold">
          Monthly Payout Amount
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={payoutData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="payout" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
