// src/components/ServiceProvider/ServiceCard.jsx (Final with Atomic Components)
import React, { useState } from "react";
import {
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Users,
} from "lucide-react";

// Import atomic components
import StatusBadge, { StatusToggle } from "@components/atoms/StatusBadge";

const ServiceCard = ({
  service,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  className = "",
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isActive = service.status === "active" || service.isActive;

  // Calculate average price
  const avgPrice =
    service.avgPrice || Math.round((service.minPrice + service.maxPrice) / 2);

  // Generate a placeholder color based on service type
  const getPlaceholderColor = () => {
    const colors = [
      "tw:bg-gradient-to-br tw:from-blue-500 tw:to-blue-600",
      "tw:bg-gradient-to-br tw:from-green-500 tw:to-green-600",
      "tw:bg-gradient-to-br tw:from-purple-500 tw:to-purple-600",
      "tw:bg-gradient-to-br tw:from-orange-500 tw:to-orange-600",
      "tw:bg-gradient-to-br tw:from-pink-500 tw:to-pink-600",
      "tw:bg-gradient-to-br tw:from-indigo-500 tw:to-indigo-600",
    ];
    const index = service.serviceType?.length % colors.length || 0;
    return colors[index];
  };

  const handleStatusToggle = (newStatus) => {
    if (onToggleStatus) {
      onToggleStatus(service._id, newStatus);
    }
  };

  return (
    <div
      className={`tw:bg-white tw:rounded-xl tw:shadow-md tw:hover:shadow-xl tw:transition-all tw:duration-300 tw:border tw:border-gray-200 tw:overflow-hidden tw:group tw:relative ${className}`}
    >
      {/* Card Header with Image/Icon */}
      <div className="tw:relative tw:h-40 tw:bg-gradient-to-br tw:from-gray-100 tw:to-gray-200">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.serviceType}
            className={`tw:w-full tw:h-full tw:object-cover tw:transition-opacity tw:duration-300 ${
              isImageLoaded ? "tw:opacity-100" : "tw:opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        ) : (
          <div
            className={`tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center ${getPlaceholderColor()}`}
          >
            <div className="tw:text-white tw:text-3xl tw:font-bold tw:drop-shadow-lg">
              {service.serviceType?.charAt(0) || "S"}
            </div>
          </div>
        )}

        {/* Status Badge using atomic component */}
        <div className="tw:absolute tw:top-3 tw:left-3">
          <StatusBadge
            status={isActive ? "active" : "inactive"}
            size="sm"
            variant="solid"
            animated={isActive}
          />
        </div>

        {/* Action Menu */}
        <div className="tw:absolute tw:top-3 tw:right-3">
          <div className="tw:relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="tw:bg-white tw:bg-opacity-90 tw:hover:tw:bg-opacity-100 tw:p-2 tw:rounded-full tw:shadow-md tw:transition-all tw:backdrop-blur-sm"
            >
              <MoreVertical className="tw:h-4 tw:w-4 tw:text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="tw:absolute tw:right-0 tw:mt-2 tw:w-44 tw:bg-white tw:rounded-lg tw:shadow-xl tw:border tw:border-gray-200 tw:z-20 tw:py-2">
                {onView && (
                  <button
                    onClick={() => {
                      onView(service._id);
                      setShowMenu(false);
                    }}
                    className="tw:w-full tw:text-left tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700 tw:hover:tw:bg-gray-50 tw:flex tw:items-center tw:space-x-3 tw:transition-colors"
                  >
                    <Eye className="tw:h-4 tw:w-4 tw:text-gray-500" />
                    <span>View Details</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onEdit(service._id);
                    setShowMenu(false);
                  }}
                  className="tw:w-full tw:text-left tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700 tw:hover:tw:bg-gray-50 tw:flex tw:items-center tw:space-x-3 tw:transition-colors"
                >
                  <Edit className="tw:h-4 tw:w-4 tw:text-blue-500" />
                  <span>Edit Service</span>
                </button>

                <button
                  onClick={() => {
                    handleStatusToggle(isActive ? "inactive" : "active");
                    setShowMenu(false);
                  }}
                  className="tw:w-full tw:text-left tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700 tw:hover:tw:bg-gray-50 tw:flex tw:items-center tw:space-x-3 tw:transition-colors"
                >
                  <div
                    className={`tw:h-4 tw:w-4 tw:rounded-full ${
                      isActive ? "tw:bg-orange-500" : "tw:bg-green-500"
                    }`}
                  ></div>
                  <span>{isActive ? "Deactivate" : "Activate"}</span>
                </button>

                <hr className="tw:my-2 tw:border-gray-100" />

                <button
                  onClick={() => {
                    onDelete(service._id);
                    setShowMenu(false);
                  }}
                  className="tw:w-full tw:text-left tw:px-4 tw:py-2 tw:text-sm tw:text-red-600 tw:hover:tw:bg-red-50 tw:flex tw:items-center tw:space-x-3 tw:transition-colors"
                >
                  <Trash2 className="tw:h-4 tw:w-4" />
                  <span>Delete Service</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Special Badges */}
        <div className="tw:absolute tw:bottom-3 tw:left-3 tw:flex tw:space-x-2">
          {service.tags && service.tags.length > 0 && (
            <StatusBadge
              status="featured"
              customText={service.tags[0]}
              size="xs"
              variant="solid"
            />
          )}
          {service.isPremium && (
            <StatusBadge status="premium" size="xs" variant="solid" />
          )}
          {service.isVerified && (
            <StatusBadge status="verified" size="xs" variant="solid" />
          )}
        </div>

        {/* Premium Corner Badge */}
        {service.isPremium && (
          <div className="tw:absolute tw:top-0 tw:right-0">
            <div className="tw:bg-gradient-to-bl tw:from-yellow-400 tw:to-orange-500 tw:text-white tw:p-2 tw:rounded-bl-lg tw:shadow-md">
              <Award className="tw:h-4 tw:w-4" />
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="tw:p-5">
        {/* Service Title and Category */}
        <div className="tw:mb-4">
          <h3 className="tw:text-lg tw:font-bold tw:text-gray-900 tw:mb-2 tw:line-clamp-1">
            {service.serviceType}
          </h3>
          <div className="tw:flex tw:items-center tw:justify-between">
            <span className="tw:text-sm tw:text-gray-600 tw:bg-gray-100 tw:px-3 tw:py-1 tw:rounded-full tw:font-medium">
              {service.category}
            </span>
            {/* Status Toggle using atomic component */}
            <StatusToggle
              currentStatus={isActive ? "active" : "inactive"}
              statuses={["active", "inactive"]}
              onChange={handleStatusToggle}
              size="xs"
            />
          </div>
        </div>

        {/* Description */}
        <p className="tw:text-sm tw:text-gray-600 tw:mb-4 tw:line-clamp-2 tw:leading-relaxed">
          {service.description}
        </p>

        {/* Key Metrics Grid */}
        <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:mb-4">
          {/* Pricing */}
          <div className="tw:bg-gradient-to-br tw:from-green-50 tw:to-emerald-50 tw:p-3 tw:rounded-lg tw:border tw:border-green-100">
            <div className="tw:flex tw:items-center tw:space-x-2 tw:mb-1">
              <DollarSign className="tw:h-4 tw:w-4 tw:text-green-600" />
              <span className="tw:text-xs tw:text-green-700 tw:font-semibold">
                Price Range
              </span>
            </div>
            <div className="tw:text-sm tw:font-bold tw:text-gray-900 tw:mb-1">
              Rs. {service.minPrice?.toLocaleString()} -{" "}
              {service.maxPrice?.toLocaleString()}
            </div>
            <div className="tw:text-xs tw:text-green-600 tw:font-medium">
              Avg: Rs. {avgPrice.toLocaleString()}
            </div>
          </div>

          {/* Duration */}
          <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-cyan-50 tw:p-3 tw:rounded-lg tw:border tw:border-blue-100">
            <div className="tw:flex tw:items-center tw:space-x-2 tw:mb-1">
              <Clock className="tw:h-4 tw:w-4 tw:text-blue-600" />
              <span className="tw:text-xs tw:text-blue-700 tw:font-semibold">
                Duration
              </span>
            </div>
            <div className="tw:text-sm tw:font-bold tw:text-gray-900 tw:mb-1">
              {service.duration}
            </div>
            {service.warrantyPeriod && (
              <div className="tw:text-xs tw:text-blue-600 tw:font-medium">
                {service.warrantyPeriod} warranty
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="tw:grid tw:grid-cols-3 tw:gap-3 tw:mb-4">
          {/* Rating */}
          <div className="tw:text-center tw:p-2 tw:bg-gray-50 tw:rounded-lg">
            <div className="tw:flex tw:items-center tw:justify-center tw:space-x-1 tw:mb-1">
              <Star className="tw:h-4 tw:w-4 tw:text-yellow-500 tw:fill-current" />
              <span className="tw:text-sm tw:font-bold tw:text-gray-900">
                {service.rating?.average?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div className="tw:text-xs tw:text-gray-500">
              {service.rating?.totalReviews || 0} reviews
            </div>
          </div>

          {/* Bookings */}
          <div className="tw:text-center tw:p-2 tw:bg-gray-50 tw:rounded-lg">
            <div className="tw:flex tw:items-center tw:justify-center tw:space-x-1 tw:mb-1">
              <Users className="tw:h-4 tw:w-4 tw:text-purple-500" />
              <span className="tw:text-sm tw:font-bold tw:text-gray-900">
                {service.totalBookings || 0}
              </span>
            </div>
            <div className="tw:text-xs tw:text-gray-500">bookings</div>
          </div>

          {/* Performance Score */}
          <div className="tw:text-center tw:p-2 tw:bg-gray-50 tw:rounded-lg">
            <div className="tw:flex tw:items-center tw:justify-center tw:space-x-1 tw:mb-1">
              <TrendingUp className="tw:h-4 tw:w-4 tw:text-orange-500" />
              <span className="tw:text-sm tw:font-bold tw:text-gray-900">
                {service.popularityScore || 0}%
              </span>
            </div>
            <div className="tw:text-xs tw:text-gray-500">popularity</div>
          </div>
        </div>

        {/* Availability */}
        <div className="tw:bg-gradient-to-r tw:from-gray-50 tw:to-blue-50 tw:p-4 tw:rounded-lg tw:mb-4 tw:border tw:border-gray-100">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
            <div className="tw:flex tw:items-center tw:space-x-2">
              <Calendar className="tw:h-4 tw:w-4 tw:text-gray-600" />
              <span className="tw:text-sm tw:font-semibold tw:text-gray-700">
                Today's Availability
              </span>
            </div>
          </div>

          <div className="tw:flex tw:justify-between tw:items-center">
            <div>
              <span className="tw:text-2xl tw:font-bold tw:text-gray-900">
                {service.availableSlots?.today || 0}
              </span>
              <span className="tw:text-sm tw:text-gray-600 tw:ml-1">slots</span>
            </div>
            {service.availableSlots?.nextSlot && (
              <div className="tw:text-right">
                <div className="tw:text-xs tw:text-gray-500">
                  Next available
                </div>
                <div className="tw:text-sm tw:font-semibold tw:text-orange-600">
                  {service.availableSlots.nextSlot}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="tw:flex tw:space-x-3">
          <button
            onClick={() => onEdit(service._id)}
            className="tw:flex-1 tw:bg-gradient-to-r tw:from-blue-600 tw:to-blue-700 tw:text-white tw:py-3 tw:px-4 tw:rounded-lg tw:text-sm tw:font-semibold tw:hover:tw:from-blue-700 tw:hover:tw:to-blue-800 tw:transition-all tw:duration-200 tw:flex tw:items-center tw:justify-center tw:space-x-2 tw:shadow-md tw:hover:tw:shadow-lg"
          >
            <Edit className="tw:h-4 tw:w-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => handleStatusToggle(isActive ? "inactive" : "active")}
            className={`tw:flex-1 tw:py-3 tw:px-4 tw:rounded-lg tw:text-sm tw:font-semibold tw:transition-all tw:duration-200 tw:flex tw:items-center tw:justify-center tw:space-x-2 tw:shadow-md tw:hover:tw:shadow-lg ${
              isActive
                ? "tw:bg-gradient-to-r tw:from-orange-500 tw:to-red-500 tw:text-white hover:tw:from-orange-600 hover:tw:to-red-600"
                : "tw:bg-gradient-to-r tw:from-green-500 tw:to-emerald-500 tw:text-white hover:tw:from-green-600 hover:tw:to-emerald-600"
            }`}
          >
            <div
              className={`tw:w-3 tw:h-3 tw:rounded-full tw:bg-white tw:bg-opacity-80`}
            ></div>
            <span>{isActive ? "Pause" : "Activate"}</span>
          </button>
        </div>

        {/* Additional Info Footer */}
        <div className="tw:mt-4 tw:pt-4 tw:border-t tw:border-gray-100">
          <div className="tw:flex tw:justify-between tw:items-center tw:text-xs tw:text-gray-500">
            <div className="tw:flex tw:items-center tw:space-x-4">
              <div>
                Created {new Date(service.createdAt).toLocaleDateString()}
              </div>
              {service.lastBooking && (
                <div className="tw:text-blue-600">
                  Last booking:{" "}
                  {new Date(service.lastBooking).toLocaleDateString()}
                </div>
              )}
            </div>

            {service.updatedAt !== service.createdAt && (
              <div className="tw:text-orange-600">
                Updated {new Date(service.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="tw:fixed tw:inset-0 tw:z-10"
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default ServiceCard;
