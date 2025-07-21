import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Sector,
} from "recharts";
import {
  People,
  Domain,
  TrendingUp,
  Garage,
} from "@mui/icons-material";
import { ShieldCheck, Car, MapPin, Calendar, Clock } from "lucide-react";

const dataTrafficLocation = [
  { name: "AutoFix", value: 400 },
  { name: "QuickServe", value: 300 },
  { name: "SpeedyAuto", value: 360 },
  { name: "Center1", value: 200 },
  { name: "Center2", value: 100 },
];

const dataTrafficDevice = [
  { device: "June", users: 300 },
  { device: "May", users: 500 },
  { device: "April", users: 300 },
  { device: "March", users: 100 },
];

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

const latestUpdates = [
  { serviceCenter: "AutoFix", date: "2025-06-20", time: "10:30 AM", district: "Colombo", vehicleNumber: "WP AB 1234", type: "Repair" },
  { serviceCenter: "QuickServe", date: "2025-06-19", time: "02:15 PM", district: "Kandy", vehicleNumber: "WP XY 9876", type: "Maintenance" },
  { serviceCenter: "SpeedyAuto", date: "2025-06-18", time: "09:00 AM", district: "Galle", vehicleNumber: "WP CD 5678", type: "Inspection" },
  { serviceCenter: "AutoFix", date: "2025-06-17", time: "11:45 AM", district: "Matara", vehicleNumber: "WP EF 4321", type: "Repair" },
  { serviceCenter: "QuickServe", date: "2025-06-16", time: "03:20 PM", district: "Colombo", vehicleNumber: "WP GH 8765", type: "Maintenance" },
  { serviceCenter: "SpeedyAuto", date: "2025-06-15", time: "08:30 AM", district: "Kandy", vehicleNumber: "WP IJ 3456", type: "Inspection" },
  { serviceCenter: "AutoFix", date: "2025-06-14", time: "10:10 AM", district: "Galle", vehicleNumber: "WP KL 7890", type: "Repair" },
  { serviceCenter: "QuickServe", date: "2025-06-13", time: "01:00 PM", district: "Matara", vehicleNumber: "WP MN 2345", type: "Maintenance" },
  { serviceCenter: "SpeedyAuto", date: "2025-06-12", time: "09:40 AM", district: "Colombo", vehicleNumber: "WP OP 6789", type: "Inspection" },
  { serviceCenter: "AutoFix", date: "2025-06-11", time: "11:25 AM", district: "Kandy", vehicleNumber: "WP QR 1234", type: "Repair" },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  return (
    <g>
      {/* Outer glow ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "drop-shadow(0 0 12px #60A5FA66)" }}
      />
      {/* Main sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

function DashboardHome() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardData = [
    {
      title: "Users",
      value: 123915,
      progress: 12.35,
      icon: <People style={{ fontSize: 40 }} />,
      color: "tw:bg-gradient-to-br tw:from-blue-50 tw:to-blue-100",
      iconBg: "tw:bg-blue-600",
    },
    {
      title: "Verified Automotive Service Hubs",
      value: 61,
      progress: -8.12,
      icon: <Garage style={{ fontSize: 40 }} />,
      color: "tw:bg-gradient-to-br tw:from-indigo-50 tw:to-blue-100",
      iconBg: "tw:bg-indigo-600",
    },
    {
      title: "Income",
      value: "LKR 710,003",
      progress: 2.68,
      icon: <TrendingUp style={{ fontSize: 40 }} />,
      color: "tw:bg-gradient-to-br tw:from-green-50 tw:to-blue-100",
      iconBg: "tw:bg-green-600",
    },
    {
      title: "Verified Insurance Companies",
      value: 18,
      progress: 1.23,
      icon: <Domain style={{ fontSize: 40 }} />,
      color: "tw:bg-gradient-to-br tw:from-yellow-50 tw:to-blue-100",
      iconBg: "tw:bg-yellow-500",
    },
  ];

  return (
    <div className="tw:grid tw:grid-cols-5 tw:gap-8 tw:pb-10">
      {/* Cards */}
      <div className="tw:col-span-3 tw:grid tw:grid-cols-2 tw:gap-6">
        {cardData.map((card, i) => (
          <div
            key={i}
            className={`tw:relative tw:p-6 tw:rounded-2xl tw:shadow-lg ${card.color} tw:transition-transform tw:transform hover:tw:-translate-y-1 hover:tw:shadow-2xl tw:flex tw:flex-col tw:justify-between tw:overflow-hidden`}
            style={{ minHeight: "140px" }}
          >
            <div
              className={`tw:absolute tw:top-4 tw:left-4 tw:p-2 tw:rounded-full tw:text-white ${card.iconBg} tw:shadow-md`}
              style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}
            >
              {card.icon}
            </div>
            <div className="tw:absolute tw:top-4 tw:right-4 tw:text-sm tw:font-semibold">
              {card.progress >= 0 ? (
                <span className="tw:text-green-600">+{card.progress.toFixed(2)}%</span>
              ) : (
                <span className="tw:text-red-600">{card.progress.toFixed(2)}%</span>
              )}
            </div>
            <div className="tw:mt-auto tw:pl-4">
              <h4 className="tw:text-lg tw:font-semibold tw:text-gray-700">{card.title}</h4>
              <p className="tw:!mt-1 tw:!text-3xl tw:text-blue-700 tw:font-bold">{card.value.toLocaleString()}</p>
            </div>
            {/* Decorative gradient circle */}
            <div className="tw:absolute tw:bottom-0 tw:right-0 tw:w-24 tw:h-24 tw:bg-gradient-to-tr tw:from-blue-200 tw:to-blue-50 tw:rounded-full tw:opacity-30 tw:-z-10"></div>
          </div>
        ))}
      </div>

      {/* Traffic by Location Pie Chart */}
      <div className="tw:col-span-2 tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg tw:flex tw:flex-col tw:relative tw:overflow-hidden">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800 flex tw:items-center gap-2">
          <ShieldCheck className="tw:w-6 tw:h-6 tw:text-blue-500" />
          Service Centers
        </h3>
        <div className="tw:absolute tw:top-0 tw:right-0 tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
        <ResponsiveContainer width="100%" height={215}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={dataTrafficLocation}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              animationDuration={400}
            >
              {dataTrafficLocation.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor="pointer"
                />
              ))}
            </Pie>
            {/* Manual center label */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="tw:text-lg tw:font-semibold"
            >
              {dataTrafficLocation[activeIndex]?.name}
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="tw:text-sm tw:text-gray-500"
            >
              {dataTrafficLocation[activeIndex]?.value}
            </text>
          </PieChart>
        </ResponsiveContainer>
        <div className="tw:flex tw:flex-col tw:mt-4 tw:space-y-2 tw:text-sm">
          {dataTrafficLocation.map((entry, index) => (
            <div key={index} className="tw:flex tw:items-center tw:gap-2">
              <span
                className="tw:inline-block tw:w-4 tw:h-4 tw:rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div className="tw:col-span-3 tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg tw:relative tw:overflow-hidden">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800 flex tw:items-center gap-2">
          <TrendingUp className="tw:w-6 tw:h-6 tw:text-blue-500" />
          Traffic by Users (Last 7 Days)
        </h3>
        <div className="tw:absolute tw:top-0 tw:right-0 tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart
            data={[
              { name: "Mon", users: 400 },
              { name: "Tue", users: 300 },
              { name: "Wed", users: 200 },
              { name: "Thu", users: 278 },
              { name: "Fri", users: 189 },
              { name: "Sat", users: 239 },
              { name: "Sun", users: 349 },
            ]}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: "#2563eb", fontWeight: 600 }} />
            <YAxis tick={{ fill: "#2563eb", fontWeight: 600 }} />
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
              formatter={(value) => [`${value} users`, "Users"]}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: "#2563eb" }} />
            <Line
              type="monotone"
              dataKey="users"
              stroke="url(#lineGradient)"
              strokeWidth={4}
              dot={{
                r: 6,
                stroke: "#3B82F6",
                strokeWidth: 2,
                fill: "#fff",
                filter: "drop-shadow(0 0 8px #3B82F6AA)",
              }}
              activeDot={{
                r: 10,
                fill: "#3B82F6",
                stroke: "#fff",
                strokeWidth: 3,
                filter: "drop-shadow(0 0 8px #3B82F6AA)",
              }}
              name="Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="tw:col-span-2 tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg tw:flex tw:flex-col tw:relative tw:overflow-hidden">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800 flex tw:items-center gap-2">
          <People className="tw:w-6 tw:h-6 tw:text-blue-500" />
          User Registration
        </h3>
        <div className="tw:absolute tw:top-0 tw:right-0 tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dataTrafficDevice}>
            <XAxis dataKey="device" tick={{ fill: "#2563eb", fontWeight: 600 }} />
            <YAxis tick={{ fill: "#2563eb", fontWeight: 600 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                background: "#fff",
                border: "1px solid #e0e7ff",
                color: "#1e293b",
                fontWeight: 500,
              }}
              labelStyle={{ color: "#2563eb", fontWeight: 700 }}
              formatter={(value) => [`${value} users`, "Users"]}
            />
            <Legend />
            <Bar dataKey="users" radius={[8, 8, 0, 0]} barSize={40}>
              {dataTrafficDevice.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="tw:flex tw:flex-col tw:mt-4 tw:space-y-2 tw:text-sm">
          {dataTrafficDevice.map((entry, index) => (
            <div key={index} className="tw:flex tw:items-center tw:gap-2">
              <span
                className="tw:inline-block tw:w-4 tw:h-4 tw:rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{entry.device}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Updates Table */}
      <div className="tw:col-span-5 tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-6 tw:overflow-x-auto">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-gray-800">Latest Updates</h3>
        <table className="tw:w-full tw:border-separate tw:border-spacing-y-2">
          <thead>
            <tr className="tw:bg-gradient-to-r tw:from-blue-500 tw:to-blue-600 tw:text-white tw:rounded-lg">
              <th className="tw:py-3 tw:px-4 tw:text-left tw:rounded-l-lg">Service Center</th>
              <th className="tw:py-3 tw:px-4 tw:text-left">Date</th>
              <th className="tw:py-3 tw:px-4 tw:text-left">Time</th>
              <th className="tw:py-3 tw:px-4 tw:text-left">District</th>
              <th className="tw:py-3 tw:px-4 tw:text-left">Vehicle No.</th>
              <th className="tw:py-3 tw:px-4 tw:text-left tw:rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {latestUpdates.slice(0, 10).map((row, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`tw:bg-white tw:shadow-sm tw:rounded-lg tw:transition-transform tw:duration-300 tw:hover:tw:scale-[1.01] tw:hover:tw:shadow-md tw:cursor-pointer ${
                  selectedIndex === idx ? "tw:ring-2 tw:ring-blue-400" : ""
                }`}
              >
                <td className="tw:py-3 tw:px-4 tw:rounded-l-lg">{row.serviceCenter}</td>
                <td className="tw:py-3 tw:px-4">{row.date}</td>
                <td className="tw:py-3 tw:px-4">{row.time}</td>
                <td className="tw:py-3 tw:px-4">{row.district}</td>
                <td className="tw:py-3 tw:px-4">{row.vehicleNumber}</td>
                <td className="tw:py-3 tw:px-4 tw:rounded-r-lg">
                  <span className="tw:inline-flex tw:items-center tw:gap-1 tw:bg-red-100 tw:text-red-600 tw:px-2 tw:py-1 tw:rounded-full tw:text-xs tw:font-semibold">
                    🔒 Paid Report
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardHome;