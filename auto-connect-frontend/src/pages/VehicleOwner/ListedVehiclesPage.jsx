import React, { useEffect, useMemo, useState } from "react";
import ListedVehicleCard from "@components/CarBuyer/ListedVehicleCard";
import SearchVehicleFilter from "@components/CarBuyer/SearchVehicleFilter";
import Pagination from "@components/CarBuyer/Pagination";
import { CircularProgress, Typography } from "@mui/material";
import buyVehicleApiService from "../../services/buyVehicleApiService";

const vehiclesPerPage = 20;

const getEffectiveTimestamp = (vehicle) =>
  vehicle?.effectiveCreatedAt ??
  (vehicle?.promotion === 1 && vehicle?.bumpSchedule?.lastBumpTime
    ? vehicle.bumpSchedule.lastBumpTime
    : vehicle?.createdAt ?? new Date(0).toISOString());

const sortVehicles = (vehicles) =>
  [...(vehicles ?? [])].sort(
    (a, b) =>
      new Date(getEffectiveTimestamp(b)) -
      new Date(getEffectiveTimestamp(a))
  );

const ListedVehiclesPage = () => {
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await buyVehicleApiService.fetchAvailableVehicles();
        const sorted = sortVehicles(response.data);
        setAvailableVehicles(sorted);
        setFilteredVehicles(sorted);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load available vehicles."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const vehiclesToDisplay = useMemo(() => {
    const indexOfLast = currentPage * vehiclesPerPage;
    const indexOfFirst = indexOfLast - vehiclesPerPage;
    return filteredVehicles.slice(indexOfFirst, indexOfLast);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / vehiclesPerPage)
  );

  const handleFilterResults = (results) => {
    const sorted = sortVehicles(results);
    setFilteredVehicles(sorted);
    setCurrentPage(1);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="tw:flex tw:items-center tw:justify-center tw:min-h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw:flex tw:items-center tw:justify-center tw:min-h-[60vh]">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      <div className="tw:w-5/6 sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:flex tw:flex-row tw:gap-2 tw:items-start">
        <div className="tw:w-1/3">
          <SearchVehicleFilter
            baseVehicles={availableVehicles}
            onFilter={handleFilterResults}
          />
        </div>

        <div className="tw:w-2/3 tw:flex tw:flex-col">
          {vehiclesToDisplay.length === 0 ? (
            <div className="tw-text-gray-500 tw-text-lg tw-mt-10">
              No vehicles found.
            </div>
          ) : (
            vehiclesToDisplay.map((vehicle) => (
              <ListedVehicleCard key={vehicle._id} vehicle={vehicle} />
            ))
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="tw:mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default ListedVehiclesPage;