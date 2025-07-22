import React from "react";
import { Search, Filter, SortAsc, RotateCcw } from "lucide-react";

function SearchFilterSortBox({ search, onSearch, filter, onFilter, sort, onSort, onReset }) {
  const hasActiveFilters = search || filter || sort;

  return (
    <div className="tw:max-w-7xl tw:mx-auto tw:px-4 tw:py-6">
      <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:border tw:border-blue-200 tw:rounded-2xl tw:shadow-lg tw:shadow-blue-100/50 tw:backdrop-blur-sm tw:p-8 tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30">
        
        {/* Header */}
        <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6">
          <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-blue-600 tw:rounded-xl tw:shadow-md">
            <Search className="tw:w-5 tw:h-5 tw:text-white" />
          </div>
          <div>
            <h2 className="tw:text-xl tw:font-bold tw:text-blue-900 tw:mb-1">Search & Filter</h2>
            <p className="tw:text-sm tw:text-blue-600">Find and organize your data</p>
          </div>
        </div>

        {/* Main Controls Container */}
        <div className="tw:space-y-6">
          
          {/* Search Section */}
          <div className="tw:space-y-2">
            <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-900 tw:font-semibold tw:text-sm tw:tracking-wide">
              <Search className="tw:w-4 tw:h-4" />
              Search by Name or NIC
            </label>
            <div className="tw:relative">
              <input
                type="text"
                placeholder="Enter name or NIC number..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="tw:w-full tw:p-4 tw:pr-12 tw:border-2 tw:border-blue-200 tw:rounded-xl tw:bg-white/80 tw:backdrop-blur-sm tw:text-blue-900 tw:font-medium tw:placeholder-blue-400 tw:transition-all tw:duration-300 focus:tw:border-blue-500 focus:tw:ring-4 focus:tw:ring-blue-200 focus:tw:bg-white tw:shadow-sm hover:tw:shadow-md"
              />
              <Search className="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-blue-400" />
            </div>
          </div>

          {/* Filter and Sort Row */}
          <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-2 tw:gap-6">
            
          {/* Filter Section - Districts */}
          <div className="tw:space-y-2">
            <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-900 tw:font-semibold tw:text-sm tw:tracking-wide">
              <Filter className="tw:w-4 tw:h-4" />
              Filter by District
            </label>
            <div className="tw:relative">
              <select
                value={filter}
                onChange={(e) => onFilter(e.target.value)}
                className="tw:w-full tw:p-4 tw:pr-12 tw:border-2 tw:border-blue-200 tw:rounded-xl tw:bg-white/80 tw:backdrop-blur-sm tw:text-blue-900 tw:font-medium tw:transition-all tw:duration-300 focus:tw:border-blue-500 focus:tw:ring-4 focus:tw:ring-blue-200 focus:tw:bg-white tw:shadow-sm hover:tw:shadow-md tw:appearance-none tw:cursor-pointer"
              >
                <option value="">All Districts</option>
                {[
                  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
                  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
                  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
                  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
                  "Badulla", "Monaragala", "Ratnapura", "Kegalle"
                ].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <Filter className="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-blue-400 tw:pointer-events-none" />
            </div>
          </div>

            {/* Sort Section */}
            <div className="tw:space-y-2">
              <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-900 tw:font-semibold tw:text-sm tw:tracking-wide">
                <SortAsc className="tw:w-4 tw:h-4" />
                Sort Options
              </label>
              <div className="tw:relative">
                <select
                  value={sort}
                  onChange={(e) => onSort(e.target.value)}
                  className="tw:w-full tw:p-4 tw:pr-12 tw:border-2 tw:border-blue-200 tw:rounded-xl tw:bg-white/80 tw:backdrop-blur-sm tw:text-blue-900 tw:font-medium tw:transition-all tw:duration-300 focus:tw:border-blue-500 focus:tw:ring-4 focus:tw:ring-blue-200 focus:tw:bg-white tw:shadow-sm hover:tw:shadow-md tw:appearance-none tw:cursor-pointer"
                >
                  <option value="">📋 Default Order</option>
                  <option value="name-asc">📝 Name A→Z</option>
                  <option value="name-desc">📝 Name Z→A</option>
                  <option value="year-desc">📅 Newest First</option>
                  <option value="year-asc">📅 Oldest First</option>
                </select>
                <SortAsc className="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-5 tw:h-5 tw:text-blue-400 tw:pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reset Button and Status */}
          <div className="tw:flex tw:flex-col sm:tw:flex-row tw:items-start sm:tw:items-center tw:justify-between tw:gap-4 tw:pt-4 tw:border-t tw:border-blue-100">
            <div className="tw:flex tw:items-center tw:gap-3">
              <button
                onClick={onReset}
                disabled={!hasActiveFilters}
                className="tw:flex tw:items-center tw:gap-2 tw:px-6 tw:py-3 tw:bg-gradient-to-r tw:from-blue-500 tw:to-blue-600 tw:text-white tw:font-semibold tw:rounded-xl tw:shadow-md tw:transition-all tw:duration-300 hover:tw:from-blue-600 hover:tw:to-blue-700 hover:tw:shadow-lg hover:tw:-translate-y-0.5 active:tw:translate-y-0 disabled:tw:from-gray-300 disabled:tw:to-gray-400 disabled:tw:cursor-not-allowed disabled:tw:transform-none"
              >
                <RotateCcw className="tw:w-4 tw:h-4" />
                Reset Filters
              </button>
              
              {hasActiveFilters && (
                <div className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:bg-blue-100 tw:text-blue-700 tw:rounded-lg tw:text-sm tw:font-medium">
                  <div className="tw:w-2 tw:h-2 tw:bg-blue-500 tw:rounded-full tw:animate-pulse"></div>
                  Active filters applied
                </div>
              )}
            </div>

            {/* Filter Summary */}
            <div className="tw:text-sm tw:text-blue-600 tw:space-y-1">
              {search && (
                <div className="tw:flex tw:items-center tw:gap-2">
                  <span className="tw:font-medium">Search:</span>
                  <span className="tw:px-2 tw:py-1 tw:bg-blue-200 tw:rounded-md tw:text-blue-800 tw:font-medium">"{search}"</span>
                </div>
              )}
              {filter && (
                <div className="tw:flex tw:items-center tw:gap-2">
                  <span className="tw:font-medium">District:</span>
                  <span className="tw:px-2 tw:py-1 tw:bg-green-200 tw:rounded-md tw:text-green-800 tw:font-medium">{filter}</span>
                </div>
              )}
              {sort && (
                <div className="tw:flex tw:items-center tw:gap-2">
                  <span className="tw:font-medium">Sort:</span>
                  <span className="tw:px-2 tw:py-1 tw:bg-purple-200 tw:rounded-md tw:text-purple-800 tw:font-medium">
                    {sort.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilterSortBox;