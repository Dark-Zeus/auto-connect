import React from "react";
import { X, User, MapPin, Building, Award, Phone, Mail, Calendar, Clock } from "lucide-react";

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
    <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:flex tw:items-center tw:justify-center tw:z-999 tw:p-4">
      <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:max-w-6xl tw:w-full tw:rounded-3xl tw:shadow-2xl tw:shadow-blue-200/30 tw:relative tw:overflow-hidden tw:max-h-[95vh] tw:border-2 tw:border-blue-200/50">
        
        {/* Enhanced Close Button */}
        <button
          onClick={onClose}
          className="tw:absolute tw:top-6 tw:mt-5 tw:right-6 tw:z-10 tw:flex tw:items-center tw:justify-center tw:w-12 tw:h-12 tw:bg-red-500/10 tw:hover:bg-red-500 tw:text-red-600 tw:hover:text-white tw:rounded-full tw:transition-all tw:duration-300 tw:backdrop-blur-sm tw:border tw:border-red-200 tw:hover:border-red-500 tw:shadow-lg tw:hover:shadow-red-200/50"
        >
          <X className="tw:w-5 tw:h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="tw:overflow-y-auto tw:max-h-[95vh] tw:p-8 tw:pb-6">
          
          {/* Header Section */}
          <div className="tw:flex tw:flex-col lg:tw:flex-row tw:justify-between tw:items-start tw:gap-6 tw:mb-8 tw:pb-6 tw:border-b tw:border-blue-200">
            <div className="tw:flex-1">
              <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                <div className="tw:flex tw:items-center tw:justify-center tw:w-12 tw:h-12 tw:bg-gradient-to-br tw:from-blue-600 tw:to-blue-700 tw:rounded-xl tw:shadow-lg">
                  <Building className="tw:w-6 tw:h-6 tw:text-white" />
                </div>
                <div>
                  <h2 className="tw:text-3xl tw:font-bold tw:text-blue-900 tw:mb-1">
                    {businessInfo?.businessName || "Service Center Details"}
                  </h2>
                  <p className="tw:text-blue-600 tw:font-medium">Complete Service Center Information</p>
                </div>
              </div>
            </div>
            
            {icon && (
              <div className="tw:relative tw:group">
                <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-blue-400 tw:to-blue-600 tw:rounded-2xl tw:blur-lg tw:opacity-30 tw:group-hover:opacity-50 tw:transition-opacity tw:duration-300"></div>
                <img
                  src={icon}
                  alt={businessInfo?.businessName}
                  className="tw:relative tw:w-32 tw:h-32 tw:object-cover tw:rounded-2xl tw:border-4 tw:border-white tw:shadow-xl tw:transition-transform tw:duration-300 tw:group-hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="tw:grid tw:grid-cols-2 lg:tw:grid-cols-2 tw:gap-8 tw:mb-8">

            {/* Personal Info Card */}
            <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50/50 tw:p-8 tw:rounded-2xl tw:border-2 tw:border-blue-200/50 tw:shadow-lg tw:shadow-blue-100/50 tw:backdrop-blur-sm tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30 hover:tw:-translate-y-1">
              <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6">
                <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-blue-600 tw:rounded-xl tw:shadow-md">
                  <User className="tw:w-5 tw:h-5 tw:text-white" />
                </div>
                <h3 className="tw:text-xl tw:font-bold tw:text-blue-900">Personal Information</h3>
              </div>
              
              <div className="tw:space-y-6">
                <div className="tw:group">
                  <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2">
                    Full Name
                  </label>
                  <p className="tw:text-lg tw:font-semibold tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{firstName} {lastName}</p>
                </div>
                
                <div className="tw:group">
                  <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2">
                    <Mail className="tw:w-4 tw:h-4" />
                    Email Address
                  </label>
                  <p className="tw:text-lg tw:!text-blue-800 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">
                    {email}
                  </p>
                </div>
                
                <div className="tw:group">
                  <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2">
                    <Phone className="tw:w-4 tw:h-4" />
                    Phone Number
                  </label>
                  <p className="tw:text-lg tw:font-semibold tw:!text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">
                    {phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Info Card */}
            <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50/50 tw:p-8 tw:rounded-2xl tw:border-2 tw:border-blue-200/50 tw:shadow-lg tw:shadow-blue-100/50 tw:backdrop-blur-sm tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30 hover:tw:-translate-y-1">
              <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6">
                <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-green-600 tw:rounded-xl tw:shadow-md">
                  <MapPin className="tw:w-5 tw:h-5 tw:text-white" />
                </div>
                <h3 className="tw:text-xl tw:font-bold tw:text-blue-900">Location Details</h3>
              </div>
              
              <div className="tw:grid tw:grid-cols-2 tw:gap-4">
                <div className="tw:col-span-2">
                  <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">Street Address</label>
                  <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{address?.street}</p>
                </div>
                
                <div>
                  <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">City</label>
                  <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{address?.city}</p>
                </div>
                
                <div>
                  <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">District</label>
                  <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{address?.district}</p>
                </div>
                
                <div>
                  <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">Province</label>
                  <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{address?.province}</p>
                </div>
                
                <div>
                  <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">Postal Code</label>
                  <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{address?.postalCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50/50 tw:p-8 tw:rounded-2xl tw:border-2 tw:border-blue-200/50 tw:shadow-lg tw:shadow-blue-100/50 tw:backdrop-blur-sm tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30 tw:mb-8">
            <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6">
              <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-purple-600 tw:rounded-xl tw:shadow-md">
                <Building className="tw:w-5 tw:h-5 tw:text-white" />
              </div>
              <h3 className="tw:text-xl tw:font-bold tw:text-blue-900">Business Information</h3>
            </div>
            
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-6 tw:mb-8">
              <div>
                <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">License Number</label>
                <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{businessInfo?.licenseNumber}</p>
              </div>
              
              <div>
                <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">Registration Number</label>
                <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{businessInfo?.businessRegistrationNumber}</p>
              </div>
              
              <div>
                <label className="tw:text-blue-700 tw:font-semibold tw:text-sm tw:uppercase tw:tracking-wide tw:mb-2 tw:block">Tax ID</label>
                <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200">{businessInfo?.taxIdentificationNumber}</p>
              </div>
            </div>

            {/* Services Offered */}
            {businessInfo?.servicesOffered?.length > 0 && (
              <div className="tw:mb-8">
                <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                  <div className="tw:flex tw:items-center tw:justify-center tw:w-8 tw:h-8 tw:bg-orange-600 tw:rounded-lg tw:shadow-md">
                    <Building className="tw:w-4 tw:h-4 tw:text-white" />
                  </div>
                  <h4 className="tw:text-lg tw:font-bold tw:text-blue-900">Services Offered</h4>
                </div>
                <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-3 lg:tw:grid-cols-4 tw:gap-3">
                  {businessInfo.servicesOffered.map((service, idx) => (
                    <div
                      key={idx}
                      className="tw:flex tw:items-center tw:gap-2 tw:bg-gradient-to-r tw:from-blue-100 tw:to-blue-50 tw:px-4 tw:py-3 tw:rounded-xl tw:border tw:border-blue-200 tw:text-blue-800 tw:font-medium tw:transition-all tw:duration-200 hover:tw:from-blue-200 hover:tw:to-blue-100 hover:tw:shadow-md"
                    >
                      <div className="tw:w-2 tw:h-2 tw:bg-blue-600 tw:rounded-full"></div>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certifications */}
          {businessInfo?.certifications?.length > 0 && (
            <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50/50 tw:p-8 tw:rounded-2xl tw:border-2 tw:border-blue-200/50 tw:shadow-lg tw:shadow-blue-100/50 tw:backdrop-blur-sm tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30 tw:mb-8">
              <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6">
                <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-yellow-600 tw:rounded-xl tw:shadow-md">
                  <Award className="tw:w-5 tw:h-5 tw:text-white" />
                </div>
                <h3 className="tw:text-xl tw:font-bold tw:text-blue-900">Professional Certifications</h3>
              </div>
              
              <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-2 tw:gap-6">
                {businessInfo.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="tw:bg-gradient-to-br tw:from-white tw:to-yellow-50 tw:border-2 tw:border-yellow-200/50 tw:rounded-2xl tw:p-6 tw:shadow-md tw:shadow-yellow-100/50 tw:transition-all tw:duration-300 hover:tw:shadow-lg hover:tw:shadow-yellow-200/30 hover:tw:-translate-y-1"
                  >
                    <div className="tw:flex tw:items-start tw:gap-3 tw:mb-4">
                      <div className="tw:flex tw:items-center tw:justify-center tw:w-8 tw:h-8 tw:bg-yellow-600 tw:rounded-lg tw:shadow-md tw:flex-shrink-0">
                        <Award className="tw:w-4 tw:h-4 tw:text-white" />
                      </div>
                      <h4 className="tw:text-lg tw:font-bold tw:text-blue-900 tw:leading-tight">
                        {cert.name}
                      </h4>
                    </div>
                    
                    <div className="tw:space-y-3 tw:text-sm">
                      <div>
                        <span className="tw:text-blue-700 tw:font-semibold">Issued By:</span>
                        <p className="tw:text-blue-900 tw:bg-blue-50 tw:px-3 tw:py-2 tw:rounded-lg tw:mt-1">{cert.issuedBy}</p>
                      </div>
                      
                      <div>
                        <span className="tw:text-blue-700 tw:font-semibold">Certificate Number:</span>
                        <p className="tw:text-blue-900 tw:bg-blue-50 tw:px-3 tw:py-2 tw:rounded-lg tw:font-mono tw:mt-1">{cert.certificateNumber}</p>
                      </div>
                      
                      <div className="tw:flex tw:flex-wrap tw:gap-2 tw:pt-2">
                        <div className="tw:flex tw:items-center tw:gap-2 tw:bg-green-100 tw:text-green-800 tw:px-3 tw:py-2 tw:rounded-lg tw:font-medium">
                          <Calendar className="tw:w-3 tw:h-3" />
                          <span className="tw:text-xs">Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="tw:flex tw:items-center tw:gap-2 tw:bg-red-100 tw:text-red-800 tw:px-3 tw:py-2 tw:rounded-lg tw:font-medium">
                          <Clock className="tw:w-3 tw:h-3" />
                          <span className="tw:text-xs">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Footer */}
          <div className="tw:flex tw:flex-col sm:tw:flex-row tw:items-center tw:justify-between tw:gap-4 tw:pt-6 tw:border-t tw:border-blue-200">
            <div className="tw:text-sm tw:text-blue-600">
              <p>Service center information last updated: {new Date().toLocaleDateString()}</p>
            </div>
            
            <button
              onClick={onClose}
              className="tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-3 tw:bg-gradient-to-r tw:from-blue-600 tw:to-blue-700 tw:text-white tw:font-semibold tw:rounded-xl tw:shadow-lg tw:shadow-blue-200/50 tw:transition-all tw:duration-300 hover:tw:from-blue-700 hover:tw:to-blue-800 hover:tw:shadow-xl hover:tw:shadow-blue-300/50 hover:tw:-translate-y-0.5 active:tw:translate-y-0"
            >
              <X className="tw:w-4 tw:h-4" />
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceCenterDetailCard;