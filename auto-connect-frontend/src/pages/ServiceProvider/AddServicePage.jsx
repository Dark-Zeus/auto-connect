// src/pages/ServiceProvider/AddServicePage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CheckCircle } from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import ServiceForm from "@components/ServiceProvider/ServiceForm";
import "./AddServicePage.css";

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
    !["service_center", "repair_center", "system_admin"].includes(userContext.role)
  ) {
    return (
      <div className="add-service-access-denied">
        <div className="add-service-access-denied-card">
          <div className="add-service-access-denied-icon">🚫</div>
          <h1 className="add-service-access-denied-title">Access Denied</h1>
          <p className="add-service-access-denied-text">
            You don't have permission to add services. This feature is only
            available for service centers and repair centers.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="add-service-access-denied-button"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-service-page">
      <div className="add-service-container">
        {/* Header */}
        <div className="add-service-header">
          <div className="add-service-back-section">
            <button
              onClick={() => navigate("/dashboard/service-provider/services")}
              className="add-service-back-button"
            >
              <ArrowLeft />
              <span>Back to Services</span>
            </button>
          </div>

          <div className="add-service-header-info">
            <CheckCircle />
            <span>All fields marked with * are required</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="add-service-main-card">
          {/* Header Section */}
          <div className="add-service-card-header">
            <div className="add-service-card-header-content">
              <div className="add-service-card-header-icon">
                <Plus />
              </div>
              <div className="add-service-card-header-text">
                <h1>Add New Service</h1>
                <p>Create a new service offering for your customers</p>
              </div>
            </div>
          </div>

          {/* Service Provider Info */}
          <div className="add-service-provider-info">
            <div className="add-service-provider-content">
              <div className="add-service-provider-left">
                <div className="add-service-provider-avatar">
                  {userContext?.firstName?.charAt(0)}
                  {userContext?.lastName?.charAt(0)}
                </div>
                <div className="add-service-provider-details">
                  <h3>
                    {userContext?.businessInfo?.businessName ||
                      `${userContext?.firstName} ${userContext?.lastName}`}
                  </h3>
                  <p>{userContext?.role?.replace("_", " ")}</p>
                </div>
              </div>
              <div className="add-service-provider-right">
                <p>Service Provider ID</p>
                <p>{userContext?._id?.slice(-8)?.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="add-service-form-section">
            <div className="add-service-form-container">
              <ServiceForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
                isEdit={false}
              />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="add-service-help">
          <h3 className="add-service-help-title">
            💡 Tips for Creating Effective Service Listings
          </h3>
          <div className="add-service-help-grid">
            <div className="add-service-help-section">
              <h4>Writing Descriptions:</h4>
              <ul className="add-service-help-list">
                <li>Be specific about what's included</li>
                <li>Mention the quality of parts/materials used</li>
                <li>Include estimated completion time</li>
                <li>Highlight any certifications or expertise</li>
              </ul>
            </div>
            <div className="add-service-help-section">
              <h4>Pricing Strategy:</h4>
              <ul className="add-service-help-list">
                <li>Research competitor pricing in your area</li>
                <li>Consider different vehicle types in pricing</li>
                <li>Be transparent about additional costs</li>
                <li>Offer clear warranty terms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="add-service-quick-actions">
          <button
            onClick={() => navigate("/dashboard/service-provider/services")}
            className="add-service-quick-action"
          >
            View All Services
          </button>
          <span className="add-service-quick-separator">•</span>
          <button
            onClick={() => navigate("/dashboard/service-provider/manage-slots")}
            className="add-service-quick-action"
          >
            Manage Time Slots
          </button>
          <span className="add-service-quick-separator">•</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="add-service-quick-action"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
