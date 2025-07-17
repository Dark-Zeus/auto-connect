import React, { useState } from "react";
import ListedVehicleCard from "@components/CarBuyer/ListedVehicleCard";
import SearchVehicleFilter from "@components/CarBuyer/SearchVehicleFilter";
import Pagination from "@components/CarBuyer/Pagination"; // your pagination component
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import lc150_1 from '../assets/images/lc150_1.jpg';
import vezel from '../assets/images/cars/vezel.jpeg';
import corolla from '../assets/images/cars/corolla141.jpeg';
import chr from '../assets/images/cars/chr.jpg';
import yaris from '../assets/images/cars/yaris.jpg';
import mira from '../assets/images/cars/mira.jpg';
import axio from '../assets/images/cars/axio.jpg';
import navara from '../assets/images/cars/navara.jpg';
import hilux from '../assets/images/cars/hilux.jpg';
import aqua from '../assets/images/cars/aqua.jpg';

const ListedVehiclesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 20;

  const vehiclesData = [
    {
      id: 1,
      manufacturer: 'Toyota',
      model: 'Land Cruiser 150',
      year: 2015,
      price: 32000000,
      odometer: 135000,
      fuelType: 'Diesel',
      image: lc150_1,
      postedDate: '2025-07-13',
      district: 'Gampaha',
      city: 'Katana'
    },
    {
      id: 2,
      manufacturer: 'Honda',
      model: 'Vezel',
      year: 2018,
      price: 12500000,
      odometer: 65000,
      fuelType: 'Hybrid',
      image: vezel,
      postedDate: '2025-07-12',
      district: 'Colombo',
      city: 'Dehiwala'
    },
    {
      id: 3,
      manufacturer: 'Toyota',
      model: 'Corolla 141',
      year: 2008,
      price: 6800000,
      odometer: 142000,
      fuelType: 'Petrol',
      image: corolla,
      postedDate: '2025-07-12',
      district: 'Kandy',
      city: 'Peradeniya'
    },
    {
      id: 4,
      manufacturer: 'Toyota',
      model: 'CHR',
      year: 2021,
      price: 14500000,
      odometer: 58000,
      fuelType: 'Hybrid',
      image: chr,
      postedDate: '2025-07-11',
      district: 'Colombo',
      city: 'Mount Lavinia'
    },
    {
      id: 5,
      manufacturer: 'Toyota',
      model: 'Yaris',
      year: 2023,
      price: 9950000,
      odometer: 78000,
      fuelType: 'Petrol',
      image: yaris,
      postedDate: '2025-07-11',
      district: 'Kurunegala',
      city: 'Kurunegala'
    },
    {
      id: 6,
      manufacturer: 'Daihatsu',
      model: 'Mira',
      year: 2025,
      price: 7200000,
      odometer: 45000,
      fuelType: 'Petrol',
      image: mira,
      postedDate: '2025-07-10',
      district: 'Galle',
      city: 'Unawatuna'
    },
    {
      id: 7,
      manufacturer: 'Toyota',
      model: 'Axio',
      year: 2014,
      price: 10500000,
      odometer: 92000,
      fuelType: 'Hybrid',
      image: axio,
      postedDate: '2025-07-10',
      district: 'Matara',
      city: 'Matara'
    },
    {
      id: 8,
      manufacturer: 'Nissan',
      model: 'Navara',
      year: 2008,
      price: 6800000,
      odometer: 110000,
      fuelType: 'Diesel',
      image: navara,
      postedDate: '2025-07-10',
      district: 'Anuradhapura',
      city: 'Anuradhapura'
    },
    {
      id: 9,
      manufacturer: 'Toyota',
      model: 'Hilux',
      year: 2019,
      price: 21500000,
      odometer: 85000,
      fuelType: 'Diesel',
      image: hilux,
      postedDate: '2025-07-08',
      district: 'Jaffna',
      city: 'Jaffna'
    },
    {
      id: 10,
      manufacturer: 'Toyota',
      model: 'Aqua',
      year: 2015,
      price: 8900000,
      odometer: 62000,
      fuelType: 'Hybrid',
      image: aqua,
      postedDate: '2025-07-08',
      district: 'Batticaloa',
      city: 'Batticaloa'
    }
  ];

  // Create hardcoded card components as an array
  //const allCards = Array(55).fill().map((_, index) => (
    //<ListedVehicleCard key={index} />
  //));

  const totalPages = Math.ceil(vehiclesData.length / vehiclesPerPage);
  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentVehicles = vehiclesData.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      <MarketplaceNavigation />
      <div className="tw:w-5/6 sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:flex tw:flex-row tw:gap-2 tw:items-start">
        {/* Sidebar Filter */}
        <div className="tw:w-1/3">
          <SearchVehicleFilter />
        </div>

        {/* Cards + Pagination */}
        <div className="tw:w-2/3 tw:flex tw:flex-col">
          {currentVehicles.map((vehicle) => (
            <ListedVehicleCard key={vehicle.id} vehicle={vehicle} />
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