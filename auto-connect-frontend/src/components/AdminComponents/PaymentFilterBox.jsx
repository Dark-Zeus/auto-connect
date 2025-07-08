import React from "react";

function PaymentFilterBox({ filters, setFilters }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      date: "All",
      method: "All",
      status: "All",
    });
  };

  return (
    <div className="tw:mb-8 tw:p-6 tw:bg-white tw:border tw:border-blue-200 tw:rounded-2xl tw:shadow-md">
      {/* Filters in one row */}
      <div className="tw:flex tw:items-end tw:gap-6">
        {/* Search */}
        <div className="tw:flex tw:flex-col tw:w-2/5">
          <label className="tw:mb-2 tw:text-blue-800 tw:font-semibold">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search by name, recipient..."
            className="tw:p-3 tw:border tw:border-blue-300 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800"
          />
        </div>

        {/* Date */}
        <div className="tw:flex tw:flex-col tw:w-1/5">
          <label className="tw:mb-2 tw:text-blue-800 tw:font-semibold">Date</label>
          <select
            value={filters.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="tw:p-3 tw:border tw:border-blue-300 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800"
          >
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        {/* Method */}
        <div className="tw:flex tw:flex-col tw:w-1/5">
          <label className="tw:mb-2 tw:text-blue-800 tw:font-semibold">Method</label>
          <select
            value={filters.method}
            onChange={(e) => handleChange("method", e.target.value)}
            className="tw:p-3 tw:border tw:border-blue-300 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800"
          >
            <option value="All">All</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        {/* Status */}
        <div className="tw:flex tw:flex-col tw:w-1/5">
          <label className="tw:mb-2 tw:text-blue-800 tw:font-semibold">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="tw:p-3 tw:border tw:border-blue-300 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

        {/* Reset Button */}
        <div className="tw-mt-4 tw-flex tw-justify-end">
          <button
            onClick={resetFilters}
            className="tw:mt-6 tw:bg-blue-100 tw:text-blue-800 tw:px-5 tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-blue-200 tw:transition"
          >
            Reset
          </button>
        </div>
    </div>
  );
}

export default PaymentFilterBox;
