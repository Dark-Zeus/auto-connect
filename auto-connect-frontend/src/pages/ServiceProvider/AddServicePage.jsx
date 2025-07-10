// src/pages/ServiceProvider/AddServicePage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CheckCircle } from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import ServiceForm from "@components/ServiceProvider/ServiceForm";

const AddServicePage = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (serviceData) => {
    setLoading(true);

    try {
      const response = await fetch("/api/v1/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Service added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate back to services list
        navigate("/dashboard/service-provider/services");
      } else {
        // Handle specific error messages from backend
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => {
            toast.error(error.message || error);
          });
        } else {
          toast.error(
            result.message || "Failed to add service. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if form has any data before navigating away
    const confirmLeave = window.confirm(
      "Are you sure you want to leave? Any unsaved changes will be lost."
    );

    if (confirmLeave) {
      navigate("/dashboard/service-provider/services");
    }
  };

  // Check if user has permission to add services
  if (
    !userContext ||
    !["service_center", "repair_center"].includes(userContext.role)
  ) {
    return (
      <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:flex tw:items-center tw:justify-center">
        <div className="tw:bg-white tw:rounded-lg tw:shadow-lg tw:p-8 tw:text-center tw:max-w-md">
          <div className="tw:text-red-500 tw:text-6xl tw:mb-4">🚫</div>
          <h1 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">
            Access Denied
          </h1>
          <p className="tw:text-gray-600 tw:mb-4">
            You don't have permission to add services. This feature is only
            available for service centers and repair centers.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50">
      <div className="tw:container tw:mx-auto tw:px-4 tw:py-8 tw:max-w-4xl">
        {/* Header */}
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
          <div className="tw:flex tw:items-center tw:space-x-4">
            <button
              onClick={() => navigate("/dashboard/service-provider/services")}
              className="tw:flex tw:items-center tw:space-x-2 tw:text-gray-600 hover:tw:text-gray-800 tw:transition-colors tw:group"
            >
              <ArrowLeft className="tw:h-5 tw:w-5 group-hover:tw:-translate-x-1 tw:transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>

          <div className="tw:flex tw:items-center tw:space-x-2 tw:text-sm tw:text-gray-600">
            <CheckCircle className="tw:h-4 tw:w-4 tw:text-green-500" />
            <span>All fields marked with * are required</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="tw:bg-white tw:rounded-xl tw:shadow-xl tw:overflow-hidden">
          {/* Header Section */}
          <div className="tw:px-8 tw:py-6 tw:bg-gradient-to-r tw:from-blue-600 tw:to-blue-700 tw:text-white">
            <div className="tw:flex tw:items-center tw:space-x-3">
              <div className="tw:bg-white tw:bg-opacity-20 tw:p-3 tw:rounded-lg">
                <Plus className="tw:h-6 tw:w-6" />
              </div>
              <div>
                <h1 className="tw:text-2xl tw:font-bold">Add New Service</h1>
                <p className="tw:text-blue-100 tw:mt-1">
                  Create a new service offering for your customers
                </p>
              </div>
            </div>
          </div>

          {/* Service Provider Info */}
          <div className="tw:px-8 tw:py-4 tw:bg-blue-50 tw:border-b tw:border-blue-100">
            <div className="tw:flex tw:items-center tw:justify-between">
              <div className="tw:flex tw:items-center tw:space-x-3">
                <div className="tw:w-10 tw:h-10 tw:bg-blue-600 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:font-semibold">
                  {userContext?.firstName?.charAt(0)}
                  {userContext?.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="tw:font-medium tw:text-gray-900">
                    {userContext?.businessInfo?.businessName ||
                      `${userContext?.firstName} ${userContext?.lastName}`}
                  </p>
                  <p className="tw:text-sm tw:text-gray-600 tw:capitalize">
                    {userContext?.role?.replace("_", " ")}
                  </p>
                </div>
              </div>
              <div className="tw:text-right">
                <p className="tw:text-sm tw:text-gray-600">
                  Service Provider ID
                </p>
                <p className="tw:font-mono tw:text-sm tw:text-gray-900">
                  {userContext?._id?.slice(-8)?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="tw:px-8 tw:py-8">
            <ServiceForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              isEdit={false}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="tw:mt-8 tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-lg tw:p-6">
          <h3 className="tw:text-lg tw:font-semibold tw:text-amber-800 tw:mb-3">
            💡 Tips for Creating Effective Service Listings
          </h3>
          <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4 tw:text-sm tw:text-amber-700">
            <div>
              <h4 className="tw:font-semibold tw:mb-2">
                Writing Descriptions:
              </h4>
              <ul className="tw:space-y-1 tw:list-disc tw:list-inside">
                <li>Be specific about what's included</li>
                <li>Mention the quality of parts/materials used</li>
                <li>Include estimated completion time</li>
                <li>Highlight any certifications or expertise</li>
              </ul>
            </div>
            <div>
              <h4 className="tw:font-semibold tw:mb-2">Pricing Strategy:</h4>
              <ul className="tw:space-y-1 tw:list-disc tw:list-inside">
                <li>Research competitor pricing in your area</li>
                <li>Consider different vehicle types in pricing</li>
                <li>Be transparent about additional costs</li>
                <li>Offer clear warranty terms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="tw:mt-6 tw:flex tw:justify-center tw:space-x-4">
          <button
            onClick={() => navigate("/dashboard/service-provider/services")}
            className="tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm tw:font-medium"
          >
            View All Services
          </button>
          <span className="tw:text-gray-300">•</span>
          <button
            onClick={() => navigate("/dashboard/service-provider/manage-slots")}
            className="tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm tw:font-medium"
          >
            Manage Time Slots
          </button>
          <span className="tw:text-gray-300">•</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm tw:font-medium"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
