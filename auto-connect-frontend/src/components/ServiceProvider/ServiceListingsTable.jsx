import React, { useState } from "react";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
  DollarSign,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import "./ServiceListingsTable.css";

const ServiceListingsTable = ({
  services,
  onEdit,
  onDelete,
  onToggleStatus,
  loading,
}) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    return sortDirection === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          dotColor: "bg-emerald-500",
        };
      case "inactive":
        return {
          icon: <XCircle className="h-4 w-4" />,
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          dotColor: "bg-yellow-500",
        };
    }
  };

  const formatPrice = (price) => `LKR ${price.toLocaleString()}`;

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="service-table-sort-icon" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="service-table-sort-icon active" />
    ) : (
      <ArrowDown className="service-table-sort-icon active" />
    );
  };

  if (loading) {
    return (
      <div className="service-table-loading">
        <div className="service-table-loading-spinner"></div>
        <p className="service-table-loading-text">Loading services...</p>
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="service-table-empty">
        <div className="service-table-empty-icon-container">
          <Eye className="service-table-empty-icon" />
        </div>
        <h3 className="service-table-empty-title">No Services Available</h3>
        <p className="service-table-empty-text">
          There are no services to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="service-listings-table fade-in">
      <div className="service-table-container">
        <table className="service-table">
          <thead className="service-table-header">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="sortable"
              >
                <div className="service-table-header-content">
                  <span>Service Details</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th>
                <div className="service-table-header-content">
                  <Users className="action-icon" />
                  Category
                </div>
              </th>
              <th
                onClick={() => handleSort("price")}
                className="sortable"
              >
                <div className="service-table-header-content">
                  <DollarSign className="action-icon" />
                  Price
                  {getSortIcon("price")}
                </div>
              </th>
              <th>
                <div className="service-table-header-content">
                  <MapPin className="action-icon" />
                  Location & Time
                </div>
              </th>
              <th
                onClick={() => handleSort("rating")}
                className="sortable"
              >
                <div className="service-table-header-content">
                  <Star className="action-icon" />
                  Rating
                  {getSortIcon("rating")}
                </div>
              </th>
              <th>
                <div className="service-table-header-content">
                  <TrendingUp className="action-icon" />
                  Performance
                </div>
              </th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="service-table-body">
            {sortedServices.map((service, index) => (
              <tr key={service.id} className="service-table-row">
                {/* Service Details */}
                <td className="service-table-cell">
                  <div className="service-details">
                    <h4 className="service-name">{service.name}</h4>
                    <p className="service-description">
                      {service.description?.slice(0, 80)}
                      {service.description?.length > 80 ? "..." : ""}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="service-table-cell">
                  <span className="category-badge">{service.category}</span>
                </td>

                {/* Price */}
                <td className="service-table-cell">
                  <div className="price-container">
                    <div className="price-icon-container">
                      <DollarSign className="price-icon" />
                    </div>
                    <span className="price-amount">{formatPrice(service.price)}</span>
                  </div>
                </td>

                {/* Location & Duration */}
                <td className="service-table-cell">
                  <div className="location-duration">
                    <div className="location-item">
                      <MapPin className="location-icon" />
                      <span>{service.location}</span>
                    </div>
                    <div className="duration-item">
                      <Clock className="duration-icon" />
                      <span>{service.duration} minutes</span>
                    </div>
                  </div>
                </td>

                {/* Rating */}
                <td className="service-table-cell">
                  <div className="rating-container">
                    <div className="rating-stars">
                      <Star className="rating-star" />
                      <span className="rating-value">
                        {service.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <span className="rating-count">
                      ({service.reviewCount || 0} reviews)
                    </span>
                  </div>
                </td>

                {/* Performance */}
                <td className="service-table-cell">
                  <div className="performance-metrics">
                    <div className="performance-item performance-bookings">
                      <Calendar className="performance-icon bookings" />
                      <span>{service.bookingsThisWeek} bookings</span>
                    </div>
                    <div className="performance-item performance-revenue">
                      <TrendingUp className="performance-icon revenue" />
                      <span>{formatPrice(service.revenue)} revenue</span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="service-table-cell">
                  {(() => {
                    const statusConfig = getStatusConfig(service.status);
                    return (
                      <span className={`status-badge ${service.status}`}>
                        <span className={`status-dot ${service.status}`}></span>
                        <span>{service.status}</span>
                      </span>
                    );
                  })()}
                </td>

                {/* Actions */}
                <td className="service-table-cell">
                  <div className="actions-container">
                    <button
                      onClick={() => onEdit(service.id)}
                      className="action-button edit"
                      title="Edit Service"
                    >
                      <Edit className="action-icon" />
                    </button>
                    
                    <button
                      onClick={() => onToggleStatus(service.id, service.status)}
                      className={`action-button ${
                        service.status === "active" ? "toggle-active" : "toggle-inactive"
                      }`}
                      title={`${
                        service.status === "active" ? "Deactivate" : "Activate"
                      } Service`}
                    >
                      {service.status === "active" ? (
                        <ToggleRight className="action-icon" />
                      ) : (
                        <ToggleLeft className="action-icon" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => onDelete(service.id)}
                      className="action-button delete"
                      title="Delete Service"
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Summary Bar */}
      <div className="service-table-summary">
        <div className="summary-left">
          <span className="summary-stat">
            Total Services: <span className="summary-stat-value">{services.length}</span>
          </span>
          <span className="summary-stat">
            Active: <span className="summary-stat-value active">
              {services.filter(s => s.status === 'active').length}
            </span>
          </span>
          <span className="summary-stat">
            Inactive: <span className="summary-stat-value inactive">
              {services.filter(s => s.status === 'inactive').length}
            </span>
          </span>
        </div>
        <div className="summary-right">
          <TrendingUp className="summary-icon" />
          <span className="summary-avg-rating">
            Avg Rating: {(services.reduce((acc, s) => acc + (s.rating || 0), 0) / services.length).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceListingsTable;