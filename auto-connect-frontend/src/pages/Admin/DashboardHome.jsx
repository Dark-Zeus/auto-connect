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

const COLORS = ["#8884d8", "#8dd1e1", "#82ca9d", "#ffc658", "#d0ed57"];

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
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
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
      progress: 12.3456,
      icon: <People style={{ fontSize: 40 }} />,
      color: "tw:bg-[var(--sky-light)]",
      iconBg: "tw:bg-[var(--primary-dark)]",
    },
    {
      title: "Verified Automotive Service Hubs",
      value: 61,
      progress: -8.1234,
      icon: <Garage style={{ fontSize: 40 }} />,
      color: "tw:bg-[var(--sky-light)]",
      iconBg: "tw:bg-[var(--primary-dark)]",
    },
    {
      title: "Income",
      value: "LKR 710,003",
      progress: 2.6789,
      icon: <TrendingUp style={{ fontSize: 40 }} />,
      color: "tw:bg-[var(--sky-light)]",
      iconBg: "tw:bg-[var(--primary-dark)]",
    },
    {
      title: "Verified Insurence Companies",
      value: 18,
      progress: 1.2345,
      icon: <Domain style={{ fontSize: 40 }} />,
      color: "tw:bg-[var(--sky-light)]",
      iconBg: "tw:bg-[var(--primary-dark)]",
    },
  ];

  return (
    <div className="tw:grid tw:grid-cols-5 tw:gap-8">
      {/* Cards */}
      <div className="tw:col-span-3 tw:grid tw:grid-cols-2 tw:gap-6 tw:transition-transform tw:transform hover:tw:-translate-y-1 hover:tw:shadow-xl">
        {cardData.map((card, i) => (
          <div
            key={i}
            className={`tw:relative tw:p-6 tw:rounded-2xl tw:shadow-md ${card.color} tw:transition-transform tw:transform hover:tw:-translate-y-1 hover:tw:shadow-xl tw:flex tw:flex-col tw:justify-between`}
            style={{ minHeight: "140px" }}
          >
            <div
              className={`tw:absolute tw:top-4 tw:left-4 tw:p-2 tw:rounded-full tw:text-white ${card.iconBg}`}
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
              <h4 className="tw:text-lg tw:font-semibold">{card.title}</h4>
              <p className="tw:!mt-1 tw:!text-3xl tw:text-blue-600 tw:font-bold">{card.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic by Location Pie Chart */}
      <div className="tw:col-span-2 tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-md tw:flex tw:flex-col">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4">Service Centers</h3>
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
      <div className="tw:col-span-3 tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-md">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4">Traffic by Users (Last 7 Days)</h3>
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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="tw:col-span-2 tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-md tw:flex tw:flex-col">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4">User Registration</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dataTrafficDevice}>
            <XAxis dataKey="device" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" radius={[4, 4, 4, 4]} barSize={40}>
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
      <div className="tw:col-span-5 tw:bg-white tw:rounded-2xl tw:shadow-md tw:p-6 tw:overflow-x-auto">
        <h3 className="tw:text-2xl tw:font-bold tw:mb-4">Latest Updates</h3>
        <table className="tw:w-full tw:border-collapse">
          <thead className="tw:bg-blue-50">
            <tr>
              <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Service Center</th>
              <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Date</th>
              <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Time</th>
              <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">District</th>
              <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Vehicle Number</th>
              <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {latestUpdates.slice(0, 10).map((row, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`tw:cursor-pointer tw:transition-colors tw:duration-300 ${
                  selectedIndex === idx
                    ? "tw:bg-blue-200"
                    : idx % 2 === 0
                    ? "tw:bg-white"
                    : "tw:bg-gray-50"
                } hover:tw:bg-blue-100`}
              >
                <td className="tw:py-4 tw:px-6 tw:border-b tw:border-blue-100">{row.serviceCenter}</td>
                <td className="tw:py-4 tw:px-6 tw:border-b tw:border-blue-100">{row.date}</td>
                <td className="tw:py-4 tw:px-6 tw:border-b tw:border-blue-100">{row.time}</td>
                <td className="tw:py-4 tw:px-6 tw:border-b tw:border-blue-100">{row.district}</td>
                <td className="tw:py-4 tw:px-6 tw:border-b tw:border-blue-100">{row.vehicleNumber}</td>
                <td className="tw:py-4 tw:px-6 tw:border-b tw:border-blue-100">
                  <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-red-600 tw:font-medium">
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
