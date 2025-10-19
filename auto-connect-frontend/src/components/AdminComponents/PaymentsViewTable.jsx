import React, { useState } from "react";
import PaymentFilterBox from "@components/AdminComponents/PaymentFilterBox"; // adjust import path as needed

function PaymentsTable() {
  const paymentData = [
    {
      id: 1,
      date: "2025-10-10",
      time: "09:23 AM",
      from: "Rashmika Dilmin",
      to: "Advertisement",
      amount: "LKR 1000.00",
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-10-10",
      time: "10:33 AM",
      from: "Kasun Jayasuriya",
      to: "Advertisement",
      amount: "LKR 1000.00",
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 3,
      date: "2025-10-12",
      time: "01:24 PM",
      from: "Nimasha Fernando",
      to: "Monthly Subscription",
      amount: "LKR 30000.00",
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: 4,
      date: "2025-10-15",
      time: "01:36 PM",
      from: "Tharindu Perera",
      to: "Advertisement",
      amount: "LKR 1000.00",
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 5,
      date: "2025-10-17",
      time: "03:47 PM",
      from: "Dilshan Silva",
      to: "Monthly Subscription",
      amount: "LKR 30000.00",
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: 6,
      date: "2025-10-17",
      time: "03:53 PM",
      from: "Saman Kumara",
      to: "Advertisement",
      amount: "LKR 1000.00",
      method: "Bank Transfer",
      status: "Completed",
    },
  ];

  const [filters, setFilters] = useState({
    search: "",
    date: "All",
    method: "All",
    status: "All",
  });

  const thClass = "tw:px-6 tw:py-4 tw:font-semibold tw:text-white";
  const tdClass = "tw:px-6 tw:py-4 tw:text-gray-700";

  // Filtering logic
  const applyFilters = () => {
    return paymentData.filter((txn) => {
      const matchesSearch =
        txn.from.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.to.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMethod =
        filters.method === "All" || txn.method === filters.method;

      const matchesStatus =
        filters.status === "All" || txn.status === filters.status;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  };

  const filteredData = applyFilters();

  return (
    <div className="tw:min-h-screen tw:px-10 tw:pt-10 tw:pb-20 tw:bg-gradient-to-br tw:from-white tw:to-blue-50">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <h2 className="tw:text-3xl tw:font-bold tw:text-blue-800">
          Payment Records
        </h2>
        <span className="tw:text-blue-600 tw:font-medium tw:text-lg">
          Total Transactions: {filteredData.length}
        </span>
      </div>

      {/* Filter Box */}
      <PaymentFilterBox filters={filters} setFilters={setFilters} />

      {/* Table */}
      <div className="tw:overflow-x-auto tw:rounded-lg tw:shadow-lg">
        <table className="tw:w-full tw:text-sm tw:text-left tw:border-collapse">
          <thead>
            <tr className="tw:bg-blue-600">
              <th className={thClass}>Date</th>
              <th className={thClass}>Time</th>
              <th className={thClass}>From</th>
              <th className={thClass}>Plan/Service</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Method</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((txn, index) => (
              <tr
                key={txn.id}
                className={`tw:transition tw:duration-200 ${
                  index % 2 === 0 ? "tw:bg-white" : "tw:bg-blue-50"
                } hover:tw:bg-blue-100`}
              >
                <td className={tdClass}>{txn.date}</td>
                <td className={tdClass}>{txn.time}</td>
                <td className={`${tdClass} tw:text-blue-800 tw:font-medium`}>
                  {txn.from}
                </td>
                <td className={`${tdClass} tw:text-blue-800 tw:font-medium`}>
                  {txn.to}
                </td>
                <td className={`${tdClass} tw:text-green-700 tw:font-semibold`}>
                  {txn.amount}
                </td>
                <td className={tdClass}>{txn.method}</td>
                <td className={tdClass}>
                  <span
                    className={`tw:px-3 tw:py-1 tw:rounded-full tw:text-xs tw:font-semibold ${
                      txn.status === "Completed"
                        ? "tw:bg-green-100 tw:text-green-700"
                        : "tw:bg-yellow-100 tw:text-yellow-700"
                    }`}
                  >
                    {txn.status}
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

export default PaymentsTable;
