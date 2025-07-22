import React, { useState, useMemo } from "react";
import VehicleOwnerCard from "@components/AdminComponents/VehicleOwners/VehicleOwnerDetailsBox";
import SearchFilterSortBox from "@components/AdminComponents/VehicleOwners/VehicleOwnerFilterBox";
import user1 from "@assets/images/vehicleowner1.jpg";
import user2 from "@assets/images/vehicleowner2.jpg";
import user3 from "@assets/images/vehicleowner.jpg";
const ownerDataList = [
  {
    name: "Kavindu Perera",
    email: "kavindu@email.com",
    mobile: "0711234567",
    image: user2,
    nic: "993456789V",
    gender: "Male",
    dob: "1999-06-21",
    address: "No. 42, Rose Garden",
    city: "Kandy",
    district: "Kandy",
    province: "Central",
    postalCode: "20000",
  },
  {
    name: "Rashmika Dilmin",
    email: "rashmika@email.com",
    mobile: "0751534532",
    image: user1,
    nic: "200118201761",
    gender: "Male",
    dob: "1998-05-15",
    address: "No. 10, Main Street",
    city: "Colombo",
    district: "Colombo",
    province: "Western",
    postalCode: "22343",
  },
    {
    name: "Kavindu Silva",
    email: "kavindu@email.com",
    mobile: "0745234964",
    image: user3,
    nic: "993456789V",
    gender: "Male",
    dob: "1999-05-21",
    address: "Galle Road, No 12",
    city: "Bambalapitiya",
    district: "Colombo",
    province: "Western",
    postalCode: "27644",
  },
  {
    name: "Nimal Perera",
    email: "nimalperera@email.com",
    mobile: "0781534432",
    image: user1,
    nic: "200345328",
    gender: "Male",
    dob: "2003-05-15",
    address: "No 12, Galle Road",
    city: "Colombo",
    district: "Colombo",
    province: "Western",
    postalCode: "22343",
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

    <div className="tw:grid tw:justify-center tw:grid-cols-3 md:tw:grid-cols-2 tw:gap-6 lg:tw:grid-cols-3 tw:mx-auto tw:max-w-7xl">
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
