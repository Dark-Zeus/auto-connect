import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function ServiceCenterCard({ name, description, icon, district, rating, onView }) {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} fontSize="small" className="text-yellow-500" />);
      } else {
        stars.push(<StarBorderIcon key={i} fontSize="small" className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col w-full max-w-[320px] h-[220px] border hover:shadow-lg transition-all duration-300 justify-between">
      
      {/* Top Section: Image and Name */}
      <div className="flex justify-between items-start gap-4">
        <img
          src={icon}
          alt={name}
          className="w-30 h-30 object-cover rounded-md"
        />
        <h3 className="text-lg font-semibold text-gray-800 mt-1 pr-1">{name}</h3>
      </div>

      {/* Middle Section: Description */}
      <p className="text-sm text-gray-600 mt-4 px-1">{description}</p>

      {/* Bottom Section */}
      <div className="flex justify-between items-center mt-4 px-1 text-sm">
        <div>
          <p className="text-gray-600 font-medium">
            District: <span className="font-normal">{district}</span>
          </p>
          <button
            onClick={onView}
            className="text-blue-600 hover:underline mt-1"
          >
            View Details
          </button>
        </div>
        <div className="flex items-center gap-1">{renderStars()}</div>
      </div>
    </div>
  );
}

export default ServiceCenterCard;
