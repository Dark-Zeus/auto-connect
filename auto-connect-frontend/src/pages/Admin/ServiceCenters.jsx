import React, { useState, useEffect, useMemo, useRef } from "react";
import ServiceCenterCard from "../../components/AdminComponents/ServiceCenterCard";
import ServiceCenterFilterBox from "../../components/AdminComponents/ServiceCenterFilterBox";
import ServiceCenterDetailCard from "../../components/AdminComponents/ServiceCenterDetailCard";
import ServiceCenterRequestPopup from "@components/AdminComponents/ServiceCenterRequestsBox";
import ServiceCenterAPI from "../../services/getServiceCentersApiService.js";

function ServiceCenters() {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // Fetch service centers
  useEffect(() => {
    async function fetchCenters() {
      try {
        const response = await ServiceCenterAPI.getAllServiceCenters();
        if (response.success) {
          setCenters(response.data);
        } else {
          console.error("Failed to load service centers:", response.message);
        }
      } catch (err) {
        console.error("Error fetching service centers:", err);
      }
    }
    fetchCenters();
  }, []);

  // Click outside popup to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  // Filtering and sorting
  const filteredCenters = useMemo(() => {
    let list = [...centers];

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((c) =>
        c.businessInfo?.businessName?.toLowerCase().includes(query)
      );
    }

    if (district) list = list.filter((c) => c.address?.district === district);
    if (category) list = list.filter((c) => c.category === category);

    if (sort === "rating_desc") list.sort((a, b) => b.rating.average - a.rating.average);
    else if (sort === "rating_asc") list.sort((a, b) => a.rating.average - b.rating.average);
    else if (sort === "name_asc")
      list.sort((a, b) => a.businessInfo?.businessName?.localeCompare(b.businessInfo?.businessName));
    else if (sort === "name_desc")
      list.sort((a, b) => b.businessInfo?.businessName?.localeCompare(a.businessInfo?.businessName));

    return list;
  }, [centers, search, district, category, sort]);

  const handleReset = () => {
    setSearch("");
    setDistrict("");
    setCategory("");
    setSort("");
  };

  // Helper to format operating hours
  const formatOperatingHours = (hoursObj) => {
    if (!hoursObj) return "";
    const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    return days
      .map(day => {
        const dayInfo = hoursObj[day];
        if (!dayInfo || !dayInfo.isOpen) return null;
        return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${dayInfo.open} - ${dayInfo.close}`;
      })
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="tw:p-8 tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-100 tw:min-h-screen">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
        <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800">
          Registered Service & Repair Centers
        </h1>
        <button
          onClick={() => setShowPopup(true)}
          className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg tw:shadow hover:tw:bg-blue-700 tw:transition"
        >
          {showPopup ? "Hide Requests" : "View Requests"}
        </button>
      </div>

      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:flex tw:items-center tw:justify-center tw:z-50">
          <div ref={popupRef}>
            <ServiceCenterRequestPopup />
          </div>
        </div>
      )}

      <ServiceCenterFilterBox
        searchQuery={search}
        selectedDistrict={district}
        selectedCategory={category}
        sortBy={sort}
        onSearchChange={setSearch}
        onDistrictChange={setDistrict}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onReset={handleReset}
      />

      <div className="tw:flex tw:flex-wrap tw:gap-6 tw:justify-center">
        {filteredCenters.map((center) => (
          <ServiceCenterCard
            key={center._id.$oid}
            name={center.businessInfo?.businessName}
            description={center.businessInfo?.description || ""}
            icon={center.profileImage}
            district={center.address?.district}
            rating={center.rating || { average: 0, totalReviews: 0 }}
            category={center.category || "Service Center"}
            isVerified={center.isVerified}
            servicesOffered={center.businessInfo?.servicesOffered || []}
            phone={center.phone}
            hours={formatOperatingHours(center.businessInfo?.operatingHours)}
            onView={() => setSelectedCenter(center)}
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
