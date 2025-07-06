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
    <div className="tw:bg-white tw:shadow-sm tw:border tw:p-4 tw:rounded-xl tw:mb-6 tw:w-full tw:max-w-[1000px] tw:min-h-[80px] tw:mx-auto">
      <div className="tw:flex tw:flex-wrap tw:gap-4 tw:justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="tw:flex-1 tw:min-w-[200px] tw:border tw:px-3 tw:py-2 tw:rounded-lg tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400"
        />

        {/* Filter by District */}
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="tw:min-w-[180px] tw:border tw:px-3 tw:py-2 tw:rounded-lg"
        >
          <option value="">All Districts</option>
          {sriLankaDistricts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="tw:min-w-[180px] tw:border tw:px-3 tw:py-2 tw:rounded-lg"
        >
          <option value="">Sort By</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="tw:text-sm tw:text-red-600 tw:hover:underline tw:mt-2"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default ServiceCenterFilterBox;
