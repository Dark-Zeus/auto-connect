import React from "react";

const sriLankaDistricts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
  "Trincomalee", "Vavuniya"
];

const sortOptions = [
  { label: "Rating (High to Low)", value: "rating_desc" },
  { label: "Rating (Low to High)", value: "rating_asc" },
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
];

function ServiceCenterFilterBox({
  searchQuery,
  selectedDistrict,
  sortBy,
  onSearchChange,
  onDistrictChange,
  onSortChange,
  onReset
}) {
  return (
    <div className="tw:max-w-333 tw:mx-auto">
      <div className="tw:mb-8 tw:p-6 tw:bg-white tw:border tw:border-gray-300 tw:rounded-2xl tw:shadow-md">
        {/* Filters Row - single row */}
        <div className="tw:flex tw:justify-center tw:gap-6 tw:flex-nowrap tw:w-full">
          {/* Search - 50% width */}
          <div className="tw:basis-1/2 tw:min-w-[250px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            />
          </div>

          {/* Filter by District - 25% width */}
          <div className="tw:basis-1/4 tw:min-w-[180px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Filter by District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
            >
              <option value="">All Districts</option>
              {sriLankaDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By - 25% width */}
          <div className="tw:basis-1/4 tw:min-w-[180px]">
            <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">
              Sort By
            </label>
            <select
              value={sortBy}
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

        {/* Reset button bottom left */}
        <div className="tw:flex tw:justify-start tw:mt-6">
          <button
            onClick={onReset}
            className="tw:text-sm tw:text-red-600 hover:tw:underline tw:font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCenterFilterBox;
