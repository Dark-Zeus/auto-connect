import React, { useState, useEffect } from "react";
import {
  X,
  User,
  MapPin,
  Building,
  Award,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
} from "lucide-react";
import ServiceCenterAPI from "../../services/getServiceCentersApiService";

function ServiceCenterDetailCard({ data, onClose }) {
  const [details, setDetails] = useState(data);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!data?._id) return;
      try {
        const res = await ServiceCenterAPI.getAllServiceCenters();
        const center = res.data.find((c) => c._id === data._id);
        setDetails(center);
      } catch (error) {
        console.error("Error fetching service center details:", error);
      }
    };
    fetchDetails();
  }, [data]);

  if (!details) return null;

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    businessInfo,
    icon,
    rating,
    reviewCount,
    isVerified,
    createdAt,
    updatedAt,
  } = details;

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-[999] tw:p-4">
      <div className="tw:bg-white tw:max-w-5xl tw:w-full tw:rounded-3xl tw:shadow-2xl tw:overflow-hidden tw:max-h-[95vh] tw:p-6 tw:relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="tw:absolute tw:top-5 tw:right-5 tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-red-100 tw:text-red-600 tw:rounded-full tw:hover:bg-red-500 tw:hover:text-white tw:transition-all"
        >
          <X className="tw:w-5 tw:h-5" />
        </button>

        {/* Header */}
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
          <div className="tw:flex tw:items-center tw:gap-4">
            <div className="tw:w-14 tw:h-14 tw:flex tw:items-center tw:justify-center tw:bg-gradient-to-br tw:from-blue-600 tw:to-blue-700 tw:rounded-xl tw:shadow-lg">
              <Building className="tw:w-6 tw:h-6 tw:text-white" />
            </div>
            <div>
              <h2 className="tw:text-2xl tw:font-bold tw:text-blue-900">
                {businessInfo?.businessName || "Service Center Details"}
              </h2>
              <div className="tw:flex tw:items-center tw:gap-3 tw:mt-2">
                {isVerified ? (
                  <div className="tw:flex tw:items-center tw:gap-1 tw:bg-green-100 tw:text-green-700 tw:px-3 tw:py-1 tw:rounded-lg tw:text-sm tw:font-medium">
                    <ShieldCheck className="tw:w-4 tw:h-4" /> Verified
                  </div>
                ) : (
                  <div className="tw:flex tw:items-center tw:gap-1 tw:bg-gray-100 tw:text-gray-700 tw:px-3 tw:py-1 tw:rounded-lg tw:text-sm tw:font-medium">
                    <ShieldCheck className="tw:w-4 tw:h-4" /> Not Verified
                  </div>
                )}

                {rating !== undefined && rating !== null && !isNaN(Number(rating)) && (
                  <div className="tw:flex tw:items-center tw:gap-1 tw:text-yellow-500 tw:font-semibold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`tw:w-4 tw:h-4 ${i < Math.round(Number(rating)) ? "tw:fill-yellow-400" : "tw:fill-none"}`}
                      />
                    ))}
                    <span className="tw:text-blue-900 tw:ml-1 tw:text-sm">
                      {Number(rating).toFixed(1)} / 5 ({reviewCount || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {icon && (
            <img
              src={icon}
              alt={businessInfo?.businessName}
              className="tw:w-32 tw:h-32 tw:object-cover tw:rounded-2xl tw:border-4 tw:border-white tw:shadow-xl"
            />
          )}
        </div>

        {/* Sections */}
        <div className="tw:space-y-4 tw:overflow-y-auto tw:max-h-[75vh]">

          {/* Personal Info Box */}
          <div className="tw:bg-blue-50 tw:p-4 tw:rounded-xl tw:shadow-md">
            <h3 className="tw-font-semibold tw:text-blue-800 tw:flex tw:items-center tw:gap-2 mb-3">
              <User className="tw-w-5 tw-h-5" /> Personal Info
            </h3>
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-2">
              <p><span className="tw-font-semibold">Name:</span> {firstName} {lastName}</p>
              <p><span className="tw-font-semibold">Email:</span> {email}</p>
              <p><span className="tw-font-semibold">Phone:</span> {phone}</p>
            </div>
          </div>

          {/* Address Box */}
          <div className="tw:bg-blue-50 tw:p-4 tw:rounded-xl tw:shadow-md">
            <h3 className="tw-font-semibold tw:text-blue-800 tw:flex tw:items-center tw:gap-2 mb-3">
              <MapPin className="tw-w-5 tw-h-5" /> Address
            </h3>
            {address ? (
              <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-2">
                <p><span className="tw-font-semibold">Street:</span> {address.street}</p>
                <p><span className="tw-font-semibold">City:</span> {address.city}</p>
                <p><span className="tw-font-semibold">District:</span> {address.district}</p>
                <p><span className="tw-font-semibold">Province:</span> {address.province}</p>
                <p><span className="tw-font-semibold">Postal Code:</span> {address.postalCode}</p>
              </div>
            ) : (
              <p>No address provided</p>
            )}
          </div>

          {/* Business Info Box */}
          <div className="tw:bg-blue-50 tw:p-4 tw:rounded-xl tw:shadow-md">
            <h3 className="tw-font-semibold tw:text-blue-800 tw:flex tw:items-center tw:gap-2 mb-3">
              <Award className="tw-w-5 tw:h-5" /> Business Info
            </h3>
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-2">
              <p><span className="tw-font-semibold">Business Name:</span> {businessInfo?.businessName}</p>
              <p><span className="tw-font-semibold">Category:</span> {businessInfo?.category}</p>
              <p><span className="tw-font-semibold">Open Hours:</span> {businessInfo?.openingHours || "N/A"}</p>
              <p><span className="tw-font-semibold">Registration Date:</span> {new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Audit Info Box */}
          <div className="tw:bg-blue-50 tw:p-4 tw:rounded-xl tw:shadow-md tw:text-sm tw:text-gray-600">
            <p><Calendar className="tw-inline tw-w-4 tw-h-4 tw:mr-1" /> Created: {new Date(createdAt).toLocaleString()}</p>
            <p><Clock className="tw-inline tw-w-4 tw:h-4 tw:mr-1" /> Last Updated: {new Date(updatedAt).toLocaleString()}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ServiceCenterDetailCard;
