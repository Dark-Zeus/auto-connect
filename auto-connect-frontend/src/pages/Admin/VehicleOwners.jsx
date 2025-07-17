import React, { useState, useMemo } from "react";
import VehicleOwnerCard from "@components/AdminComponents/VehicleOwners/VehicleOwnerDetailsBox";
import SearchFilterSortBox from "@components/AdminComponents/VehicleOwners/VehicleOwnerFilterBox";
import user1 from "@assets/images/vehicleowner1.jpg";

const ownerDataList = [
  {
    name: "Kavindu Perera",
    email: "kavindu@email.com",
    mobile: "0711234567",
    image: user1,
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
    name: "Kavindu Perera",
    email: "kavindu@email.com",
    mobile: "0711234567",
    image: user1,
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
    name: "Kavindu Perera",
    email: "kavindu@email.com",
    mobile: "0711234567",
    image: user1,
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
    name: "Kavindu Perera",
    email: "kavindu@email.com",
    mobile: "0711234567",
    image: user1,
    nic: "993456789V",
    gender: "Male",
    dob: "1999-06-21",
    address: "No. 42, Rose Garden",
    city: "Kandy",
    district: "Kandy",
    province: "Central",
    postalCode: "20000",
  },
  // You can add more sample owners here
];

function OwnerView() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const filteredOwners = useMemo(() => {
    let filtered = [...ownerDataList];

    // Search by name or NIC
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.name.toLowerCase().includes(query) ||
          o.nic.toLowerCase().includes(query)
      );
    }

    // Sort logic
    if (sort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [search, sort]);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const paginatedOwners = filteredOwners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="tw:p-8 tw:bg-gradient-to-br tw:from-[var(--primary-light)] tw:to-indigo-100 tw:min-h-screen">
      <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-4">Vehicle Owner List</h1>

      <SearchFilterSortBox
        search={search}
        onSearch={setSearch}
        filter={""} // No filter implemented
        onFilter={() => {}}
        sort={sort}
        onSort={setSort}
      />

      <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6 tw:max-w-7xl tw:mx-auto">
        {paginatedOwners.map((owner) => (
          <VehicleOwnerCard key={owner.nic} owner={owner} />
        ))}
      </div>

      {/* Pagination */}
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
