import React, { useState, useEffect } from "react";
import ListedVehicleCard from "@components/CarBuyer/ListedVehicleCard";
import SearchVehicleFilter from "@components/CarBuyer/SearchVehicleFilter";
import Pagination from "@components/CarBuyer/Pagination"; // your pagination component
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import lc150_1 from '@assets/images/lc150_1.jpg';
import vezel from '@assets/images/cars/vezel.jpeg';
import corolla from '@assets/images/cars/corolla141.jpeg';
import chr from '@assets/images/cars/chr.jpg';
import yaris from '@assets/images/cars/yaris.jpg';
import mira from '@assets/images/cars/mira.jpg';
import axio from '@assets/images/cars/axio.jpg';
import navara from '@assets/images/cars/navara.jpg';
import hilux from '@assets/images/cars/hilux.jpg';
import aqua from '@assets/images/cars/aqua.jpg';
import { CircularProgress } from "@mui/material";
import buyVehicleApiService from "../../services/buyVehicleApiService";
import { current } from "@reduxjs/toolkit";

const ListedVehiclesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 20;
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const vehicles = await buyVehicleApiService.fetchAvailableVehicles();
        setAvailableVehicles(vehicles.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableVehicles();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Create hardcoded card components as an array
  //const allCards = Array(55).fill().map((_, index) => (
    //<ListedVehicleCard key={index} />
  //));

  const totalPages = Math.ceil(availableVehicles.length / vehiclesPerPage);
  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentVehicles = availableVehicles.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      {/* <MarketplaceNavigation /> */}
      <div className="tw:w-5/6 sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:flex tw:flex-row tw:gap-2 tw:items-start">
        {/* Sidebar Filter */}
        <div className="tw:w-1/3">
          <SearchVehicleFilter />
        </div>

        {/* Cards + Pagination */}
        <div className="tw:w-2/3 tw:flex tw:flex-col">
          {currentVehicles.map((vehicle) => (
            <ListedVehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}

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