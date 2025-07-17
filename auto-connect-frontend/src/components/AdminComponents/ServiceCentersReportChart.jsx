import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data
const yourData = [
  { name: "Center A", updates: 8 },
  { name: "Center B", updates: 5 },
  { name: "Center C", updates: 12 },
  { name: "Center D", updates: 3 },
  { name: "Center E", updates: 7 },
];

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

function ServiceCenterUpdatePieChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeData = yourData[activeIndex];

  return (
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-6 tw:w-full">
      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-4">
        Service Center Updates –{" "}
        {new Date().toLocaleString("default", { month: "long" })}
      </h2>

      <div className="tw:relative tw:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              data={yourData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              fill="#8884d8"
              dataKey="updates"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {yourData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor="pointer"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* 🟢 Always visible center labels */}
        <div className="tw:absolute tw:top-1/2 tw:left-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2 tw:text-center">
          <div className="tw:text-sm tw:font-medium tw:text-gray-700">
            {activeData.name}
          </div>
          <div className="tw:text-xs tw:text-gray-500">
            {activeData.updates} updates
          </div>
        </div>
      </div>

      {/* 🔻 Legend below the chart */}
      <div className="tw:flex tw:flex-col tw:mt-4 tw:space-y-2 tw:text-sm">
        {yourData.map((entry, index) => (
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
  );
}

export default ServiceCenterUpdatePieChart;
