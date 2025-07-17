import React, { useState } from "react";
import PaymentFilterBox from "@components/AdminComponents/PaymentFilterBox"; // adjust path as needed

const paymentData = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  date: "2025-07-08",
  time: "10:30 AM",
  amount: `LKR ${(3000 + i * 50).toLocaleString()}.00`,
  from: i % 2 === 0 ? "Rashmika Dilmin" : "Kasun Jayasuriya",
  to: i % 3 === 0 ? "Super Wheels Service Center" : "City Auto Service",
  method: i % 2 === 0 ? "Credit Card" : "Bank Transfer",
  status: i % 4 === 0 ? "Pending" : "Completed",
}));

const ITEMS_PER_PAGE = 20;

function PaymentsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    date: "All",
    method: "All",
    status: "All",
  });

  const totalPages = Math.ceil(paymentData.length / ITEMS_PER_PAGE);

  const thClass = "tw:px-6 tw:py-4 tw:font-semibold tw:text-white";
  const tdClass = "tw:px-6 tw:py-4 tw:text-gray-700";

  const applyFilters = () => {
    return paymentData.filter((txn) => {
      const matchesSearch =
        txn.from.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.to.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMethod =
        filters.method === "All" || txn.method === filters.method;

      const matchesStatus =
        filters.status === "All" || txn.status === filters.status;

      // Date filtering skipped for now (can be implemented if needed)

      return matchesSearch && matchesMethod && matchesStatus;
    });
  };

  const filteredData = applyFilters();
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPayments = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= Math.ceil(filteredData.length / ITEMS_PER_PAGE)) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="tw:min-h-screen tw:px-10 tw:pt-10 tw:pb-20 tw:bg-gradient-to-br tw:bg-[var(--primary-light)] tw:to-blue-50">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <h2 className="tw:text-3xl tw:font-bold tw:text-blue-800">Payment Records</h2>
        <span className="tw:text-blue-600 tw:font-medium tw:text-lg">
          Total Transactions: {filteredData.length}
        </span>
      </div>

      <PaymentFilterBox filters={filters} setFilters={setFilters} />

      <div className="tw:overflow-x-auto tw:rounded-lg tw:shadow-lg">
        <table className="tw:w-full tw:text-sm tw:text-left tw:border-collapse">
          <thead>
            <tr className="tw:bg-blue-600">
              <th className={thClass}>Date</th>
              <th className={thClass}>Time</th>
              <th className={thClass}>From</th>
              <th className={thClass}>To</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Method</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((txn, index) => (
              <tr
                key={txn.id}
                className={`tw:transition tw:duration-200 ${
                  index % 2 === 0 ? "tw:bg-white" : "tw:bg-blue-50"
                } hover:tw:bg-blue-100`}
              >
                <td className={tdClass}>{txn.date}</td>
                <td className={tdClass}>{txn.time}</td>
                <td className={`${tdClass} tw:text-blue-800 tw:font-medium`}>{txn.from}</td>
                <td className={`${tdClass} tw:text-blue-800 tw:font-medium`}>{txn.to}</td>
                <td className={`${tdClass} tw:text-green-700 tw:font-semibold`}>{txn.amount}</td>
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

      {/* Pagination */}
      <div className="tw:flex tw:justify-center tw:items-center tw:gap-3 tw:mt-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="tw:px-4 tw:py-2 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: Math.ceil(filteredData.length / ITEMS_PER_PAGE) }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`tw:px-4 tw:py-2 tw:rounded-xl tw:font-bold ${
              currentPage === i + 1
                ? "tw:bg-blue-600 tw:text-white"
                : "tw:bg-gray-200 tw:text-gray-700 hover:tw:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          className="tw:px-4 tw:py-2 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaymentsTable;
