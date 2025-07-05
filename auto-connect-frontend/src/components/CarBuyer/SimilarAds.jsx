import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Fuel, Gauge } from 'lucide-react';
import vehicleImage from '../../assets/images/toyota-v8.jpg';

const SimilarAds = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ads = [
    {
      id: 1,
      title: "Honda Vezel",
      price: "LKR 14,800,000",
      image: vehicleImage,
      year: "2023",
      fuel: "Hybrid",
      mileage: "15,000 km",
      location: "Colombo"
    },
    {
      id: 2,
      title: "Honda Vezel",
      price: "LKR 21,500,000",
      image: vehicleImage,
      year: "2024",
      fuel: "Hybrid",
      mileage: "8,500 km",
      location: "Kandy"
    },
    {
      id: 3,
      title: "Honda Vezel",
      price: "LKR 11,600,000",
      image: vehicleImage,
      year: "2022",
      fuel: "Hybrid",
      mileage: "25,000 km",
      location: "Galle"
    },
    {
      id: 4,
      title: "Honda Vezel",
      price: "LKR 18,200,000",
      image: vehicleImage,
      year: "2023",
      fuel: "Hybrid",
      mileage: "12,000 km",
      location: "Negombo"
    },
    {
      id: 5,
      title: "Honda Vezel",
      price: "LKR 16,500,000",
      image: vehicleImage,
      year: "2023",
      fuel: "Hybrid",
      mileage: "18,000 km",
      location: "Matara"
    },
    {
      id: 6,
      title: "Honda Vezel",
      price: "LKR 20,000,000",
      image: vehicleImage,
      year: "2024",
      fuel: "Hybrid",
      mileage: "5,000 km",
      location: "Jaffna"
    },
    {
      id: 7,
      title: "Honda Vezel",
      price: "LKR 15,300,000",
      image: vehicleImage,
      year: "2023",
      fuel: "Hybrid",
      mileage: "20,000 km",
      location: "Anuradhapura"
    },
    {
      id: 8,
      title: "Honda Vezel",
      price: "LKR 19,800,000",
      image: vehicleImage,
      year: "2024",
      fuel: "Hybrid",
      mileage: "10,000 km",
      location: "Batticaloa"
    }
  ];

  const itemsPerView = 4;
  const maxIndex = Math.max(0, ads.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const formatPrice = (price) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="tw:w-full tw:bg-gray-50 tw:py-8 tw:px-4">
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
                key={ad.id}
                className="tw:flex-shrink-0 tw:w-1/4 tw:px-2 tw:hover:cursor-pointer"
              >
                <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:overflow-hidden tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:transform hover:tw:scale-105">
                  {/* Image Container */}
                  <div className="tw:relative tw:h-48 tw:bg-gray-100 tw:overflow-hidden">
                    <img 
                        src={ad.image} 
                        alt={ad.title} 
                        className="tw:w-full tw:h-full tw:object-cover" 
                    />
                    
                    {/* Premium Badge */}
                    <div className="tw:absolute tw:top-3 tw:right-3 tw:bg-yellow-400 tw:text-yellow-900 tw:px-2 tw:py-1 tw:rounded-full tw:text-xs tw:font-medium">
                        Premium
                    </div>
                  </div>

                  {/* Content */}
                  <div className="tw:p-4">
                    <h3 className="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-2">
                      {ad.title}
                    </h3>
                    
                    <div className="tw:text-2xl tw:font-bold tw:text-blue-600 tw:mb-3">
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
                        <span>{ad.fuel}</span>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <Gauge className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        <span>{ad.mileage}</span>
                      </div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <MapPin className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        <span>{ad.location}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="tw:flex tw:gap-2 tw:mt-4">
                      <button className="tw:flex-1 tw:bg-blue-600 tw:hover:bg-blue-900 tw:text-white tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:font-medium tw:transition-colors hover:tw:bg-blue-700 tw:hover:cursor-pointer">
                        View Details
                      </button>
                      <button className="tw:flex-1 tw:bg-gray-100 tw:hover:bg-gray-400 tw:text-gray-700 tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:font-medium tw:transition-colors hover:tw:bg-gray-200 tw:hover:cursor-pointer">
                        Contact
                      </button>
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
                  ? 'tw:bg-blue-600 tw:w-6' 
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