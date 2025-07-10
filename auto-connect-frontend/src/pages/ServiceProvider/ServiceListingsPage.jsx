// src/pages/ServiceProvider/ServiceListingsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Settings,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import ServiceListingsTable from "@components/ServiceProvider/ServiceListingsTable";
import { UserContext } from "@contexts/UserContext";

const ServiceListingsPage = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeServices: 0,
    availableSlots: 0,
    avgPrice: 0,
    weeklyBookings: 0,
  });

  useEffect(() => {
    fetchServices();
    fetchStats();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // API call to fetch services for the logged-in service provider
      const response = await fetch("/api/v1/services/my-services", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/v1/services/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleAddService = () => {
    navigate("/dashboard/service-provider/add-service");
  };

  const handleManageSlots = () => {
    navigate("/dashboard/service-provider/manage-slots");
  };

  const handleEditService = (serviceId) => {
    navigate(`/dashboard/service-provider/edit-service/${serviceId}`);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/v1/services/${serviceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          fetchServices(); // Refresh the list
          fetchStats(); // Refresh stats
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleToggleStatus = async (serviceId, currentStatus) => {
    try {
      const response = await fetch(
        `/api/v1/services/${serviceId}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: currentStatus === "active" ? "inactive" : "active",
          }),
        }
      );

      if (response.ok) {
        fetchServices(); // Refresh the list
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error toggling service status:", error);
    }
  };

  const statsCards = [
    {
      title: "Active Services",
      value: stats.activeServices,
      icon: CheckCircle,
      color: "tw:text-green-600",
      bgColor: "tw:bg-green-100",
    },
    {
      title: "Available Slots",
      value: stats.availableSlots,
      icon: Clock,
      color: "tw:text-blue-600",
      bgColor: "tw:bg-blue-100",
    },
    {
      title: "Avg. Price",
      value: `Rs. ${stats.avgPrice?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "tw:text-purple-600",
      bgColor: "tw:bg-purple-100",
    },
    {
      title: "This Week",
      value: stats.weeklyBookings,
      icon: TrendingUp,
      color: "tw:text-orange-600",
      bgColor: "tw:bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:flex tw:items-center tw:justify-center">
        <div className="tw:text-lg tw:text-gray-600">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50">
      <div className="tw:container tw:mx-auto tw:px-4 tw:py-8">
        {/* Header Section */}
        <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:p-6 tw:mb-8">
          <div className="tw:flex tw:justify-between tw:items-center">
            <div>
              <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-2">
                Service Listings Management
              </h1>
              <p className="tw:text-gray-600">
                Manage your service offerings, pricing, and availability slots
              </p>
            </div>
            <div className="tw:flex tw:space-x-3">
              <button
                onClick={handleAddService}
                className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg tw:flex tw:items-center tw:space-x-2 hover:tw:bg-blue-700 tw:transition-colors tw:shadow-lg"
              >
                <Plus className="tw:h-5 tw:w-5" />
                <span>Add New Service</span>
              </button>
              <button
                onClick={handleManageSlots}
                className="tw:bg-gray-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg tw:flex tw:items-center tw:space-x-2 hover:tw:bg-gray-700 tw:transition-colors tw:shadow-lg"
              >
                <Settings className="tw:h-5 tw:w-5" />
                <span>Manage Slots</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 lg:tw:grid-cols-4 tw:gap-6 tw:mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="tw:bg-white tw:rounded-lg tw:shadow-md tw:p-6"
            >
              <div className="tw:flex tw:items-center tw:justify-between">
                <div>
                  <p className="tw:text-sm tw:font-medium tw:text-gray-600 tw:mb-1">
                    {stat.title}
                  </p>
                  <p className="tw:text-2xl tw:font-bold tw:text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`tw:p-3 tw:rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`tw:h-8 tw:w-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Table */}
        <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:overflow-hidden">
          <div className="tw:px-6 tw:py-4 tw:border-b tw:border-gray-200">
            <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800">
              Your Service Listings ({services.length})
            </h2>
          </div>

          <ServiceListingsTable
            services={services}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onToggleStatus={handleToggleStatus}
            loading={loading}
          />
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:p-12 tw:text-center">
            <div className="tw:mb-4">
              <Settings className="tw:h-16 tw:w-16 tw:text-gray-400 tw:mx-auto" />
            </div>
            <h3 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">
              No Services Listed Yet
            </h3>
            <p className="tw:text-gray-600 tw:mb-6">
              Start by adding your first service offering to attract customers
            </p>
            <button
              onClick={handleAddService}
              className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg tw:flex tw:items-center tw:space-x-2 tw:mx-auto hover:tw:bg-blue-700 tw:transition-colors"
            >
              <Plus className="tw:h-5 tw:w-5" />
              <span>Add Your First Service</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceListingsPage;
