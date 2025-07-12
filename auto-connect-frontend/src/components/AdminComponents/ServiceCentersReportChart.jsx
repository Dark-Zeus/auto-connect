import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";

// Sample data
const yourData = [
  { name: "Center A", updates: 8 },
  { name: "Center B", updates: 5 },
  { name: "Center C", updates: 12 },
  { name: "Center D", updates: 3 },
];

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B"];

// 🟡 Custom active shape to keep inner and add glow
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
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
      {/* 🔹 Outer hover glow ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* 🔸 Main visible sector (inner part) */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* 🏷 Centered text labels */}
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize={14}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#999" fontSize={9}>
        {value} updates ({(percent * 100).toFixed(0)}%)
      </text>
    </g>
  );
};

function ServiceCenterUpdatePieChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-6 tw:w-full">
      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-4">
        Service Center Updates –{" "}
        {new Date().toLocaleString("default", { month: "long" })}
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
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
