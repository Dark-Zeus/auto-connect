// src/pages/ServiceProvider/EditServicePage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, AlertCircle, Loader } from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import ServiceForm from "@components/ServiceProvider/ServiceForm";

const EditServicePage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { userContext } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [fetchingService, setFetchingService] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch service data on component mount
  useEffect(() => {
    if (serviceId) {
      fetchServiceData();
    }
  }, [serviceId]);

  const fetchServiceData = async () => {
    try {
      setFetchingService(true);
      setError(null);

      const response = await fetch(`/api/v1/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setServiceData(result.service || result.data);
      } else if (response.status === 404) {
        setError(
          "Service not found. It may have been deleted or you may not have permission to edit it."
        );
      } else if (response.status === 403) {
        setError("You do not have permission to edit this service.");
      } else {
        const errorResult = await response.json();
        setError(errorResult.message || "Failed to load service data.");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setFetchingService(false);
    }
  };

  const handleSubmit = async (updatedServiceData) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/services/${serviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedServiceData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Service updated successfully!", {
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
            result.message || "Failed to update service. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if form has any unsaved changes
    const confirmLeave = window.confirm(
      "Are you sure you want to leave? Any unsaved changes will be lost."
    );

    if (confirmLeave) {
      navigate("/dashboard/service-provider/services");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone and will remove all associated bookings and history."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Service deleted successfully!");
        navigate("/dashboard/service-provider/services");
      } else {
        const errorResult = await response.json();
        toast.error(errorResult.message || "Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to edit services
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
            You don't have permission to edit services. This feature is only
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

  // Loading state
  if (fetchingService) {
    return (
      <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50">
        <div className="tw:container tw:mx-auto tw:px-4 tw:py-8 tw:max-w-4xl">
          {/* Header */}
          <div className="tw:flex tw:items-center tw:mb-8">
            <button
              onClick={() => navigate("/dashboard/service-provider/services")}
              className="tw:flex tw:items-center tw:space-x-2 tw:text-gray-600 hover:tw:text-gray-800 tw:transition-colors"
            >
              <ArrowLeft className="tw:h-5 tw:w-5" />
              <span>Back to Services</span>
            </button>
          </div>

          {/* Loading Content */}
          <div className="tw:bg-white tw:rounded-xl tw:shadow-xl tw:p-12">
            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:space-y-4">
              <Loader className="tw:h-12 tw:w-12 tw:text-blue-600 tw:animate-spin" />
              <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800">
                Loading Service Data...
              </h2>
              <p className="tw:text-gray-600 tw:text-center">
                Please wait while we fetch the service information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50">
        <div className="tw:container tw:mx-auto tw:px-4 tw:py-8 tw:max-w-4xl">
          {/* Header */}
          <div className="tw:flex tw:items-center tw:mb-8">
            <button
              onClick={() => navigate("/dashboard/service-provider/services")}
              className="tw:flex tw:items-center tw:space-x-2 tw:text-gray-600 hover:tw:text-gray-800 tw:transition-colors"
            >
              <ArrowLeft className="tw:h-5 tw:w-5" />
              <span>Back to Services</span>
            </button>
          </div>

          {/* Error Content */}
          <div className="tw:bg-white tw:rounded-xl tw:shadow-xl tw:p-12">
            <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:space-y-4">
              <AlertCircle className="tw:h-16 tw:w-16 tw:text-red-500" />
              <h2 className="tw:text-2xl tw:font-bold tw:text-gray-800">
                Unable to Load Service
              </h2>
              <p className="tw:text-gray-600 tw:text-center tw:max-w-md">
                {error}
              </p>
              <div className="tw:flex tw:space-x-4 tw:mt-6">
                <button
                  onClick={fetchServiceData}
                  className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() =>
                    navigate("/dashboard/service-provider/services")
                  }
                  className="tw:bg-gray-600 tw:text-white tw:px-6 tw:py-2 tw:rounded-lg hover:tw:bg-gray-700 tw:transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main edit form
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

          <div className="tw:flex tw:items-center tw:space-x-4">
            <div className="tw:flex tw:items-center tw:space-x-2 tw:text-sm tw:text-gray-600">
              <Edit className="tw:h-4 tw:w-4 tw:text-blue-500" />
              <span>Editing Service</span>
            </div>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="tw:bg-red-600 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-red-700 tw:transition-colors tw:text-sm disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              Delete Service
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="tw:bg-white tw:rounded-xl tw:shadow-xl tw:overflow-hidden">
          {/* Header Section */}
          <div className="tw:px-8 tw:py-6 tw:bg-gradient-to-r tw:from-orange-600 tw:to-orange-700 tw:text-white">
            <div className="tw:flex tw:items-center tw:space-x-3">
              <div className="tw:bg-white tw:bg-opacity-20 tw:p-3 tw:rounded-lg">
                <Edit className="tw:h-6 tw:w-6" />
              </div>
              <div>
                <h1 className="tw:text-2xl tw:font-bold">Edit Service</h1>
                <p className="tw:text-orange-100 tw:mt-1">
                  Update your service offering details
                </p>
              </div>
            </div>
          </div>

          {/* Service Info Header */}
          <div className="tw:px-8 tw:py-4 tw:bg-orange-50 tw:border-b tw:border-orange-100">
            <div className="tw:flex tw:items-center tw:justify-between">
              <div className="tw:flex tw:items-center tw:space-x-3">
                <div className="tw:w-10 tw:h-10 tw:bg-orange-600 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-white tw:font-semibold">
                  <Edit className="tw:h-5 tw:w-5" />
                </div>
                <div>
                  <p className="tw:font-medium tw:text-gray-900">
                    {serviceData?.serviceType}
                  </p>
                  <p className="tw:text-sm tw:text-gray-600">
                    {serviceData?.category} • Created{" "}
                    {new Date(serviceData?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="tw:text-right">
                <p className="tw:text-sm tw:text-gray-600">Service ID</p>
                <p className="tw:font-mono tw:text-sm tw:text-gray-900">
                  {serviceId?.slice(-8)?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Service Status Banner */}
          {serviceData && (
            <div
              className={`tw:px-8 tw:py-3 tw:text-sm ${
                serviceData.isActive || serviceData.status === "active"
                  ? "tw:bg-green-50 tw:text-green-800 tw:border-b tw:border-green-100"
                  : "tw:bg-red-50 tw:text-red-800 tw:border-b tw:border-red-100"
              }`}
            >
              <div className="tw:flex tw:items-center tw:space-x-2">
                <div
                  className={`tw:w-2 tw:h-2 tw:rounded-full ${
                    serviceData.isActive || serviceData.status === "active"
                      ? "tw:bg-green-500"
                      : "tw:bg-red-500"
                  }`}
                ></div>
                <span className="tw:font-medium">
                  This service is currently{" "}
                  {serviceData.isActive || serviceData.status === "active"
                    ? "active"
                    : "inactive"}
                </span>
                <span>•</span>
                <span>
                  Last updated{" "}
                  {new Date(
                    serviceData.updatedAt || serviceData.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="tw:px-8 tw:py-8">
            <ServiceForm
              initialData={serviceData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              isEdit={true}
            />
          </div>
        </div>

        {/* Edit Guidelines */}
        <div className="tw:mt-8 tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-6">
          <h3 className="tw:text-lg tw:font-semibold tw:text-blue-800 tw:mb-3">
            ✏️ Editing Guidelines
          </h3>
          <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4 tw:text-sm tw:text-blue-700">
            <div>
              <h4 className="tw:font-semibold tw:mb-2">Before You Update:</h4>
              <ul className="tw:space-y-1 tw:list-disc tw:list-inside">
                <li>Check if you have pending bookings for this service</li>
                <li>Consider how price changes affect existing customers</li>
                <li>Update time slots if duration changes significantly</li>
                <li>Notify regular customers of major changes</li>
              </ul>
            </div>
            <div>
              <h4 className="tw:font-semibold tw:mb-2">Impact of Changes:</h4>
              <ul className="tw:space-y-1 tw:list-disc tw:list-inside">
                <li>Price changes apply to new bookings only</li>
                <li>Description updates are visible immediately</li>
                <li>Deactivating affects future booking availability</li>
                <li>Duration changes may require slot rescheduling</li>
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
            onClick={() =>
              navigate(
                `/dashboard/service-provider/services/${serviceId}/bookings`
              )
            }
            className="tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm tw:font-medium"
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
