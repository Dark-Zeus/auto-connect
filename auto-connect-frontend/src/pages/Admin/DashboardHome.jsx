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
  Settings,
  BarChart as BarIcon,
  Download,
} from "@mui/icons-material";

const dataTrafficLocation = [
  { name: "AutoFix", value: 400 },
  { name: "QuickServe", value: 300 },
  { name: "SpeedyAuto", value: 300 },
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
  { serviceCenter: "AutoFix", date: "2025-06-11", time: "11:25 AM", district: "Kandy", vehicleNumber: "WP QR 1234", type: "Repair" },
  { serviceCenter: "AutoFix", date: "2025-06-11", time: "11:25 AM", district: "Kandy", vehicleNumber: "WP QR 1234", type: "Repair" },
  { serviceCenter: "AutoFix", date: "2025-06-11", time: "11:25 AM", district: "Kandy", vehicleNumber: "WP QR 1234", type: "Repair" },
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
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">
        {payload.name}
      </text>
      <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#999">
        {value} visits ({(percent * 100).toFixed(0)}%)
      </text>
    </g>
  );
};

function DashboardHome() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardData = [
    {
      title: "New Users",
      value: 123915,
      progress: 12.3456,
      icon: <People style={{ fontSize: 40 }} />,
      color: "bg-blue-100",
      iconBg: "bg-blue-600",
    },
    {
      title: "Total Orders",
      value: 61313,
      progress: -8.1234,
      icon: <BarIcon style={{ fontSize: 40 }} />,
      color: "bg-green-100",
      iconBg: "bg-green-600",
    },
    {
      title: "New Product",
      value: 71003,
      progress: 5.6789,
      icon: <Settings style={{ fontSize: 40 }} />,
      color: "bg-purple-100",
      iconBg: "bg-purple-600",
    },
    {
      title: "Total Downloads",
      value: 161888,
      progress: 1.2345,
      icon: <Download style={{ fontSize: 40 }} />,
      color: "bg-orange-100",
      iconBg: "bg-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-8">
      {/* Cards */}
      <div className="col-span-3 grid grid-cols-2 gap-6">
        {cardData.map((card, i) => (
          <div
            key={i}
            className={`relative p-6 rounded-2xl shadow-md ${card.color} transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
            style={{ minHeight: "140px" }}
          >
            <div
              className={`absolute top-4 left-4 p-2 rounded-full text-white ${card.iconBg}`}
              style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}
            >
              {card.icon}
            </div>
            <div className="absolute top-4 right-4 text-sm font-semibold">
              {card.progress >= 0 ? (
                <span className="text-green-600">+{card.progress.toFixed(2)}%</span>
              ) : (
                <span className="text-red-600">{card.progress.toFixed(2)}%</span>
              )}
            </div>
            <div className="mt-auto pl-4">
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic by Location Pie Chart */}
      <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col">
        <h3 className="text-2xl font-bold mb-4">Service Centers</h3>
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
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col mt-4 space-y-2 text-sm">
          {dataTrafficLocation.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div className="col-span-3 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-bold mb-4">Traffic by Users (Last 7 Days)</h3>
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
      <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col">
        <h3 className="text-2xl font-bold mb-4">Monthly Income</h3>
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
        <div className="flex flex-col mt-4 space-y-2 text-sm">
          {dataTrafficDevice.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{entry.device}</span> 
            </div>
          ))}
        </div>
      </div>


      {/* Latest Updates Table */}
      <div className="col-span-5 bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
        <h3 className="text-2xl font-bold mb-4">Latest Updates</h3>
        <table className="w-full border-collapse">
          <thead className="bg-blue-50">
            <tr>
              <th className="text-left py-3 px-6 border-b border-blue-100">Service Center</th>
              <th className="text-left py-3 px-6 border-b border-blue-100">Date</th>
              <th className="text-left py-3 px-6 border-b border-blue-100">Time</th>
              <th className="text-left py-3 px-6 border-b border-blue-100">District</th>
              <th className="text-left py-3 px-6 border-b border-blue-100">Vehicle Number</th>
              <th className="text-left py-3 px-6 border-b border-blue-100">Type</th>
            </tr>
          </thead>
          <tbody>
            {latestUpdates.slice(0, 10).map((row, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer transition-colors duration-300 ${
                  selectedIndex === idx ? "bg-blue-200" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-100`}
              >
                <td className="py-4 px-6 border-b border-blue-100">{row.serviceCenter}</td>
                <td className="py-4 px-6 border-b border-blue-100">{row.date}</td>
                <td className="py-4 px-6 border-b border-blue-100">{row.time}</td>
                <td className="py-4 px-6 border-b border-blue-100">{row.district}</td>
                <td className="py-4 px-6 border-b border-blue-100">{row.vehicleNumber}</td>
                <td className="py-4 px-6 border-b border-blue-100">{row.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardHome;