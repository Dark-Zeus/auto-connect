import React, { useState, useMemo } from "react";
import VehicleOwnerCard from "@components/AdminComponents/VehicleOwners/VehicleOwnerDetailsBox";
import SearchFilterSortBox from "@components/AdminComponents/VehicleOwners/VehicleOwnerFilterBox";

const ownerDataList = [
  {
    name: "John Doe",
    mobile: "0771234567",
    nic: "987654321V",
    address: "123 Galle Road, Colombo",
    email: "john@example.com",
    vehicleName: "Toyota",
    vehicleModel: "Corolla",
    leasing: "Yes",
    manufacturer: "Toyota Motor Corporation",
    modelYear: "2020",
    registeredYear: "2021",
    condition: "Excellent",
    transmission: "Automatic",
    fuelType: "Petrol",
    engineCapacity: "1800",
    mileage: "25000",
  },
  {
    name: "Jane Smith",
    mobile: "0777654321",
    nic: "123456789V",
    address: "456 Kandy Road, Kandy",
    email: "jane@example.com",
    vehicleName: "Honda",
    vehicleModel: "Civic",
    leasing: "No",
    manufacturer: "Honda Motors",
    modelYear: "2019",
    registeredYear: "2020",
    condition: "Good",
    transmission: "Manual",
    fuelType: "Diesel",
    engineCapacity: "1600",
    mileage: "30000",
  },
    {
    name: "Jane Smith",
    mobile: "0777654321",
    nic: "123456789V",
    address: "456 Kandy Road, Kandy",
    email: "jane@example.com",
    vehicleName: "Honda",
    vehicleModel: "Civic",
    leasing: "No",
    manufacturer: "Honda Motors",
    modelYear: "2019",
    registeredYear: "2020",
    condition: "Good",
    transmission: "Manual",
    fuelType: "Diesel",
    engineCapacity: "1600",
    mileage: "30000",
  },
  // Add more data if needed
];

function OwnerView() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const filteredOwners = useMemo(() => {
    let filtered = [...ownerDataList];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.name.toLowerCase().includes(query) ||
          o.nic.toLowerCase().includes(query)
      );
    }

    // Filter by transmission
    if (filter) {
      filtered = filtered.filter((o) => o.transmission === filter);
    }

    // Sort
    if (sort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "year-asc") {
      filtered.sort((a, b) => a.modelYear - b.modelYear);
    } else if (sort === "year-desc") {
      filtered.sort((a, b) => b.modelYear - a.modelYear);
    }

    return filtered;
  }, [search, filter, sort]);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const paginatedOwners = filteredOwners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="tw:p-8 tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-100 tw:min-h-screen">
      <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-4">Vehicle Owner List</h1>

      <SearchFilterSortBox
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        sort={sort}
        onSort={setSort}
      />

    <div className="tw:grid tw:justify-center tw:grid-cols-3 md:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6 tw:mx-auto tw:max-w-333">
    {paginatedOwners.map((owner, index) => (
      <VehicleOwnerCard key={owner.nic} owner={owner} />
    ))}
    </div>

      {/* Pagination Controls */}
      <div className="tw:mt-6 tw:flex tw:justify-center tw:space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`tw:px-4 tw:py-2 tw:rounded-lg ${
              currentPage === i + 1
                ? "tw:bg-blue-600 tw:text-white"
                : "tw:bg-white tw:text-blue-600 tw:border tw:border-blue-300"
            } tw:shadow-sm hover:tw:bg-blue-500 hover:tw:text-white tw:transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OwnerView;
