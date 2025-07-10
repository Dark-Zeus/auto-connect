import React, { useState } from "react";

const LatestUpdatesTable = ({ latestUpdates }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(latestUpdates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = latestUpdates.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="tw:col-span-5 tw:bg-white tw:rounded-2xl tw:shadow-md tw:p-6 tw:overflow-x-auto">
      <h3 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800">Latest Service Updates</h3>
      <table className="tw:w-full tw:border-collapse tw:text-sm md:tw:text-base">
        <thead className="tw:bg-blue-50 tw:text-blue-700">
          <tr>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Service Center</th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Date</th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Time</th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">District</th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Vehicle No.</th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Type</th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => setSelectedIndex(startIndex + idx)}
              className={`tw:cursor-pointer tw:transition-colors tw:duration-300 ${
                selectedIndex === startIndex + idx
                  ? "tw:bg-blue-200"
                  : (startIndex + idx) % 2 === 0
                  ? "tw:bg-white"
                  : "tw:bg-gray-50"
              } hover:tw:bg-blue-100`}
            >
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">{row.serviceCenter}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">{row.date}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">{row.time}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">{row.district}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">{row.vehicleNumber}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">{row.type}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-red-600 tw:font-medium">
                  🔒 Paid Report
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="tw:flex tw:justify-center tw:items-center tw:gap-3 tw:mt-10">
        <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="tw:px-4 tw:py-2 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50"
        >
            Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
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
            disabled={currentPage === totalPages}
            className="tw:px-4 tw:py-2 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50"
        >
            Next
        </button>
      </div>
    </div>
  );
};

export default LatestUpdatesTable;
