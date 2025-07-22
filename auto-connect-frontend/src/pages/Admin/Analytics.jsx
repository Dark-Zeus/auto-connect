import React from 'react';
import MonthlyReport from '@components/AdminComponents/Analytics/MonthlyReport';
import UserRegistrationChart from '@components/AdminComponents/Analytics/UserProgressChart';
import RevenueTrendChart from '@components/AdminComponents/Analytics/RevenueChart';
import VehicleSalesChart from '@components/AdminComponents/Analytics/VehicleSaleChart';
import ReportSalesChart from '@components/AdminComponents/Analytics/ReportSalesChart';
const Analytics = () => {
return (
  <div className="tw:mt-8 tw:grid tw:grid-cols-2 tw:gap-6 tw:bg-[var(--primary-light)]">
    {/* Left column: Monthly Report */}
    <MonthlyReport />

    {/* Right column: User Chart + Revenue Chart stacked */}
    <div className="tw:space-y-6">
      <UserRegistrationChart />
      <RevenueTrendChart />
      <VehicleSalesChart />
      <ReportSalesChart />
    </div>
  </div>
);

};

export default Analytics;