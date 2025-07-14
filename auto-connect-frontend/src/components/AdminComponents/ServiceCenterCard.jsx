import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function ServiceCenterCard({ name, description, icon, district, rating, onView }) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon
            key={i}
            fontSize="small"
            className="tw:text-yellow-500"
          />
        );
      } else {
        stars.push(
          <StarBorderIcon
            key={i}
            fontSize="small"
            className="tw:text-yellow-500"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="tw:w-full tw:max-w-[300px] tw:h-[220px] tw:bg-white tw:border tw:border-gray-300 tw:rounded-2xl tw:shadow-md tw:transition-all tw:duration-300 hover:tw:shadow-lg tw:p-4 tw:flex tw:flex-col tw:justify-between">
      
      {/* Top Section: Image and Name */}
      <div className="tw:flex tw:justify-between tw:items-start tw:gap-4">
        <img
          src={icon}
          alt={name}
          className="tw:w-30 tw:h-30 tw:object-cover tw:rounded-md"
        />
        <h3 className="tw:text-lg tw:font-semibold tw:!text-blue-800 tw:mt-1 tw:pr-1">{name}</h3>
      </div>

      {/* Middle Section: Description */}
      <p className="tw:text-sm tw:text-gray-700 tw:mt-4 tw:px-1">{description}</p>

      {/* Bottom Section */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mt-4 tw:px-1 tw:text-sm">
        <div>
          <p className="tw:text-blue-800 tw:font-medium">
            District: <span className="tw:font-normal tw:text-gray-900">{district}</span>
          </p>
        <button
          onClick={() => onView({ name, description, icon, district, rating })}
          className="tw:text-blue-600 tw:hover:underline tw:mt-1"
        >
          View Details
        </button>
        </div>
        <div className="tw:flex tw:items-center tw:gap-1">{renderStars()}</div>
      </div>
    </div>
  );
}

export default ServiceCenterCard;
