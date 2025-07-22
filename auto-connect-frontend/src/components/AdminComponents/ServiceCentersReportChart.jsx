import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Building2 } from "lucide-react";

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
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:w-full tw:relative tw:overflow-hidden tw:border tw:border-blue-100">
      {/* Decorative background */}
      <div className="tw:absolute tw:top-0 tw:right-0 tw:w-32 tw:h-32 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-50 tw:rounded-full tw:opacity-60 tw:-z-10"></div>
      <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-24 tw:h-24 tw:bg-gradient-to-tr tw:from-indigo-100 tw:to-blue-50 tw:rounded-full tw:opacity-50 tw:-z-10"></div>

      <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:flex tw:items-center tw:gap-2">
          <Building2 className="tw:w-6 tw:h-6 tw:text-blue-500" />
          Service Center Updates –{" "}
          {new Date().toLocaleString("default", { month: "long" })}
        </h2>
      </div>

      <div className="tw:relative tw:h-[240px] tw:mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              data={yourData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="updates"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              stroke="#fff"
              strokeWidth={3}
              paddingAngle={2}
              isAnimationActive={true}
            >
              {yourData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor="pointer"
                  style={{
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 0 8px rgba(59,130,246,0.5))"
                        : undefined,
                    transition: "filter 0.2s",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                background: "#fff",
                border: "1px solid #e0e7ff",
                color: "#1e293b",
                fontWeight: 500,
              }}
              formatter={(value, name) => [`${value} updates`, "Updates"]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="tw:absolute tw:top-1/2 tw:left-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2 tw:text-center">
          <div className="tw:text-base tw:font-bold tw:text-blue-700 tw:mb-1">
            {activeData.name}
          </div>
          <div className="tw:text-xs tw:text-blue-400 tw:font-semibold">
            {activeData.updates} updates
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="tw:grid tw:grid-cols-2 sm:tw:grid-cols-3 tw:gap-2 tw:mt-6 tw:text-sm">
        {yourData.map((entry, index) => (
          <div
            key={index}
            className={`tw:flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-lg ${
              activeIndex === index
                ? "tw:bg-blue-50 tw:shadow"
                : "tw:bg-transparent"
            } tw:transition`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(activeIndex)}
            style={{ cursor: "pointer" }}
          >
            <span
              className="tw:inline-block tw:w-4 tw:h-4 tw:rounded-full"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
                border:
                  activeIndex === index
                    ? "2px solid #2563eb"
                    : "2px solid #e0e7ff",
                transition: "border 0.2s",
              }}
            ></span>
            <span className="tw:font-medium tw:text-gray-700">{entry.name}</span>
            <span className="tw:text-xs tw:text-gray-400 tw:ml-auto">
              {entry.updates}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceCenterUpdatePieChart;