import React, { useState, useEffect } from "react";
import MyVehicleCard from "@components/CarSeller/MyVehicleCard";
import Pagination from "@components/CarBuyer/Pagination";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import listVehicleAPI from '../../services/listVehicleApiService';

const MyAdsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create hardcoded card components as an array
  // const allCards = Array(1).fill().map((_, index) => (
  //   <MyVehicleCard key={index} />
  // ));

  useEffect(() => {
    const fetchMyAds = async () => {
      setLoading(true);
      try {
        const res = await listVehicleAPI.getMyListings();
        setVehicles(res.data || []);
      } catch (e) {
        setVehicles([]);
      }
      setLoading(false);
    };
    fetchMyAds();
  }, []);

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentCards = vehicles.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      {/* <MarketplaceNavigation /> */}
        <div className="tw:w-full tw:flex tw:flex-col tw:items-center">
          <div className="tw:text-xl tw:font-semibold tw:mb-10 tw:text-black tw:items-start">My Ads</div>
          
          {loading ? (
            <div>Loading...</div>
          ) : currentCards.length === 0 ? (
            <div>No ads found.</div>
          ) : (
            currentCards.map((vehicle) => (
              <MyVehicleCard key={vehicle._id} vehicle={vehicle} />
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
  );
};

export default MyAdsPage;