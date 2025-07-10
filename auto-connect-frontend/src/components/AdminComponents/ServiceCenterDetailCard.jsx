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
    icon,
  } = data;

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50">
      <div className="tw:bg-white tw:max-w-5xl tw:w-full tw:rounded-2xl tw:shadow-2xl tw:p-10 tw:relative tw:overflow-y-auto tw:max-h-[90vh] tw:border tw:border-blue-100">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="tw:absolute tw:top-2 tw:right-2 tw:text-blue-600 tw:text-xl tw:font-bold hover:tw:text-red-600 tw:transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="tw:flex tw:justify-between tw:items-start tw:mb-10">
          <div className="tw:flex-1">
            <h2 className="tw:text-3xl tw:font-bold tw:text-blue-800 tw:mb-2">
              {businessInfo?.businessName || "Service Center Details"}
            </h2>
            <p className="tw:text-blue-500 tw:text-sm">Detailed Information of the Service Center</p>
          </div>
          {icon && (
            <img
              src={icon}
              alt={businessInfo?.businessName}
              className="tw:w-50 tw:h-50 tw:object-cover tw:rounded-xl tw:border tw:border-blue-200"
            />
          )}
        </div>

        {/* Details */}
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">

          {/* Personal Info */}
          <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-white tw:p-6 tw:rounded-2xl tw:border tw:border-blue-200 tw:shadow-lg hover:tw:shadow-xl">
            <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-4 tw:border-b tw:border-blue-200 tw:pb-2">
              👤 Personal Info
            </h3>
            <div className="tw:space-y-4 tw:mt-6 tw:text-blue-900 tw:text-[14px]">
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Full Name</label>
                <p className="tw:text-base tw:font-semibold">{firstName} {lastName}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Email</label>
                <p className="tw:text-base tw:text-blue-700 tw:underline">{email}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Phone</label>
                <p className="tw:text-base tw:font-semibold">{phone}</p>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="tw:bg-gradient-to-br tw:w-120 tw:from-blue-50 tw:to-white tw:p-6 tw:rounded-2xl tw:border tw:border-blue-200 tw:shadow-lg hover:tw:shadow-xl">
            <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-4 tw:border-b tw:border-blue-200 tw:pb-2">
              📍 Address
            </h3>
            <div className="tw:grid tw:grid-cols-2 tw:gap-x-4 tw:gap-y-3 tw:space-y-4 tw:mt-6 tw:text-blue-900 tw:text-[14px]">
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Street</label>
                <p className="tw:text-base">{address?.street}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">City</label>
                <p className="tw:text-base">{address?.city}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">District</label>
                <p className="tw:text-base">{address?.district}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Province</label>
                <p className="tw:text-base">{address?.province}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Postal Code</label>
                <p className="tw:text-base">{address?.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="tw:col-span-2 tw:bg-gradient-to-br tw:from-blue-50 tw:to-white tw:p-6 tw:rounded-2xl tw:border tw:border-blue-200 tw:shadow-lg hover:tw:shadow-xl">
            <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-4 tw:border-b tw:border-blue-200 tw:pb-2">
              🏢 Business Info
            </h3>
            <div className="tw:space-y-4 tw:mt-6 tw:text-blue-900 tw:text-[14px]">
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">License Number</label>
                <p className="tw:text-base">{businessInfo?.licenseNumber}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Registration Number</label>
                <p className="tw:text-base">{businessInfo?.businessRegistrationNumber}</p>
              </div>
              <div>
                <label className="tw:block tw:text-lg tw:text-blue-600 tw:font-medium">Tax ID</label>
                <p className="tw:text-base">{businessInfo?.taxIdentificationNumber}</p>
              </div>

              {businessInfo?.servicesOffered?.length > 0 && (
                <div className="tw:mt-8">
                  <p className="tw:font-semibold tw:!text-lg tw:mb-3 tw:text-blue-700">🛠️ Services Offered</p>
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
            className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-blue-700 tw:transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCenterDetailCard;
