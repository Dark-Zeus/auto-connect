import React, { useState, useEffect } from "react";
import { Search, CreditCard, Banknote, RotateCcw, Filter, Calendar, ArrowUpDown, X } from "lucide-react";

const methodOptions = [
  { label: "All", value: "All", icon: <CreditCard className="tw:w-4 tw:h-4 tw:text-blue-400" /> },
  { label: "Credit Card", value: "Credit Card", icon: <CreditCard className="tw:w-4 tw:h-4 tw:text-blue-500" /> },
  { label: "Bank Transfer", value: "Bank Transfer", icon: <Banknote className="tw:w-4 tw:h-4 tw:text-green-500" /> },
  { label: "Cash", value: "Cash", icon: <Banknote className="tw:w-4 tw:h-4 tw:text-yellow-500" /> },
];

const statusOptions = [
  { label: "All", value: "All" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
];

const dateOptions = [
  { label: "All", value: "All" },
  { label: "Today", value: "Today" },
  { label: "Yesterday", value: "Yesterday" },
  { label: "This Week", value: "This Week" },
  { label: "This Month", value: "This Month" },
];

function PaymentFilterBox({ filters, setFilters }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    setHasActiveFilters(
      !!filters.search ||
      filters.date !== "All" ||
      filters.method !== "All" ||
      filters.status !== "All"
    );
  }, [filters]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      date: "All",
      method: "All",
      status: "All",
    });
    const button = document.querySelector('.reset-btn');
    if (button) {
      button.classList.add('tw:animate-pulse');
      setTimeout(() => button.classList.remove('tw:animate-pulse'), 300);
    }
  };

  return (
    <div className="tw:max-w-full tw:mx-auto">
      <div className="tw:mb-8 tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:shadow-lg hover:tw:shadow-xl tw:transition-all tw:duration-300 tw:overflow-hidden">
        {/* Header with toggle */}
        <div className="tw:flex tw:items-center tw:justify-between tw:p-4 tw:bg-gradient-to-r tw:from-blue-50 tw:to-indigo-50 tw:border-b tw:border-gray-100">
          <div className="tw:flex tw:items-center tw:gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 hover:tw:text-blue-900 tw:font-semibold tw:transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
              <div className={`tw:transform tw:transition-transform tw:duration-200 ${isExpanded ? 'tw:rotate-180' : ''}`}>
                ↓
              </div>
            </button>
            {hasActiveFilters && (
              <div className="tw:flex tw:items-center tw:gap-1 tw:px-2 tw:py-1 tw:bg-blue-100 tw:text-blue-700 tw:text-xs tw:rounded-full tw:animate-fadeIn">
                <div className="tw:w-2 tw:h-2 tw:bg-blue-500 tw:rounded-full tw:animate-pulse"></div>
                Active
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Filter Content */}
        <div className={`tw:transition-all tw:duration-300 tw:ease-in-out ${
          isExpanded ? 'tw:max-h-96 tw:opacity-100' : 'tw:max-h-0 tw:opacity-0'
        } tw:overflow-hidden`}>
          <div className="tw:p-6">
            {/* Main Filters Row */}
            <div className="tw:grid tw:grid-cols-2 lg:tw:grid-cols-12 tw:gap-6 tw:mb-6">
              {/* Search */}
              <div className="lg:tw:col-span-4">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Search Payments
                </label>
                <div className={`tw:relative tw:group tw:transition-all tw:duration-200 ${
                  searchFocused ? 'tw:transform tw:scale-[1.02]' : ''
                }`}>
                  <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <Search className={`tw:h-5 tw:w-5 tw:transition-colors tw:duration-200 ${
                      searchFocused ? 'tw:text-blue-500' : 'tw:text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, recipient..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="tw:w-full tw:pl-10 tw:pr-10 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium tw:placeholder-gray-500 focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400"
                  />
                  {filters.search && (
                    <button
                      onClick={clearSearch}
                      className="tw:absolute tw:inset-y-0 tw:right-0 tw:pr-3 tw:flex tw:items-center tw:text-gray-400 hover:tw:text-gray-600 tw:transition-colors"
                    >
                      <X className="tw:h-5 tw:w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="lg:tw:col-span-2">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Date
                </label>
                <div className="tw:relative">
                  <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <Calendar className="tw:h-5 tw:w-5 tw:text-gray-400" />
                  </div>
                  <select
                    value={filters.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="tw:w-full tw:pl-10 tw:pr-4 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400 tw:appearance-none tw:cursor-pointer"
                  >
                    {dateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Method */}
              <div className="lg:tw:col-span-3">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Method
                </label>
                <div className="tw:relative">
                  <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <CreditCard className="tw:h-5 tw:w-5 tw:text-gray-400" />
                  </div>
                  <select
                    value={filters.method}
                    onChange={(e) => handleChange("method", e.target.value)}
                    className="tw:w-full tw:pl-10 tw:pr-4 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400 tw:appearance-none tw:cursor-pointer"
                  >
                    {methodOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="lg:tw:col-span-3">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Status
                </label>
                <div className="tw:relative">
                  <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <ArrowUpDown className="tw:h-5 tw:w-5 tw:text-gray-400" />
                  </div>
                  <select
                    value={filters.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="tw:w-full tw:pl-10 tw:pr-4 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400 tw:appearance-none tw:cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons & Active Filter Tags */}
            <div className="tw:flex tw:flex-col sm:tw:flex-row tw:gap-4 tw:items-start sm:tw:items-center tw:justify-between">
              <div className="tw:flex tw:flex-wrap tw:gap-2">
                {filters.search && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-blue-100 tw:text-blue-800 tw:text-sm tw:rounded-full">
                    <Search size={14} />
                    <span>"{filters.search.length > 20 ? filters.search.substring(0, 20) + '...' : filters.search}"</span>
                    <button onClick={clearSearch} className="hover:tw:bg-blue-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {filters.date !== "All" && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-green-100 tw:text-green-800 tw:text-sm tw:rounded-full">
                    <Calendar size={14} />
                    <span>{filters.date}</span>
                    <button onClick={() => handleChange("date", "All")} className="hover:tw:bg-green-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {filters.method !== "All" && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-yellow-100 tw:text-yellow-800 tw:text-sm tw:rounded-full">
                    {methodOptions.find(opt => opt.value === filters.method)?.icon}
                    <span>{filters.method}</span>
                    <button onClick={() => handleChange("method", "All")} className="hover:tw:bg-yellow-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {filters.status !== "All" && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-purple-100 tw:text-purple-800 tw:text-sm tw:rounded-full">
                    <ArrowUpDown size={14} />
                    <span>{filters.status}</span>
                    <button onClick={() => handleChange("status", "All")} className="hover:tw:bg-purple-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="reset-btn tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:bg-gray-100 tw:text-gray-700 tw:rounded-lg tw:font-medium hover:tw:bg-gray-200 focus:tw:ring-2 focus:tw:ring-gray-300 tw:transition-all tw:duration-200 tw:group"
                >
                  <RotateCcw className="tw:h-4 tw:w-4 group-hover:tw:rotate-180 tw:transition-transform tw:duration-300" />
                  Reset All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFilterBox;
