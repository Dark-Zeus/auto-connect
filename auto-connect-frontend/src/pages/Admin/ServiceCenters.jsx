import React, { useState } from "react";
import ServiceCenterCard from "../../components/AdminComponents/ServiceCenterCard";
import ServiceCenterFilterBox from "../../components/AdminComponents/ServiceCenterFilterBox";
import ServiceCenterDetailCard from "../../components/AdminComponents/ServiceCenterDetailCard";

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
    details: {
      firstName: "Rashmika",
      lastName: "Dilmin",
      icon: center1,
      email: "rashmika@cityfix.lk",
      phone: "0711111111",
      address: {
        street: "123 Main Rd",
        city: "Colombo",
        district: "Colombo",
        province: "Western",
        postalCode: "10100",
      },
      businessInfo: {
        businessName: "CityFix Motors",
        licenseNumber: "LIC-0001",
        businessRegistrationNumber: "BR-123456",
        taxIdentificationNumber: "TIN-998877",
        servicesOffered: ["Engine Tuning", "Wheel Alignment"],
      },
    },
  },
  {
    name: "TechAuto Solutions",
    description: "Experts in electric and hybrid vehicles",
    icon: center2,
    district: "Gampaha",
    rating: 4.5,
    details: {
      firstName: "Nimal",
      lastName: "Perera",
      icon: center2,
      email: "nimal@techauto.lk",
      phone: "0722222222",
      address: {
        street: "56 Battery St",
        city: "Negombo",
        district: "Gampaha",
        province: "Western",
        postalCode: "11500",
      },
      businessInfo: {
        businessName: "TechAuto Solutions",
        licenseNumber: "LIC-0021",
        businessRegistrationNumber: "BR-654321",
        taxIdentificationNumber: "TIN-112233",
        servicesOffered: ["Hybrid Repairs", "EV Diagnostics"],
      },
    },
  },
  {
    name: "QuickFix Hub",
    description: "Affordable and fast vehicle repairs",
    icon: center3,
    district: "Kandy",
    rating: 4.2,
    details: {
      firstName: "Kasun",
      lastName: "Jayasuriya",
      icon: center3,
      email: "kasun@quickfix.lk",
      phone: "0755555555",
      address: {
        street: "88 Hill Side",
        city: "Kandy",
        district: "Kandy",
        province: "Central",
        postalCode: "20000",
      },
      businessInfo: {
        businessName: "QuickFix Hub",
        licenseNumber: "LIC-0033",
        businessRegistrationNumber: "BR-777888",
        taxIdentificationNumber: "TIN-445566",
        servicesOffered: ["Body Repairs", "Oil Change"],
      },
    },
  },
];

function ServiceCenters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    setSortBy("");
  };

  const filteredCenters = allCenters
    .filter((center) => {
      return (
        (!searchQuery ||
          center.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedDistrict || center.district === selectedDistrict)
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating_desc") return b.rating - a.rating;
      if (sortBy === "rating_asc") return a.rating - b.rating;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="tw:p-6">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-10">
        <div />
        <button
          onClick={() => alert("Redirect to New Service Center Form")}
          className="tw:bg-blue-600 tw:text-white tw:px-4 tw:py-3 tw:rounded-lg hover:tw:bg-blue-700 tw:transition"
        >
          + New Requests
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
            onView={() => setSelectedCenter(center.details)}
          />
        ))}
      </div>

      {selectedCenter && (
        <ServiceCenterDetailCard
          data={selectedCenter}
          onClose={() => setSelectedCenter(null)}
        />
      )}
    </div>
  );
}

export default ServiceCenters;
