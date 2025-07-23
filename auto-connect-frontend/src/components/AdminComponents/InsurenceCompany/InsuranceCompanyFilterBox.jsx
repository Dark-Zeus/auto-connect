import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, ArrowUpDown, RotateCcw, X } from "lucide-react";

const sortOptions = [
  { label: "Name (A-Z)", value: "name_asc", icon: "🔤" },
  { label: "Name (Z-A)", value: "name_desc", icon: "🔤" },
  { label: "Established (Newest First)", value: "date_desc", icon: "🕒" },
  { label: "Established (Oldest First)", value: "date_asc", icon: "🕒" },
];

const filterOptions = [
  { label: "All", value: "" },
  { label: "Before 2010", value: "before2010" },
  { label: "After 2010", value: "after2010" },
];

function InsuranceCompanyFilterBox({
  searchQuery = "",
  filterValue = "",
  sortValue = "",
  onSearchChange,
  onFilterChange,
  onSortChange,
  onReset,
  totalResults = 0,
  isLoading = false,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    setHasActiveFilters(
      !!searchQuery || !!filterValue || !!sortValue
    );
  }, [searchQuery, filterValue, sortValue]);

  const clearSearch = () => {
    onSearchChange("");
  };

  const handleReset = () => {
    onReset();
    const button = document.querySelector('.reset-btn');
    if (button) {
      button.classList.add('tw:animate-pulse');
      setTimeout(() => button.classList.remove('tw:animate-pulse'), 300);
    }
  };

  return (
    <div className="tw:max-w-350 tw:mx-auto">
      <div className="tw:mb-8 tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:shadow-lg hover:tw:shadow-xl tw:transition-all tw:duration-300 tw:overflow-hidden">
        {/* Header with toggle and results count */}
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
          <div className="tw:flex tw:items-center tw:gap-4">
            {totalResults > 0 && (
              <div className="tw:text-sm tw:text-gray-600 tw:font-medium">
                {isLoading ? (
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <div className="tw:w-4 tw:h-4 tw:border-2 tw:border-blue-500 tw:border-t-transparent tw:rounded-full tw:animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  `${totalResults} result${totalResults !== 1 ? 's' : ''} found`
                )}
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
              {/* Search - 50% width on desktop */}
              <div className="lg:tw:col-span-6">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Search Insurance Companies
                </label>
                <div className={`tw:relative tw:group tw:transition-all tw:duration-200 ${
                  searchFocused ? 'tw:transform tw:scale-[1.02]' : ''
                }`}>
                  <div className="tw:absolute tw:inset-y-0 tw:right-2 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <Search className={`tw:h-5 tw:w-5 tw:transition-colors tw:duration-200 ${
                      searchFocused ? 'tw:text-blue-500' : 'tw:text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="tw:w-full tw:pl-10 tw:pr-10 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium tw:placeholder-gray-500 focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="tw:absolute tw:inset-y-0 tw:right-0 tw:pr-3 tw:flex tw:items-center tw:text-gray-400 hover:tw:text-gray-600 tw:transition-colors"
                    >
                      <X className="tw:h-5 tw:w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter by Year - 25% width */}
              <div className="lg:tw:col-span-3">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Established Year
                </label>
                <div className="tw:relative">
                  <div className="tw:absolute tw:inset-y-0 tw:right-2 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <Calendar className="tw:h-5 tw:w-5 tw:text-gray-400" />
                  </div>
                  <select
                    value={filterValue}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="tw:w-full tw:pl-10 tw:pr-4 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400 tw:appearance-none tw:cursor-pointer"
                  >
                    {filterOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort By - 25% width */}
              <div className="lg:tw:col-span-3">
                <label className="tw:block tw:mb-2 tw:text-gray-700 tw:font-semibold tw:text-sm">
                  Sort By
                </label>
                <div className="tw:relative">
                  <div className="tw:absolute tw:inset-y-0 tw:right-2 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
                    <ArrowUpDown className="tw:h-5 tw:w-5 tw:text-gray-400" />
                  </div>
                  <select
                    value={sortValue}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="tw:w-full tw:pl-10 tw:pr-4 tw:py-3 tw:border tw:border-gray-300 tw:rounded-xl tw:bg-white tw:text-gray-800 tw:font-medium focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:transition-all tw:duration-200 hover:tw:border-gray-400 tw:appearance-none tw:cursor-pointer"
                  >
                    <option value="">Default Order</option>
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons & Active Filter Tags */}
            <div className="tw:flex tw:flex-col sm:tw:flex-row tw:gap-4 tw:items-start sm:tw:items-center tw:justify-between">
              <div className="tw:flex tw:flex-wrap tw:gap-2">
                {searchQuery && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-blue-100 tw:text-blue-800 tw:text-sm tw:rounded-full">
                    <Search size={14} />
                    <span>"{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}"</span>
                    <button onClick={clearSearch} className="hover:tw:bg-blue-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {filterValue && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-green-100 tw:text-green-800 tw:text-sm tw:rounded-full">
                    <Calendar size={14} />
                    <span>
                      {filterOptions.find(opt => opt.value === filterValue)?.label || filterValue}
                    </span>
                    <button onClick={() => onFilterChange("")} className="hover:tw:bg-green-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {sortValue && (
                  <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-purple-100 tw:text-purple-800 tw:text-sm tw:rounded-full">
                    <ArrowUpDown size={14} />
                    <span>{sortOptions.find(opt => opt.value === sortValue)?.label || 'Custom'}</span>
                    <button onClick={() => onSortChange("")} className="hover:tw:bg-purple-200 tw:rounded-full tw:p-0.5 tw:transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
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

export default InsuranceCompanyFilterBox;
