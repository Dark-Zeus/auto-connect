// src/components/ServiceProvider/ServiceListingsTable.jsx
import React, { useState, useMemo } from "react";
import {
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Clock,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";
import AdaptivePaginatableTable from "@components/atoms/AdaptivePaginatableTable";

const ServiceListingsTable = ({
  services = [],
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination] = useState(10);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(services.map((service) => service.category)),
    ];
    return uniqueCategories.filter(Boolean).sort();
  }, [services]);

  // Filter and search services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          (service.status === "active" || service.isActive)) ||
        (statusFilter === "inactive" &&
          (service.status === "inactive" || !service.isActive));

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [services, searchTerm, statusFilter, categoryFilter]);

  // Table headers configuration
  const headers = [
    {
      colKey: "serviceInfo",
      label: "Service Information",
      icon: "build",
      visible: true,
      container: (value, row) => (
        <div className="tw:flex tw:flex-col tw:space-y-1">
          <div className="tw:flex tw:items-center tw:space-x-2">
            <span className="tw:font-semibold tw:text-gray-900 tw:text-sm">
              {row.serviceType}
            </span>
            {row.tags && row.tags.length > 0 && (
              <span className="tw:bg-blue-100 tw:text-blue-700 tw:px-2 tw:py-0.5 tw:rounded-full tw:text-xs">
                {row.tags[0]}
              </span>
            )}
          </div>
          <span className="tw:text-xs tw:text-gray-600 tw:bg-gray-100 tw:px-2 tw:py-0.5 tw:rounded tw:inline-block tw:w-fit">
            {row.category}
          </span>
          <span className="tw:text-sm tw:text-gray-500 tw:line-clamp-2">
            {row.description?.substring(0, 80)}
            {row.description?.length > 80 ? "..." : ""}
          </span>
        </div>
      ),
    },
    {
      colKey: "pricing",
      label: "Pricing",
      icon: "attach_money",
      visible: true,
      container: (value, row) => (
        <div className="tw:flex tw:flex-col tw:space-y-1">
          <div className="tw:flex tw:items-center tw:space-x-1">
            <DollarSign className="tw:h-4 tw:w-4 tw:text-green-600" />
            <span className="tw:font-semibold tw:text-gray-900 tw:text-sm">
              Rs. {row.minPrice?.toLocaleString()} - Rs.{" "}
              {row.maxPrice?.toLocaleString()}
            </span>
          </div>
          {row.priceNote && (
            <span className="tw:text-xs tw:text-gray-500 tw:italic">
              {row.priceNote}
            </span>
          )}
          <span className="tw:text-xs tw:text-green-600 tw:font-medium">
            Avg: Rs.{" "}
            {row.avgPrice
              ? row.avgPrice.toLocaleString()
              : Math.round((row.minPrice + row.maxPrice) / 2).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      colKey: "timeInfo",
      label: "Duration & Availability",
      icon: "schedule",
      visible: true,
      container: (value, row) => (
        <div className="tw:flex tw:flex-col tw:space-y-1">
          <div className="tw:flex tw:items-center tw:space-x-2">
            <Clock className="tw:h-4 tw:w-4 tw:text-blue-600" />
            <span className="tw:text-gray-900 tw:font-medium tw:text-sm">
              {row.duration}
            </span>
          </div>
          <div className="tw:flex tw:items-center tw:space-x-2">
            <Calendar className="tw:h-4 tw:w-4 tw:text-orange-600" />
            <span className="tw:text-sm tw:text-gray-600">
              {row.availableSlots?.today || 0} slots today
            </span>
          </div>
          {row.availableSlots?.nextSlot && (
            <span className="tw:text-xs tw:text-orange-600 tw:font-medium">
              Next: {row.availableSlots.nextSlot}
            </span>
          )}
          {row.warrantyPeriod && (
            <span className="tw:text-xs tw:text-purple-600 tw:bg-purple-50 tw:px-2 tw:py-0.5 tw:rounded">
              Warranty: {row.warrantyPeriod}
            </span>
          )}
        </div>
      ),
    },
    {
      colKey: "performance",
      label: "Performance",
      icon: "trending_up",
      visible: true,
      container: (value, row) => (
        <div className="tw:flex tw:flex-col tw:space-y-1">
          {row.rating && (
            <div className="tw:flex tw:items-center tw:space-x-1">
              <Star className="tw:h-4 tw:w-4 tw:text-yellow-500 tw:fill-current" />
              <span className="tw:font-semibold tw:text-gray-900 tw:text-sm">
                {row.rating.average?.toFixed(1) || "N/A"}
              </span>
              <span className="tw:text-xs tw:text-gray-500">
                ({row.rating.totalReviews || 0} reviews)
              </span>
            </div>
          )}
          <div className="tw:text-xs tw:text-gray-600">
            <div>Bookings: {row.totalBookings || 0}</div>
            <div>Completed: {row.completedBookings || 0}</div>
          </div>
          {row.popularityScore && (
            <div className="tw:text-xs tw:text-blue-600 tw:font-medium">
              Popularity: {row.popularityScore}%
            </div>
          )}
        </div>
      ),
    },
    {
      colKey: "status",
      label: "Status",
      icon: "info",
      visible: true,
      container: (value, row) => {
        const isActive = row.status === "active" || row.isActive;
        return (
          <div className="tw:flex tw:flex-col tw:space-y-2">
            <span
              className={`tw:inline-flex tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:rounded-full ${
                isActive
                  ? "tw:bg-green-100 tw:text-green-800"
                  : "tw:bg-red-100 tw:text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>

            <div className="tw:text-xs tw:text-gray-500">
              <div>Created: {new Date(row.createdAt).toLocaleDateString()}</div>
              {row.updatedAt !== row.createdAt && (
                <div>
                  Updated: {new Date(row.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {row.lastBooking && (
              <div className="tw:text-xs tw:text-blue-600">
                Last booking: {new Date(row.lastBooking).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      colKey: "actions",
      label: "Actions",
      icon: "settings",
      visible: true,
      container: (value, row) => (
        <div className="tw:flex tw:flex-col tw:space-y-2">
          {/* Primary Actions */}
          <div className="tw:flex tw:space-x-1">
            {onView && (
              <button
                onClick={() => onView(row._id)}
                className="tw:text-indigo-600 hover:tw:text-indigo-900 tw:p-1.5 tw:rounded tw:transition-colors tw:hover:tw:bg-indigo-50"
                title="View Details"
              >
                <Eye className="tw:h-4 tw:w-4" />
              </button>
            )}

            <button
              onClick={() => onEdit(row._id)}
              className="tw:text-blue-600 hover:tw:text-blue-900 tw:p-1.5 tw:rounded tw:transition-colors tw:hover:tw:bg-blue-50"
              title="Edit Service"
            >
              <Edit className="tw:h-4 tw:w-4" />
            </button>

            <button
              onClick={() =>
                onToggleStatus(
                  row._id,
                  row.status || (row.isActive ? "active" : "inactive")
                )
              }
              className={`tw:p-1.5 tw:rounded tw:transition-colors ${
                row.status === "active" || row.isActive
                  ? "tw:text-orange-600 hover:tw:text-orange-900 tw:hover:tw:bg-orange-50"
                  : "tw:text-green-600 hover:tw:text-green-900 tw:hover:tw:bg-green-50"
              }`}
              title={
                row.status === "active" || row.isActive
                  ? "Deactivate Service"
                  : "Activate Service"
              }
            >
              {row.status === "active" || row.isActive ? (
                <ToggleRight className="tw:h-4 tw:w-4" />
              ) : (
                <ToggleLeft className="tw:h-4 tw:w-4" />
              )}
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="tw:flex tw:space-x-1">
            <button
              onClick={() => onDelete(row._id)}
              className="tw:text-red-600 hover:tw:text-red-900 tw:p-1.5 tw:rounded tw:transition-colors tw:hover:tw:bg-red-50"
              title="Delete Service"
            >
              <Trash2 className="tw:h-4 tw:w-4" />
            </button>

            {/* Quick Stats Button */}
            <button
              className="tw:text-gray-600 hover:tw:text-gray-900 tw:p-1.5 tw:rounded tw:transition-colors tw:hover:tw:bg-gray-50"
              title="View Analytics"
              onClick={() => console.log("Analytics for:", row._id)}
            >
              <div className="tw:text-xs tw:font-medium">Stats</div>
            </button>
          </div>
        </div>
      ),
    },
  ];

  // Advanced filters component
  const filters = (
    <div className="tw:flex tw:flex-col lg:tw:flex-row tw:space-y-3 lg:tw:space-y-0 lg:tw:space-x-4 tw:items-start lg:tw:items-center">
      {/* Search Input */}
      <div className="tw:flex-1 tw:min-w-0">
        <input
          type="text"
          placeholder="Search services, descriptions, or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
        />
      </div>

      {/* Status Filter */}
      <div className="tw:w-full lg:tw:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="tw:w-full lg:tw:w-auto tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="tw:w-full lg:tw:w-auto">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="tw:w-full lg:tw:w-auto tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Results Counter */}
      <div className="tw:text-sm tw:text-gray-600 tw:whitespace-nowrap">
        {filteredServices.length} of {services.length} services
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:items-center tw:py-12">
        <div className="tw:flex tw:flex-col tw:items-center tw:space-y-4">
          <div className="tw:animate-spin tw:rounded-full tw:h-12 tw:w-12 tw:border-b-2 tw:border-blue-600"></div>
          <div className="tw:text-gray-600 tw:text-lg">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tw:w-full">
      {/* Quick Stats Bar */}
      {services.length > 0 && (
        <div className="tw:mb-6 tw:grid tw:grid-cols-2 md:tw:grid-cols-4 tw:gap-4">
          <div className="tw:bg-green-50 tw:p-3 tw:rounded-lg tw:text-center">
            <div className="tw:text-lg tw:font-bold tw:text-green-600">
              {
                services.filter((s) => s.status === "active" || s.isActive)
                  .length
              }
            </div>
            <div className="tw:text-xs tw:text-green-700">Active Services</div>
          </div>
          <div className="tw:bg-blue-50 tw:p-3 tw:rounded-lg tw:text-center">
            <div className="tw:text-lg tw:font-bold tw:text-blue-600">
              {Math.round(
                (services.reduce(
                  (acc, s) => acc + (s.rating?.average || 0),
                  0
                ) /
                  services.length) *
                  10
              ) / 10 || 0}
            </div>
            <div className="tw:text-xs tw:text-blue-700">Avg Rating</div>
          </div>
          <div className="tw:bg-purple-50 tw:p-3 tw:rounded-lg tw:text-center">
            <div className="tw:text-lg tw:font-bold tw:text-purple-600">
              {services.reduce((acc, s) => acc + (s.totalBookings || 0), 0)}
            </div>
            <div className="tw:text-xs tw:text-purple-700">Total Bookings</div>
          </div>
          <div className="tw:bg-orange-50 tw:p-3 tw:rounded-lg tw:text-center">
            <div className="tw:text-lg tw:font-bold tw:text-orange-600">
              Rs.{" "}
              {Math.round(
                services.reduce(
                  (acc, s) => acc + (s.minPrice + s.maxPrice) / 2,
                  0
                ) / services.length
              ).toLocaleString() || 0}
            </div>
            <div className="tw:text-xs tw:text-orange-700">Avg Price</div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <AdaptivePaginatableTable
        title="Service Listings"
        subtitle={`Manage your ${filteredServices.length} service offerings`}
        headers={headers}
        data={filteredServices}
        numbered={true}
        pagination={pagination}
        page={page}
        setPage={setPage}
        filters={filters}
        filterWidth="600"
        defaultColumnVisibility={true}
        isCollapsible={false}
        isSettingsBtn={true}
        isExportBtn={true}
        containInPage={false}
        onReportBtnClick={() => {
          // Export functionality
          const csvData = filteredServices.map((service) => ({
            "Service Type": service.serviceType,
            Category: service.category,
            "Min Price": service.minPrice,
            "Max Price": service.maxPrice,
            Duration: service.duration,
            Status:
              service.status || (service.isActive ? "active" : "inactive"),
            Rating: service.rating?.average || "N/A",
            "Total Bookings": service.totalBookings || 0,
            "Created Date": new Date(service.createdAt).toLocaleDateString(),
          }));

          // Simple CSV export
          const csvContent = [
            Object.keys(csvData[0] || {}).join(","),
            ...csvData.map((row) => Object.values(row).join(",")),
          ].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `services-export-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        }}
      />

      {/* Empty State */}
      {filteredServices.length === 0 && !loading && (
        <div className="tw:text-center tw:py-12 tw:bg-gray-50 tw:rounded-lg tw:mt-4">
          <div className="tw:mb-4">
            {searchTerm ||
            statusFilter !== "all" ||
            categoryFilter !== "all" ? (
              <>
                <div className="tw:text-4xl tw:mb-4">🔍</div>
                <p className="tw:text-gray-500 tw:text-lg tw:mb-2">
                  No services match your search criteria
                </p>
                <p className="tw:text-gray-400 tw:text-sm tw:mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="tw:text-blue-600 hover:tw:text-blue-800 tw:font-medium tw:underline"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <div className="tw:text-4xl tw:mb-4">📝</div>
                <p className="tw:text-gray-500 tw:text-lg tw:mb-2">
                  No services available
                </p>
                <p className="tw:text-gray-400 tw:text-sm">
                  Start by adding your first service offering
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Table Footer with Additional Info */}
      {filteredServices.length > 0 && (
        <div className="tw:mt-4 tw:p-4 tw:bg-gray-50 tw:rounded-lg tw:text-sm tw:text-gray-600">
          <div className="tw:flex tw:flex-col md:tw:flex-row tw:justify-between tw:items-start md:tw:items-center tw:space-y-2 md:tw:space-y-0">
            <div>
              Showing {(page - 1) * pagination + 1} to{" "}
              {Math.min(page * pagination, filteredServices.length)} of{" "}
              {filteredServices.length} services
            </div>
            <div className="tw:flex tw:items-center tw:space-x-4">
              <span>
                Active:{" "}
                {
                  filteredServices.filter(
                    (s) => s.status === "active" || s.isActive
                  ).length
                }
              </span>
              <span>•</span>
              <span>Categories: {categories.length}</span>
              <span>•</span>
              <span>
                Last updated:{" "}
                {services.length > 0
                  ? new Date(
                      Math.max(
                        ...services.map(
                          (s) => new Date(s.updatedAt || s.createdAt)
                        )
                      )
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListingsTable;
