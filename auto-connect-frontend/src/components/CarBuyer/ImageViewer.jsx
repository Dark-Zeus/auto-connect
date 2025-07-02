import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import lc150_1 from '../../assets/images/lc150_1.jpg';
import lc150_2 from '../../assets/images/lc150_2.jpg';
import lc150_3 from '../../assets/images/lc150_3.jpg';
import lc150_4 from '../../assets/images/lc150_4.jpg';
import lc150_5 from '../../assets/images/lc150_5.jpg';
import lc150_6 from '../../assets/images/lc150_6.jpg';

const ImageViewer = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const vehicleData = vehicle || {
    name: 'lomitha',
    mobile: '0767120123',
    district: 'Matara',
    city: 'Matara',
    email: 'lomitha@example.com',
    vehicleType: 'Car',
    condition: 'Used',
    make: 'Toyota',
    model: 'Tercel',
    year: '1998',
    registeredYear: '1998',
    price: '2565000',
    ongoingLease: false,
    transmission: 'Manual',
    fuelType: 'Petrol',
    engineCapacity: '1500',
    mileage: '272000',
    description: 'A well-maintained car with good fuel efficiency.',
    images: [ lc150_1,
    lc150_2,
    lc150_3,
    lc150_4,
    lc150_5,
    lc150_6],
    views: '2164'
  };

  // Default image if none provided
  const defaultImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop';
  
  const imageList = vehicleData.images && vehicleData.images.length > 0 ? vehicleData.images : [defaultImage];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  if (imageList.length === 0) {
    return (
      <div className="tw:w-full tw:max-w-4xl tw:mx-auto tw:p-4">
        <div className="tw:bg-gray-100 tw:rounded-2xl tw:p-8 tw:text-center">
          <p className="tw:text-gray-500">No images to display</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tw:w-full tw:max-w-4xl tw:mx-auto tw:p-4">
        <div className="tw:relative tw:bg-gradient-to-br tw:from-white tw:to-gray-200 tw:rounded-2xl tw:overflow-hidden tw:shadow-2xl">
          
          {/* Main Image Container */}
          <div className="tw:relative tw:overflow-hidden tw:aspect-video">
            
            {/* Background decorative elements */}
            <div className="tw:absolute tw:inset-0 tw:opacity-10">
              <div className="tw:absolute tw:top-0 tw:right-0 tw:w-32 tw:h-32 tw:bg-white tw:rounded-full tw:-translate-y-16 tw:translate-x-16"></div>
              <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-24 tw:h-24 tw:bg-white tw:rounded-full tw:translate-y-12 tw:-translate-x-12"></div>
            </div>

            {/* Main Image */}
            <div className="tw:relative tw:h-full tw:flex tw:items-center tw:justify-center tw:p-4">
              <img
                src={imageList[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="tw:max-w-full tw:max-h-full tw:object-contain tw:rounded-lg tw:shadow-xl tw:transition-transform tw:duration-300 tw:cursor-pointer"
                onClick={openFullscreen}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600/6366f1/ffffff?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Navigation Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:bg-white tw:bg-opacity-20 tw:backdrop-blur-sm tw:rounded-full tw:p-3 tw:text-white hover:tw:bg-opacity-30 tw:transition-all tw:duration-200 tw:border tw:border-white tw:border-opacity-20 hover:tw:scale-110"
                >
                  <ChevronLeft className="tw:w-6 tw:h-6 tw:text-black" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:bg-white tw:bg-opacity-20 tw:backdrop-blur-sm tw:rounded-full tw:p-3 tw:text-white hover:tw:bg-opacity-30 tw:transition-all tw:duration-200 tw:border tw:border-white tw:border-opacity-20 hover:tw:scale-110"
                >
                  <ChevronRight className="tw:w-6 tw:h-6 tw:text-black" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {imageList.length > 1 && (
              <div className="tw:absolute tw:bottom-4 tw:left-1/2 tw:-translate-x-1/2 tw:bg-white tw:bg-opacity-20 tw:backdrop-blur-sm tw:rounded-full tw:px-4 tw:py-2 tw:text-black tw:text-sm tw:font-medium tw:border tw:border-white tw:border-opacity-20">
                {currentIndex + 1} / {imageList.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {imageList.length > 1 && (
            <div className="tw:p-4 tw:bg-white tw:bg-opacity-10 tw:backdrop-blur-sm">
              <div className="tw:flex tw:gap-2 tw:overflow-x-auto tw:pb-2">
                {imageList.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`tw:flex-shrink-0 tw:w-16 tw:h-16 tw:rounded-lg tw:overflow-hidden tw:border-2 tw:transition-all tw:duration-200 ${
                      index === currentIndex
                        ? 'tw:border-white tw:scale-110 tw:shadow-lg'
                        : 'tw:border-white tw:border-opacity-30 hover:tw:border-opacity-60 hover:tw:scale-105'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="tw:w-full tw:h-full tw:object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64x64/6366f1/ffffff?text=' + (index + 1);
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Info Bar */}
          <div className="tw:p-3 tw:bg-white tw:bg-opacity-5 tw:backdrop-blur-sm tw:flex tw:justify-between tw:items-center tw:text-white tw:text-sm">
            <div className="tw:flex tw:items-center tw:gap-2">
              <div className="tw:w-2 tw:h-2 tw:bg-white tw:rounded-full tw:opacity-60"></div>
              <span className="tw:opacity-80">Vehicle Images</span>
            </div>
            
            <div className="tw:flex tw:items-center tw:gap-4 tw:text-xs tw:opacity-70">
              <span>Click image to view fullscreen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:bg-black tw:bg-opacity-95 tw:flex tw:items-center tw:justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="tw:absolute tw:top-6 tw:right-6 tw:z-10 tw:bg-black tw:bg-opacity-50 tw:backdrop-blur-sm tw:rounded-full tw:p-3 tw:text-white hover:tw:bg-opacity-70 tw:transition-all tw:duration-200"
          >
            <X className="tw:w-6 tw:h-6" />
          </button>

          {/* Previous Button */}
          {imageList.length > 1 && (
            <button
              onClick={prevImage}
              className="tw:absolute tw:left-6 tw:top-1/2 tw:-translate-y-1/2 tw:z-10 tw:bg-black tw:bg-opacity-50 tw:backdrop-blur-sm tw:rounded-full tw:p-4 tw:text-white hover:tw:bg-opacity-70 tw:transition-all tw:duration-200 hover:tw:scale-110"
            >
              <ChevronLeft className="tw:w-8 tw:h-8" />
            </button>
          )}

          {/* Next Button */}
          {imageList.length > 1 && (
            <button
              onClick={nextImage}
              className="tw:absolute tw:right-6 tw:top-1/2 tw:-translate-y-1/2 tw:z-10 tw:bg-black tw:bg-opacity-50 tw:backdrop-blur-sm tw:rounded-full tw:p-4 tw:text-white hover:tw:bg-opacity-70 tw:transition-all tw:duration-200 hover:tw:scale-110"
            >
              <ChevronRight className="tw:w-8 tw:h-8" />
            </button>
          )}

          {/* Fullscreen Image */}
          <div className="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:p-8">
            <img
              src={imageList[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="tw:max-w-full tw:max-h-full tw:object-contain tw:shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x800/6366f1/ffffff?text=Image+Not+Found';
              }}
            />
          </div>

          {/* Image Counter */}
          {imageList.length > 1 && (
            <div className="tw:absolute tw:bottom-8 tw:left-1/2 tw:-translate-x-1/2 tw:bg-black tw:bg-opacity-50 tw:backdrop-blur-sm tw:rounded-full tw:px-6 tw:py-3 tw:text-white tw:text-lg tw:font-medium">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageViewer;