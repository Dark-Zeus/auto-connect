import React, { useState } from "react";
import ServiceCenterCard from "../../components/AdminComponents/ServiceCenterCard";
import ServiceCenterFilterBox from "../../components/AdminComponents/ServiceCenterFilterBox";
import center1 from "../../assets/images/service_center1.jpg";
import center2 from "../../assets/images/service_center2.jpg";
import center3 from "../../assets/images/service_center3.jpg";

const allCenters = [
  {
    name: "CityFix Motors",
    description: "Premium car service center in Colombo",
    icon: center1,
    district: "Colombo",
    rating: 4.7,
  },
  {
    name: "TechAuto Solutions",
    description: "Experts in electric and hybrid vehicles",
    icon: center2,
    district: "Gampaha",
    rating: 4.5,
  },
  {
    name: "QuickFix Hub",
    description: "Affordable and fast vehicle repairs",
    icon: center3,
    district: "Kandy",
    rating: 4.2,
  },
  {
    name: "QuickFix Hub",
    description: "Affordable and fast vehicle repairs",
    icon: center3,
    district: "Kandy",
    rating: 4.2,
  },
  {
    name: "QuickFix Hub",
    description: "Affordable and fast vehicle repairs",
    icon: center3,
    district: "Kandy",
    rating: 4.2,
  },
  {
    name: "QuickFix Hub",
    description: "Affordable and fast vehicle repairs",
    icon: center3,
    district: "Kandy",
    rating: 4.2,
  },
];

function ServiceCenters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    setSortBy("");
  };

  // Apply filters
  let filteredCenters = allCenters.filter((center) => {
    return (
      (!searchQuery ||
        center.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedDistrict || center.district === selectedDistrict)
    );
  });

  // Sort results
  if (sortBy === "rating_desc") {
    filteredCenters.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "rating_asc") {
    filteredCenters.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === "name_asc") {
    filteredCenters.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name_desc") {
    filteredCenters.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="tw:p-6">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-10">
        <div /> {/* Empty div to push the button to the right */}
        <button
          onClick={() => alert("Redirect to New Service Center Form")}
          className="tw:bg-blue-600 tw:text-white tw:px-4 tw:py-3 tw:rounded-lg hover:tw:bg-blue-700 tw:transition"
        >
          + New Service Center
        </button>
      </div>

      <ServiceCenterFilterBox
        searchQuery={searchQuery}
        selectedDistrict={selectedDistrict}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onDistrictChange={setSelectedDistrict}
        onSortChange={setSortBy}
        onReset={handleReset}
      />

      <div className="tw:flex tw:flex-wrap tw:gap-6 tw:justify-center">
        {filteredCenters.map((center, index) => (
          <ServiceCenterCard
            key={index}
            name={center.name}
            description={center.description}
            icon={center.icon}
            district={center.district}
            rating={center.rating}
            onView={() => alert(`Viewing ${center.name}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default ServiceCenters;
