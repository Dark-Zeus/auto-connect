import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "@components/InsuranceCompany/Sidebar";
import Dashboard from "./Dashboard";
import InsuranceClaims from "./InsuranceClaims";
import RepairRequest from "./RepairRequest";
import Analytics from "./RepairStatus";

const InsuranceCompanyPage = () => {
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/insurance-claims" element={<InsuranceClaims />} />
          <Route path="/repair-request" element={<RepairRequest />} />
          <Route path="/repair-status" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
};

export default InsuranceCompanyPage;
