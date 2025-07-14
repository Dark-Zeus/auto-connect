import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Fuel, Gauge } from 'lucide-react';
import vehicleImage from '../../assets/images/toyota-v8.jpg';
import tlc150_1 from '../../assets/images/lc150Photos/tlc150_1.jpg';
import tlc150_2 from '../../assets/images/lc150Photos/tlc150_2.jpg';
import tlc150_3 from '../../assets/images/lc150Photos/tlc150_3.jpg';
import tlc150_4 from '../../assets/images/lc150Photos/tlc150_4.jpg';
import tlc150_5 from '../../assets/images/lc150Photos/tlc150_5.jpg';
import tlc150_6 from '../../assets/images/lc150Photos/tlc150_6.jpg';
import tlc150_7 from '../../assets/images/lc150Photos/tlc150_7.jpg';

const SimilarAds = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ads = [
    {
      id: 1,
      title: "Toyota Land Cruiser 150",
      price: "LKR 34,800,000",
      image: vehicleImage,
      year: "2014",
      fuel: "Diesel",
      mileage: "115,000 km",
      location: "Colombo"
    },
    {
      id: 2,
      title: "Toyota Land Cruiser 150",
      price: "LKR 31,500,000",
      image: tlc150_1,
      year: "2014",
      fuel: "Diesel",
      mileage: "118,500 km",
      location: "Kandy"
    },
    {
      id: 3,
      title: "Toyota Land Cruiser 150",
      price: "LKR 31,600,000",
      image: tlc150_2,
      year: "2014",
      fuel: "Diesel",
      mileage: "125,000 km",
      location: "Galle"
    },
    {
      id: 4,
      title: "Toyota Land Cruiser 150",
      price: "LKR 33,200,000",
      image: tlc150_3,
      year: "2015",
      fuel: "Diesel",
      mileage: "112,000 km",
      location: "Kaluthara"
    },
    {
      id: 5,
      title: "Toyota Land Cruiser 150",
      price: "LKR 36,500,000",
      image: tlc150_6,
      year: "2015",
      fuel: "Diesel",
      mileage: "138,000 km",
      location: "Matara"
    },
    {
      id: 6,
      title: "Toyota Land Cruiser 150",
      price: "LKR 31,000,000",
      image: tlc150_5,
      year: "2014",
      fuel: "Diesel",
      mileage: "135,000 km",
      location: "Jaffna"
    },
    {
      id: 7,
      title: "Toyota Land Cruiser 150",
      price: "LKR 30,500,000",
      image: tlc150_4,
      year: "2013",
      fuel: "Diesel",
      mileage: "120,000 km",
      location: "Anuradhapura"
    },
    {
      id: 8,
      title: "Toyota Land Cruiser 150",
      price: "LKR 29,850,000",
      image: tlc150_7,
      year: "2014",
      fuel: "Diesel",
      mileage: "165,000 km",
      location: "Badulla"
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
                key={ad.id}
                className="tw:flex-shrink-0 tw:w-1/4 tw:px-2"
              >
                <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:overflow-hidden tw:transition-all tw:duration-300 tw:hover:shadow-xl tw:transform tw:hover:scale-102">
                  {/* Image Container */}
                  <div className="tw:relative tw:h-48 tw:bg-gray-100 tw:overflow-hidden">
                    <img 
                        src={ad.image} 
                        alt={ad.title} 
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