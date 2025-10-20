import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Fuel, Gauge } from 'lucide-react';
import buyVehicleAPI from '../../services/buyVehicleApiService';
import { useNavigate } from 'react-router-dom'; 
import NoSimilarAds from "./NoSimilarAds";

const SimilarAds = ({ vehicle, excludeId }) => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!vehicle) return;
    setLoading(true);
    buyVehicleAPI.fetchSimilarVehicles({
      make: vehicle.make,
      model: vehicle.model,
      fuelType: vehicle.fuelType,
      year: vehicle.year,
      excludeId: excludeId || vehicle._id
    }).then((data) => {
      console.log("Fetched similar ads:", data);
      setAds(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [vehicle, excludeId]);

  const itemsPerView = 4;
  const maxIndex = Math.max(0, ads.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "";
    const priceStr = typeof price === "number" ? price.toString() : price;
    return priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <div className="tw-w-full tw-bg-gray-50 tw-py-8 tw-px-4 tw-rounded-xl tw-text-center">
        Loading similar ads...
      </div>
    );
  }

  if (!ads.length) {
    return (<NoSimilarAds />);
  }

  const handleViewDetails = async (adId) => {
    try {
      await buyVehicleAPI.incrementVehicleViews(adId);
      const response = await buyVehicleAPI.fetchVehicleById(adId);
      if (response && response.success && response.data) {
        navigate('/vehicleview', { state: { vehicle: response.data } });
      }
    } catch (error) {
      // Optionally show error toast
    }
  };

  return (
    <div className="tw:w-full tw:bg-gray-50 tw:py-8 tw:px-4 tw:rounded-xl">
      <div className="tw:max-w-7xl tw:mx-auto">
        {/* Header */}
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
          <h2 className="tw:text-2xl tw:font-bold tw:text-gray-900">Similar Ads</h2>
          <div className="tw:flex tw:gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="tw:p-2 tw:rounded-full tw:bg-white tw:hover:bg-gray-200 tw:hover:cursor-pointer tw:shadow-md tw:border tw:border-gray-200 tw:transition-all tw:duration-200 hover:tw:shadow-lg hover:tw:bg-gray-50 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              <ChevronLeft className="tw:w-5 tw:h-5 tw:text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="tw:p-2 tw:rounded-full tw:bg-white tw:hover:bg-gray-200 tw:hover:cursor-pointer tw:shadow-md tw:border tw:border-gray-200 tw:transition-all tw:duration-200 hover:tw:shadow-lg hover:tw:bg-gray-50 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              <ChevronRight className="tw:w-5 tw:h-5 tw:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="tw:relative tw:overflow-hidden">
          <div
            className="tw:flex tw:transition-transform tw:duration-500 tw:ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="tw:flex-shrink-0 tw:w-1/4 tw:px-2"
              >
                <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:overflow-hidden tw:transition-all tw:duration-300 tw:hover:shadow-xl tw:transform tw:hover:scale-102">
                  {/* Image Container */}
                  <div className="tw:relative tw:h-48 tw:bg-gray-100 tw:overflow-hidden">
                    <img 
                        src={ad.photos?.[0] || ""}
                        alt={ad.make + " " + ad.model}
                        className="tw:w-full tw:h-full tw:object-cover" 
                    />
                    
                    {/* Premium Badge 
                    <div className="tw:absolute tw:top-3 tw:right-3 tw:bg-yellow-400 tw:text-yellow-900 tw:px-2 tw:py-1 tw:rounded-full tw:text-xs tw:font-medium">
                        Premium
                    </div>*/}
                  </div>

                  {/* Content */}
                  <div className="tw:p-4">
                    <h3 className="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-2">
                      {ad.make} {ad.model}
                    </h3>
                    
                    <div className="tw:text-2xl tw:font-bold tw:text-[#4a618a] tw:mb-3">
                      {formatPrice(ad.price)}
                    </div>

                    {/* Vehicle Details */}
                    <div className="tw:space-y-2 tw:text-sm tw:text-gray-600">
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <Calendar className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        <span>{ad.year}</span>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <Fuel className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        <span>{ad.fuelType}</span>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <Gauge className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        <span>{ad.mileage} km</span>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <MapPin className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        <span>{ad.district}, {ad.city ? `, ${ad.city}` : ""}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="tw:flex tw:gap-2 tw:mt-4">
                      <button className="tw:flex-1 tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:hover:bg-[linear-gradient(135deg,var(--navy-blue),var(--sky-blue))] tw:text-white tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:font-medium tw:transition-colors hover:tw:bg-blue-700 tw:hover:cursor-pointer"
                        onClick={() => handleViewDetails(ad._id)}>
                        View Details
                      </button> {/* 
                      <button className="tw:flex-1 tw:bg-gray-100 tw:hover:bg-gray-400 tw:text-gray-700 tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:font-medium tw:transition-colors hover:tw:bg-gray-200 tw:hover:cursor-pointer">
                        Contact
                      </button>*/}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="tw:flex tw:justify-center tw:mt-6 tw:gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`tw:w-2 tw:h-2 tw:rounded-full tw:transition-all tw:duration-200 ${
                index === currentIndex 
                  ? 'tw:bg-[#001c6c] tw:w-6' 
                  : 'tw:bg-gray-300 hover:tw:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarAds;