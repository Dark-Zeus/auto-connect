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
    <div className="bg-white shadow-sm border p-4 rounded-xl mb-6 w-full max-w-[1000px] min-h-[80px] mx-auto">
      <div className="flex flex-wrap gap-4 justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 min-w-[200px] border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Filter by District */}
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="min-w-[180px] border px-3 py-2 rounded-lg"
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
          className="min-w-[180px] border px-3 py-2 rounded-lg"
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
          className="text-sm text-red-600 hover:underline mt-2"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default ServiceCenterFilterBox;
