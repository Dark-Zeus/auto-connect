import React, { useState, useMemo } from "react";

const LatestUpdatesTable = ({ latestUpdates }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // New states for search, filter and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortBy, setSortBy] = useState("all"); // all, today, yesterday, this-week, this-month, this-year
  const [sortAscending, setSortAscending] = useState(true);

  // Extract unique districts for filter dropdown
  const districts = useMemo(() => {
    const allDistricts = latestUpdates.map((u) => u.district);
    return [...new Set(allDistricts)].sort();
  }, [latestUpdates]);

  // Filter, search and sort the data
  const filteredData = useMemo(() => {
    let data = latestUpdates;

    // Filter by district if selected
    if (districtFilter) {
      data = data.filter((item) => item.district === districtFilter);
    }

    // Search filter (checks serviceCenter, vehicleNumber)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.serviceCenter.toLowerCase().includes(lowerSearch) ||
          item.vehicleNumber.toLowerCase().includes(lowerSearch)
      );
    }

    // Time-based filter
    if (sortBy !== "all") {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      
      const thisWeekStart = new Date(todayStart);
      thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
      
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const thisYearStart = new Date(today.getFullYear(), 0, 1);

      data = data.filter((item) => {
        const itemDate = new Date(item.date);
        
        switch (sortBy) {
          case "today":
            return itemDate >= todayStart && itemDate < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
          case "yesterday":
            return itemDate >= yesterdayStart && itemDate < todayStart;
          case "this-week":
            return itemDate >= thisWeekStart;
          case "this-month":
            return itemDate >= thisMonthStart;
          case "this-year":
            return itemDate >= thisYearStart;
          default:
            return true;
        }
      });
    }

    // Sort by date
    data = data.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortAscending ? dateA - dateB : dateB - dateA;
    });

    return data;
  }, [latestUpdates, searchTerm, districtFilter, sortBy, sortAscending]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Whenever filters/search/sort change, reset page to 1
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, districtFilter, sortBy, sortAscending]);

  return (
    <div className="tw:col-span-5 tw:h-189 tw:bg-white tw:rounded-2xl tw:shadow-md tw:p-6 tw:overflow-x-auto">
      <h3 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800">
        Latest Service Updates
      </h3>

      {/* Search, Filter & Sort Controls */}
      <div className="tw:flex tw:items-center tw:gap-4 tw:mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by Service Center or Vehicle No."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tw:border tw:border-gray-300 tw:rounded-md tw:px-4 tw:py-2 tw:flex-1 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        />

        {/* District Filter */}
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="tw:border tw:border-gray-300 tw:rounded-md tw:px-4 tw:py-2 tw:min-w-40 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Time Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="tw:border tw:border-gray-300 tw:rounded-md tw:px-4 tw:py-2 tw:min-w-40 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="this-year">This Year</option>
        </select>

        {/* Sort toggle */}
        <button
          onClick={() => setSortAscending(!sortAscending)}
          className="tw:bg-blue-600 tw:text-white tw:rounded-md tw:px-4 tw:py-2 tw:whitespace-nowrap hover:tw:bg-blue-700"
          title="Toggle sort by date ascending/descending"
        >
          {sortAscending ? "Oldest First ↑" : "Newest First ↓"}
        </button>
      </div>

      {/* Table */}
      <table className="tw:w-full tw:border-collapse tw:text-sm md:tw:text-base">
        <thead className="tw:bg-blue-50 tw:text-blue-700">
          <tr>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
              Service Center
            </th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
              Date
            </th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
              Time
            </th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
              District
            </th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
              Vehicle No.
            </th>
            <th className="tw:text-left tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, idx) => (
            <tr
              key={startIndex + idx}
              onClick={() => setSelectedIndex(startIndex + idx)}
              className={`tw:cursor-pointer tw:transition-colors tw:duration-300 ${
                selectedIndex === startIndex + idx
                  ? "tw:bg-blue-200"
                  : (startIndex + idx) % 2 === 0
                  ? "tw:bg-white"
                  : "tw:bg-gray-50"
              } hover:tw:bg-blue-100`}
            >
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                {row.serviceCenter}
              </td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                {row.date}
              </td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                {row.time}
              </td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                {row.district}
              </td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                {row.vehicleNumber}
              </td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:border-blue-100">
                <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-red-600 tw:font-medium">
                  🔒 Restricted
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