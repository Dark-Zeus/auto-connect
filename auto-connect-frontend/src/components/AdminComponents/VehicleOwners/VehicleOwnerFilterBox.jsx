import React from "react";

function SearchFilterSortBox({ search, onSearch, filter, onFilter, sort, onSort, onReset }) {
  return (
    <div className="tw:max-w-333 tw:mx-auto">
      <div className="tw:mb-8 tw:p-6 tw:bg-white tw:border tw:border-gray-300 tw:rounded-xl tw:shadow-md">
        {/* Filters Row - single line */}
        <div className="tw:flex tw:justify-center tw:gap-6 tw:flex-nowrap tw:w-full">
          {/* Search - 50% width */}
          <div className="tw:basis-1/2 tw:min-w-[250px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Search by Name or NIC
            </label>
            <input
              type="text"
              placeholder="Enter name or NIC..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            />
          </div>

          {/* Filter - 25% width */}
          <div className="tw:basis-1/4 tw:min-w-[180px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Filter by Transmission
            </label>
            <select
              value={filter}
              onChange={(e) => onFilter(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            >
              <option value="">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Sort - 25% width */}
          <div className="tw:basis-1/4 tw:min-w-[180px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            >
              <option value="">None</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="year-desc">Model Year ↓</option>
              <option value="year-asc">Model Year ↑</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="tw:mt-4 tw:flex tw:justify-start">
          <button
            onClick={onReset}
            className="tw:mt-6 tw:bg-blue-100 tw:text-blue-800 tw:px-5 tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-blue-200 tw:transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilterSortBox;
