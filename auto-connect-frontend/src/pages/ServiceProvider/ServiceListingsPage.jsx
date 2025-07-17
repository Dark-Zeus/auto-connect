import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Settings,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  Activity,
  BarChart3,
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import ServiceListingsTable from "@components/ServiceProvider/ServiceListingsTable";
import { UserContext } from "@contexts/UserContext";
import "./ServiceListingsPage.css";

const ServiceListingsPage = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    activeServices: 12,
    totalBookings: 48,
    totalRevenue: 420000,
    avgRating: 4.8,
  });

  const mockServices = [
    {
      id: 1,
      name: "Premium Car Wash & Detailing",
      category: "Cleaning",
      price: 8500,
      duration: 120,
      location: "Colombo 03",
      status: "active",
      rating: 4.9,
      reviewCount: 156,
      description:
        "Complete exterior and interior cleaning with premium products.",
      bookingsThisWeek: 12,
      revenue: 102000,
    },
    {
      id: 2,
      name: "Engine Diagnostic & Repair",
      category: "Maintenance",
      price: 25000,
      duration: 180,
      location: "Kandy",
      status: "active",
      rating: 4.7,
      reviewCount: 89,
      description:
        "Comprehensive engine analysis using advanced diagnostic tools.",
      bookingsThisWeek: 8,
      revenue: 200000,
    },
    {
      id: 3,
      name: "Tire Replacement Service",
      category: "Repair",
      price: 12000,
      duration: 45,
      location: "Galle",
      status: "inactive",
      rating: 4.6,
      reviewCount: 67,
      description: "Professional tire installation with wheel balancing.",
      bookingsThisWeek: 0,
      revenue: 0,
    },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setServices(mockServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
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
        await new Promise((resolve) => setTimeout(resolve, 500));
        setServices(services.filter((service) => service.id !== serviceId));
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleToggleStatus = async (serviceId, currentStatus) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setServices(
        services.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                status: currentStatus === "active" ? "inactive" : "active",
              }
            : service
        )
      );
    } catch (error) {
      console.error("Error toggling service status:", error);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || service.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="service-listings-loading">
        <div className="service-listings-loading-card">
          <div className="service-listings-loading-spinner">
            <Activity />
            <div className="service-listings-loading-overlay"></div>
          </div>
          <p className="service-listings-loading-text">
            Loading your services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-listings-page">
      {/* Background Pattern */}
      <div className="service-listings-bg-pattern"></div>

      <div className="service-listings-content">
        {/* Page Header */}
        <div className="service-listings-header">
          <div className="service-listings-header-content">
            <div className="service-listings-header-info">
              <div className="service-listings-header-title-section">
                <div className="service-listings-header-icon">
                  <Settings />
                </div>
                <div>
                  <h1 className="service-listings-header-title">
                    Service Management
                  </h1>
                  <p className="service-listings-header-subtitle">
                    Manage your service offerings and track performance metrics
                  </p>
                </div>
              </div>
            </div>

            <div className="service-listings-header-actions">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="service-listings-btn service-listings-btn-refresh"
              >
                <RefreshCw className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                onClick={handleManageSlots}
                className="service-listings-btn service-listings-btn-secondary"
              >
                <Calendar />
                Manage Slots
              </button>

              <button
                onClick={handleAddService}
                className="service-listings-btn service-listings-btn-primary"
              >
                <Plus />
                Add New Service
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="service-listings-stats">
          <StatCard
            icon={<CheckCircle />}
            label="Active Services"
            value={stats.activeServices}
            trend="+12%"
            colorScheme="green"
          />
          <StatCard
            icon={<TrendingUp />}
            label="Total Bookings"
            value={stats.totalBookings}
            trend="+8%"
            colorScheme="blue"
          />
          <StatCard
            icon={<DollarSign />}
            label="Total Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
            trend="+15%"
            colorScheme="orange"
          />
          <StatCard
            icon={<Star />}
            label="Average Rating"
            value={`${stats.avgRating}/5`}
            trend="+0.2"
            colorScheme="purple"
          />
        </div>

        {/* Search and Filter */}
        <div className="service-listings-search-section">
          <div className="service-listings-search-controls">
            <div className="service-listings-search-input-container">
              <Search className="service-listings-search-icon" />
              <input
                type="text"
                placeholder="Search services by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="service-listings-search-input"
              />
            </div>

            <div className="service-listings-filter-container">
              <Filter className="service-listings-filter-icon" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="service-listings-filter-select"
              >
                <option value="all">All Services</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <div className="service-listings-filter-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="service-listings-search-info">
            <p className="service-listings-search-count">
              Showing{" "}
              <span className="service-listings-search-count-highlight">
                {filteredServices.length}
              </span>{" "}
              of{" "}
              <span className="service-listings-search-count-highlight">
                {services.length}
              </span>{" "}
              services
            </p>

            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="service-listings-clear-filters"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Services Table */}
        <div className="service-listings-table-container">
          <div className="service-listings-table-header">
            <h2 className="service-listings-table-title">
              <BarChart3 />
              Service Listings
            </h2>
          </div>

          <ServiceListingsTable
            services={filteredServices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onToggleStatus={handleToggleStatus}
            loading={false}
          />
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && !loading && (
          <div className="service-listings-empty">
            <div className="service-listings-empty-content">
              <div className="service-listings-empty-icon">
                <Settings />
              </div>

              <h3 className="service-listings-empty-title">
                {searchTerm || filterStatus !== "all"
                  ? "No Services Found"
                  : "No Services Listed"}
              </h3>

              <p className="service-listings-empty-text">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "Get started by adding your first service offering to attract customers."}
              </p>

              {!searchTerm && filterStatus === "all" && (
                <button
                  onClick={handleAddService}
                  className="service-listings-empty-button"
                >
                  <Plus />
                  Add Your First Service
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, colorScheme }) => {
  return (
    <div className={`service-listings-stat-card ${colorScheme}`}>
      <div className="service-listings-stat-card-content">
        <div className="service-listings-stat-card-main">
          <div className="service-listings-stat-card-header">
            <div className="service-listings-stat-card-icon">{icon}</div>
            {trend && (
              <span className="service-listings-stat-card-trend">{trend}</span>
            )}
          </div>

          <div className="service-listings-stat-card-info">
            <p className="service-listings-stat-card-value">{value}</p>
            <p className="service-listings-stat-card-label">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceListingsPage;
