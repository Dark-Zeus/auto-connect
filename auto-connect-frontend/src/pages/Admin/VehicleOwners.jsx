import React, { useState, useEffect, useMemo } from "react";
import VehicleOwnerCard from "@components/AdminComponents/VehicleOwners/VehicleOwnerDetailsBox";
import SearchFilterSortBox from "@components/AdminComponents/VehicleOwners/VehicleOwnerFilterBox";
import VehicleOwnerAPI from "../../services/getVehicleOwnersApiService.js";

function OwnerView() {
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchOwners() {
      try {
        const data = await VehicleOwnerAPI.getAllOwners();
        setOwners(data.data); // backend returns { success, data: [...] }
      } catch (err) {
        console.error("Error fetching vehicle owners:", err);
      }
    }
    fetchOwners();
  }, []);

  const filteredOwners = useMemo(() => {
    let list = [...owners];

    // Search by name or NIC
    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (o) =>
          `${o.firstName} ${o.lastName}`.toLowerCase().includes(query) ||
          o.nicNumber.toLowerCase().includes(query)
      );
    }

    // Filter by district
    if (filter) {
      list = list.filter((o) => o.address?.district === filter);
    }

    // Sort by name ascending/descending
    if (sort === "name-asc") {
      list.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    } else if (sort === "name-desc") {
      list.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
    }

    return list;
  }, [owners, search, filter, sort]);

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const paginatedOwners = filteredOwners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setSearch("");
    setFilter("");
    setSort("");
  };

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
        onReset={handleReset}
      />

      <div className="tw:grid tw:justify-center tw:grid-cols-3 md:tw:grid-cols-2 tw:gap-6 lg:tw:grid-cols-3 tw:mx-auto tw:max-w-7xl">
        {paginatedOwners.map((owner) => (
          <VehicleOwnerCard key={owner._id} owner={owner} />
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
