import React, { useState } from "react";
import { Star, MapPin, Eye, Phone, Globe, Calendar, BadgeCheck, X } from "lucide-react";

function InsuranceCompanyCard({ company, onView }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Render stars (support half-stars if needed)
  const renderStars = () => {
    const stars = [];
    const rating = company.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} className="tw:text-yellow-400 tw:fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="tw:relative tw:inline-block">
            <Star size={16} className="tw:text-gray-300 tw:fill-current" />
            <div className="tw:absolute tw:top-0 tw:left-0 tw:w-1/2 tw:overflow-hidden">
              <Star size={16} className="tw:text-yellow-400 tw:fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} size={16} className="tw:text-gray-300 tw:fill-current" />
        );
      }
    }
    return stars;
  };

  const handleImageError = () => setImageError(true);

  const handleCardClick = () => {
    if (onView) {
      onView(company);
    }
  };

  return (
    <div
      className="tw:w-full tw:max-w-[340px] tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:shadow-lg tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:scale-[1.02] tw:p-6 tw:flex tw:flex-col tw:justify-between tw:relative tw:cursor-pointer tw:group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Verified Badge */}
      {company.isVerified && (
        <div className="tw:absolute tw:top-4 tw:right-4 tw:bg-green-500 tw:text-white tw:px-2 tw:py-1 tw:rounded-full tw:text-xs tw:font-semibold tw:flex tw:items-center tw:gap-1 tw:shadow-md">
          <BadgeCheck size={12} />
          Verified
        </div>
      )}

      {/* Category Badge */}
      <div className="tw:absolute tw:top-4 tw:left-4 tw:bg-blue-100 tw:text-blue-700 tw:px-2 tw:py-1 tw:rounded-full tw:text-xs tw:font-semibold">
        Insurance
      </div>

      {/* Top Section */}
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-4">
        <div className="tw:relative tw:flex-shrink-0">
          {!imageError ? (
            <img
              src={company.image}
              alt={company.name}
              onError={handleImageError}
              className="tw:w-16 tw:h-16 tw:rounded-xl tw:object-cover tw:shadow-md tw:border tw:border-gray-100 tw:transition-transform tw:duration-300 group-hover:tw:scale-110"
            />
          ) : (
            <div className="tw:w-16 tw:h-16 tw:rounded-xl tw:bg-gradient-to-br tw:from-blue-100 tw:to-indigo-200 tw:shadow-md tw:border tw:border-gray-100 tw:flex tw:items-center tw:justify-center">
              <span className="tw:text-blue-600 tw:font-bold tw:text-lg">
                {company.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className={`tw:absolute tw:inset-0 tw:bg-black tw:bg-opacity-20 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:transition-opacity tw:duration-300 ${
            isHovered ? 'tw:opacity-100' : 'tw:opacity-0'
          }`}>
            <Eye className="tw:text-white" size={20} />
          </div>
        </div>

        <div className="tw:flex-1">
          <h3 className="tw:text-lg tw:font-bold tw:text-gray-800 tw:leading-tight tw:mb-1 group-hover:tw:text-blue-600 tw:transition-colors">
            {company.name}
          </h3>
          <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
            <div className="tw:flex tw:items-center tw:gap-1">
              {renderStars()}
            </div>
            <span className="tw:text-sm tw:text-gray-600 tw:font-medium">
              {company.rating ? company.rating.toFixed(1) : "0.0"}
            </span>
          </div>
          <div className="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-gray-600">
            <MapPin size={14} className="tw:text-gray-400" />
            <span>{company.address}</span>
          </div>
        </div>
      </div>

      <p className="tw:text-sm tw:text-gray-700 tw:mb-4 tw:leading-relaxed tw:line-clamp-2 tw:min-h-[2.5rem]">
        {company.description}
      </p>

      <div className="tw:space-y-2 tw:mb-4">
        {company.phone && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
            <Phone size={14} className="tw:text-gray-400" />
            <span className="tw:font-medium">{company.phone}</span>
          </div>
        )}
        {company.website && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
            <Globe size={14} className="tw:text-gray-400" />
            <span className="tw:font-medium">{company.website}</span>
          </div>
        )}
        {company.establishedDate && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
            <Calendar size={14} className="tw:text-gray-400" />
            <span>Since {company.establishedDate}</span>
          </div>
        )}
        {company.licenseNumber && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
            <BadgeCheck size={14} className="tw:text-gray-400" />
            <span>License: {company.licenseNumber}</span>
          </div>
        )}
      </div>

      <div className="tw:mt-auto">
        <button
          onClick={e => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="tw:w-full tw:text-sm tw:text-white tw:bg-gradient-to-r tw:from-blue-600 tw:to-indigo-600 tw:px-4 tw:py-2.5 tw:rounded-xl hover:tw:from-blue-700 hover:tw:to-indigo-700 tw:transition-all tw:duration-300 tw:font-semibold tw:shadow-md hover:tw:shadow-lg tw:flex tw:items-center tw:justify-center tw:gap-2 group-hover:tw:scale-105"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>

      <div className={`tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-blue-600/5 tw:to-transparent tw:rounded-2xl tw:pointer-events-none tw:transition-opacity tw:duration-300 ${isHovered ? 'tw:opacity-100' : 'tw:opacity-0'}`} />
    </div>
  );
}

export default InsuranceCompanyCard;
