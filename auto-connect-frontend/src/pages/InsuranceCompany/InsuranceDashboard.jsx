import React, { useState } from "react";
import StatCard from "@components/InsuranceCompany/StatCard";
import ChartSection from "@components/InsuranceCompany/ChartSection";
import GroupIcon from "@mui/icons-material/Group";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import Sidebar from "@components/InsuranceCompany/Sidebar";

const InsuranceDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="tw:flex tw:flex-grow tw:w-full tw:min-h-screen">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`tw:flex-grow tw:transition-all tw:duration-300 tw:min-h-screen tw:w-full tw:p-7 tw:bg-gray-100 tw:overflow-auto ${
          isOpen ? "tw:ml-80" : "tw:ml-20"
        }`}
      >
        <h1 className="tw:text-2xl tw:font-bold tw:text-gray-800">Dashboard</h1>
        <div className="tw:p-10 tw:pb-16 tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-2 tw:lg:grid-cols-4">
          <StatCard
            icon={<GroupIcon className="tw:text-black" />}
            label="Total Clients"
            value="123,915"
            growth="+12.35%"
            color="tw:bg-blue-100 tw:h-37"
          />
          <StatCard
            icon={<PostAddIcon className="tw:text-black" />}
            label="Total Claims"
            value="61,313"
            growth="+8.12%"
            color="tw:bg-green-100"
          />
          <StatCard
            icon={<HourglassBottomIcon className="tw:text-black" />}
            label="Pending Claims"
            value="71,003"
            growth="-2.68%"
            color="tw:bg-purple-100"
          />
          <StatCard
            icon={<LocalShippingIcon className="tw:text-black" />}
            label="Vehicles Insured"
            value="161,800"
            growth="+1.23%"
            color="tw:bg-yellow-100"
          />
        </div>
        <ChartSection />
      </main>
    </div>
  );
};

export default InsuranceDashboard;
