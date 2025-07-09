import React from "react";

function ServiceCenterDetailCard({ data, onClose }) {
  if (!data) return null;

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    businessInfo,
    icon, // image URL (optional, pass in `data.icon`)
  } = data;

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50">
      <div className="tw:bg-white tw:max-w-5xl tw:w-full tw:rounded-2xl tw:shadow-2xl tw:p-10 tw:relative tw:overflow-y-auto tw:max-h-[90vh] tw:border tw:border-blue-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="tw:absolute tw:top-2 tw:right-3 tw:text-blue-600 tw:font-bold tw:text-xl hover:tw:text-red-600 tw:transition"
        >
          ✕
        </button>

        {/* Header with Image and Title */}
        <div className="tw:flex tw:justify-between tw:items-start tw:mb-10">
          <h2 className="tw:text-3xl tw:font-bold tw:text-blue-800">
            {businessInfo?.businessName || "Service Center Details"}
          </h2>
          {icon && (
            <img
              src={icon}
              alt={businessInfo?.businessName}
              className="tw:w-50 tw:h-50 tw:object-cover tw:rounded-lg tw:border tw:border-blue-200"
            />
          )}
        </div>

        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          {/* Personal Info Box */}
            <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-white tw:p-6 tw:rounded-2xl tw:border tw:border-blue-200 tw:shadow-lg tw:transition-all tw:duration-300 tw:hover:tw:shadow-xl">
            <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-5 tw:border-b tw:pb-2 tw:border-blue-200">
                👤 Personal Info
            </h3>
                <div className="tw:space-y-3 tw:text-blue-900 tw:text-[13px]">
                    <div className="tw:flex tw:items-center">
                    <span className="tw:w-20 tw:font-medium">Name:</span>
                    <span className="tw:font-semibold">{firstName} {lastName}</span>
                    </div>
                    <div className="tw:flex tw:items-center">
                    <span className="tw:w-20 tw:font-medium">Email:</span>
                    <span className="tw:text-blue-700 tw:underline">{email}</span>
                    </div>
                    <div className="tw:flex tw:items-center">
                    <span className="tw:w-20 tw:font-medium">Phone:</span>
                    <span className="tw:font-semibold">{phone}</span>
                    </div>
                </div>
            </div>

          {/* Address Box */}
            <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-white tw:w-100 tw:p-6 tw:rounded-2xl tw:border tw:border-blue-200 tw:shadow-lg tw:transition-all tw:duration-300 hover:tw:shadow-xl">
            <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-5 tw:border-b tw:pb-2 tw:border-blue-200">
                📍 Address
            </h3>
                <div className="tw:space-y-3 tw:text-blue-900 tw:text-[13px]">
                    <div className="tw:flex">
                    <span className="tw:w-25 tw:font-medium">Street:</span>
                    <span>{address?.street}</span>
                    </div>
                    <div className="tw:flex">
                    <span className="tw:w-25 tw:font-medium">City:</span>
                    <span>{address?.city}</span>
                    </div>
                    <div className="tw:flex">
                    <span className="tw:w-25 tw:font-medium">District:</span>
                    <span>{address?.district}</span>
                    </div>
                    <div className="tw:flex">
                    <span className="tw:w-25 tw:font-medium">Province:</span>
                    <span>{address?.province}</span>
                    </div>
                    <div className="tw:flex">
                    <span className="tw:w-25 tw:font-medium">Postal Code:</span>
                    <span>{address?.postalCode}</span>
                    </div>
                </div>
            </div>

          {/* Business Info Box */}
            <div className="tw:col-span-2 tw:bg-gradient-to-br tw:from-blue-50 tw:to-white tw:p-6 tw:rounded-2xl tw:border tw:border-blue-200 tw:shadow-lg tw:transition-all tw:duration-300 hover:tw:shadow-xl">
            <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-5 tw:border-b tw:pb-2 tw:border-blue-200">
                🏢 Business Info
            </h3>
            <div className="tw:space-y-4 tw:text-blue-900 tw:text-[13px]">
                <div className="tw:flex tw:gap-2">
                <span className="tw:w-44 tw:font-medium">License Number:</span>
                <span>{businessInfo?.licenseNumber}</span>
                </div>
                <div className="tw:flex tw:gap-2">
                <span className="tw:w-44 tw:font-medium">Registration Number:</span>
                <span>{businessInfo?.businessRegistrationNumber}</span>
                </div>
                <div className="tw:flex tw:gap-2">
                <span className="tw:w-44 tw:font-medium">Tax ID:</span>
                <span>{businessInfo?.taxIdentificationNumber}</span>
                </div>

                {businessInfo?.servicesOffered?.length > 0 && (
                <div className="tw:mt-6">
                    <p className="tw:font-semibold tw:mb-5 tw:!text-xl">🛠️ Services Offered:</p>
                    <ul className="tw:grid tw:grid-cols-2 md:tw:grid-cols-3 tw:gap-x-6 tw:list-disc tw:list-inside">
                    {businessInfo.servicesOffered.map((service, idx) => (
                        <li key={idx}>{service}</li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="tw:mt-8 tw:text-center">
          <button
            onClick={onClose}
            className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2 tw:rounded-xl tw:font-semibold hover:tw:bg-blue-700 tw:transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCenterDetailCard;
