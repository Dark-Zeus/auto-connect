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
              className="tw:w-40 tw:h-40 tw:object-cover tw:rounded-lg tw:border tw:border-blue-200"
            />
          )}
        </div>

        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          {/* Personal Info Box */}
          <div className="tw:bg-blue-50 tw:w-150 tw:p-6 tw:rounded-xl tw:border tw:border-blue-200 tw:shadow-sm">
            <h3 className="tw:text-lg tw:font-semibold tw:text-blue-700 tw:mb-4">Personal Info</h3>
            <div className="tw:space-y-2 tw:text-gray-700">
              <p><span className="tw:font-medium">Name:</span> {firstName} {lastName}</p>
              <p><span className="tw:font-medium">Email:</span> {email}</p>
              <p><span className="tw:font-medium">Phone:</span> {phone}</p>
            </div>
          </div>

          {/* Address Box */}
          <div className="tw:bg-blue-50 tw:w-80 tw:p-6 tw:rounded-xl tw:border tw:border-blue-200 tw:shadow-sm">
            <h3 className="tw:text-lg tw:font-semibold tw:text-blue-700 tw:mb-4">Address</h3>
            <div className="tw:space-y-2 tw:text-gray-700">
              <p><span className="tw:font-medium">Street:</span> {address?.street}</p>
              <p><span className="tw:font-medium">City:</span> {address?.city}</p>
              <p><span className="tw:font-medium">District:</span> {address?.district}</p>
              <p><span className="tw:font-medium">Province:</span> {address?.province}</p>
              <p><span className="tw:font-medium">Postal Code:</span> {address?.postalCode}</p>
            </div>
          </div>

          {/* Business Info Box */}
          <div className="tw:col-span-2 tw:bg-blue-50 tw:p-6 tw:rounded-xl tw:border tw:border-blue-200 tw:shadow-sm">
            <h3 className="tw:text-lg tw:font-semibold tw:text-blue-700 tw:mb-4">Business Info</h3>
            <div className="tw:space-y-2 tw:text-gray-700">
              <p><span className="tw:font-medium">License Number:</span> {businessInfo?.licenseNumber}</p>
              <p><span className="tw:font-medium">Registration Number:</span> {businessInfo?.businessRegistrationNumber}</p>
              <p><span className="tw:font-medium">Tax ID:</span> {businessInfo?.taxIdentificationNumber}</p>

              {businessInfo?.servicesOffered?.length > 0 && (
                <div className="tw:mt-3">
                  <p className="tw:font-medium">Services Offered:</p>
                  <ul className="tw:list-disc tw:ml-6 tw:mt-1">
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
