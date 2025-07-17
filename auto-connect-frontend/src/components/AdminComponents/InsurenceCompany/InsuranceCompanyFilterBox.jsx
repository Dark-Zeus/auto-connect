import React from "react";

const sortOptions = [
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
  { label: "Established (Newest First)", value: "date_desc" },
  { label: "Established (Oldest First)", value: "date_asc" },
];

const filterOptions = [
  { label: "All", value: "" },
  { label: "Before 2010", value: "before2010" },
  { label: "After 2010", value: "after2010" },
];

function InsuranceCompanyFilterBox({
  searchQuery,
  filterValue,
  sortValue,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="tw:max-w-7xl tw:mx-auto">
      <div className="tw:mb-8 tw:p-6 tw:bg-white tw:border tw:border-gray-300 tw:rounded-xl tw:shadow-md">
        {/* Filters Row */}
        <div className="tw:flex tw:justify-center tw:gap-6 tw:flex-nowrap tw:w-full">
          {/* Search by Name */}
          <div className="tw:basis-1/2 tw:min-w-[250px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter company name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            />
          </div>

          {/* Filter by Year */}
          <div className="tw:basis-1/4 tw:min-w-[180px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Established Year Filter
            </label>
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="tw:basis-1/4 tw:min-w-[180px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Sort By
            </label>
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            >
              <option value="">None</option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="tw-mt-4 tw-flex tw-justify-end">
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

export default InsuranceCompanyFilterBox;
