import React, { useState, useEffect } from "react";
import SavedVehicleCard from "@components/CarBuyer/SavedVehicleCard";
import SearchVehicleFilter from "@components/CarBuyer/SearchVehicleFilter";
import Pagination from "@components/CarBuyer/Pagination";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import buyVehicleAPI from "../../services/buyVehicleApiService";

const SavedVehiclesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 20;
  const [savedAds, setSavedAds] = useState([]);
  const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
    setLoading(true);
    const ads = await buyVehicleAPI.fetchSavedAds();
    setSavedAds(ads);
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = (vehicleId) => {
    setSavedAds((prev) => prev.filter((ad) => ad.vehicleId._id !== vehicleId));
  };

  const totalPages = Math.ceil(savedAds.length / vehiclesPerPage);
  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentCards = savedAds.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      {/* <MarketplaceNavigation /> */}
        <div className="tw:w-full tw:flex tw:flex-col tw:items-center">
          <div className="tw:text-xl tw:font-semibold tw:mb-10 tw:text-black tw:items-start">Saved Ads</div>
          {loading ? (
            <div>Loading...</div>
          ) : currentCards.length === 0 ? (
            <div className="tw-text-gray-500 tw-text-lg tw-mt-10">No saved ads.</div>
          ) : (
            currentCards.map((ad, idx) => (
              <SavedVehicleCard key={ad._id || idx} vehicle={ad.vehicleId} onUnsave={handleUnsave} />
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

export default SavedVehiclesPage;