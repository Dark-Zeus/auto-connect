import React, { useState, useEffect } from "react";
import {
  Car,
  Search,
  Filter,
  Calendar,
  FileText,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  Edit3,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import "./VehicleHistoryDashboard.css";

const VehicleHistoryDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API calls
  const dashboardStats = {
    totalVehiclesServiced: 1247,
    totalServices: 3891,
    totalRevenue: 2875000,
    averageServiceValue: 18500,
    monthlyGrowth: 12.5,
    customerSatisfaction: 4.7,
    repeatCustomers: 68,
    pendingServices: 23,
  };

  const recentServices = [
    {
      id: "SRV001",
      vehicleReg: "CAB-1234",
      vehicleInfo: "2020 Toyota Prius",
      serviceType: "Regular Service",
      date: "2024-07-12",
      status: "completed",
      cost: 15500,
      customer: "John Perera",
      technician: "Samantha Silva",
      nextService: "2024-10-12",
    },
    {
      id: "SRV002",
      vehicleReg: "KL-5678",
      vehicleInfo: "2019 Honda Civic",
      serviceType: "Brake Service",
      date: "2024-07-11",
      status: "in-progress",
      cost: 12000,
      customer: "Maria Fernando",
      technician: "Nuwan Perera",
      nextService: "2024-12-11",
    },
    {
      id: "SRV003",
      vehicleReg: "ABC-9012",
      vehicleInfo: "2021 Suzuki Alto",
      serviceType: "Oil Change",
      date: "2024-07-10",
      status: "completed",
      cost: 5500,
      customer: "David Silva",
      technician: "Kasun Rajapaksa",
      nextService: "2024-10-10",
    },
  ];

  const topVehicles = [
    {
      registration: "CAB-1234",
      make: "Toyota",
      model: "Prius",
      year: 2020,
      totalServices: 8,
      totalSpent: 124000,
      lastService: "2024-07-12",
      customerName: "John Perera",
      status: "regular",
    },
    {
      registration: "KL-5678",
      make: "Honda",
      model: "Civic",
      year: 2019,
      totalServices: 12,
      totalSpent: 189000,
      lastService: "2024-07-11",
      customerName: "Maria Fernando",
      status: "vip",
    },
    {
      registration: "ABC-9012",
      make: "Suzuki",
      model: "Alto",
      year: 2021,
      totalServices: 5,
      totalSpent: 67500,
      lastService: "2024-07-10",
      customerName: "David Silva",
      status: "new",
    },
  ];

  const serviceCategories = [
    { name: "Regular Service", count: 145, revenue: 2262500, percentage: 37.2 },
    { name: "Brake Service", count: 89, revenue: 1068000, percentage: 22.9 },
    { name: "Engine Repair", count: 67, revenue: 1675000, percentage: 17.2 },
    { name: "Transmission", count: 45, revenue: 1125000, percentage: 11.6 },
    { name: "Electrical", count: 38, revenue: 570000, percentage: 9.8 },
    { name: "Other", count: 27, revenue: 405000, percentage: 6.9 },
  ];

  const monthlyData = [
    { month: "Jan", services: 287, revenue: 4350000 },
    { month: "Feb", services: 312, revenue: 4680000 },
    { month: "Mar", services: 298, revenue: 4470000 },
    { month: "Apr", services: 334, revenue: 5010000 },
    { month: "May", services: 356, revenue: 5340000 },
    { month: "Jun", services: 389, revenue: 5835000 },
  ];

  const timeRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "1year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const statusOptions = [
    { value: "all", label: "All Services" },
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In Progress" },
    { value: "scheduled", label: "Scheduled" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "scheduled":
        return "info";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  const getCustomerStatusColor = (status) => {
    switch (status) {
      case "vip":
        return "gold";
      case "regular":
        return "blue";
      case "new":
        return "green";
      default:
        return "gray";
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const renderOverviewTab = () => (
    <div className="overview-content">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon vehicles">
            <Car className="w-6 h-6" />
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalVehiclesServiced.toLocaleString()}</h3>
            <p>Vehicles Serviced</p>
            <span className="stat-change positive">
              +{dashboardStats.monthlyGrowth}% this month
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon services">
            <Wrench className="w-6 h-6" />
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalServices.toLocaleString()}</h3>
            <p>Total Services</p>
            <span className="stat-change positive">+156 from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(dashboardStats.totalRevenue)}</h3>
            <p>Total Revenue</p>
            <span className="stat-change positive">
              +{dashboardStats.monthlyGrowth}% growth
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon satisfaction">
            <Users className="w-6 h-6" />
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.customerSatisfaction}/5</h3>
            <p>Customer Satisfaction</p>
            <span className="stat-change positive">
              {dashboardStats.repeatCustomers}% repeat customers
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3>Monthly Revenue Trend</h3>
            <div className="chart-actions">
              <button className="btn-icon">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button className="btn-icon">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="revenue-chart-display">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="chart-bar">
                  <div
                    className="bar"
                    style={{
                      height: `${(data.revenue / 6000000) * 100}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  ></div>
                  <span className="bar-label">{data.month}</span>
                  <span className="bar-value">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card service-distribution">
          <div className="chart-header">
            <h3>Service Categories</h3>
            <div className="chart-actions">
              <button className="btn-icon">
                <PieChart className="w-4 h-4" />
              </button>
              <button className="btn-icon">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="service-categories">
              {serviceCategories.map((category, index) => (
                <div key={category.name} className="category-item">
                  <div className="category-info">
                    <div className="category-header">
                      <span className="category-name">{category.name}</span>
                      <span className="category-percentage">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="category-details">
                      <span>{category.count} services</span>
                      <span>{formatCurrency(category.revenue)}</span>
                    </div>
                  </div>
                  <div className="category-bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${category.percentage}%`,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="recent-services-section">
        <div className="section-header">
          <h3>Recent Services</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Service Record
          </button>
        </div>
        <div className="services-table">
          <div className="table-header">
            <div className="table-cell">Vehicle</div>
            <div className="table-cell">Service</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Amount</div>
            <div className="table-cell">Actions</div>
          </div>
          {recentServices.map((service) => (
            <div key={service.id} className="table-row">
              <div className="table-cell vehicle-info">
                <div className="vehicle-details">
                  <span className="vehicle-reg">{service.vehicleReg}</span>
                  <span className="vehicle-model">{service.vehicleInfo}</span>
                  <span className="customer-name">{service.customer}</span>
                </div>
              </div>
              <div className="table-cell">
                <span className="service-type">{service.serviceType}</span>
                <span className="technician">by {service.technician}</span>
              </div>
              <div className="table-cell">
                <span className="service-date">{service.date}</span>
                <span className="next-service">
                  Next: {service.nextService}
                </span>
              </div>
              <div className="table-cell">
                <span
                  className={`status-badge ${getStatusColor(service.status)}`}
                >
                  {service.status}
                </span>
              </div>
              <div className="table-cell">
                <span className="service-cost">
                  {formatCurrency(service.cost)}
                </span>
              </div>
              <div className="table-cell actions">
                <button className="btn-icon">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="btn-icon">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="btn-icon">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVehiclesTab = () => (
    <div className="vehicles-content">
      <div className="vehicles-header">
        <h3>Top Vehicles by Service History</h3>
        <div className="vehicles-actions">
          <div className="search-box">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">
            <ExternalLink className="w-4 h-4" />
            View All Vehicles
          </button>
        </div>
      </div>

      <div className="vehicles-grid">
        {topVehicles.map((vehicle) => (
          <div key={vehicle.registration} className="vehicle-card">
            <div className="vehicle-header">
              <div className="vehicle-main-info">
                <h4 className="vehicle-registration">{vehicle.registration}</h4>
                <p className="vehicle-details">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                <span
                  className={`customer-status ${getCustomerStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status.toUpperCase()}
                </span>
              </div>
              <div className="vehicle-image">
                <Car className="w-8 h-8" />
              </div>
            </div>

            <div className="vehicle-stats">
              <div className="stat-item">
                <span className="stat-label">Services</span>
                <span className="stat-value">{vehicle.totalServices}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">
                  {formatCurrency(vehicle.totalSpent)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Service</span>
                <span className="stat-value">{vehicle.lastService}</span>
              </div>
            </div>

            <div className="vehicle-footer">
              <div className="customer-info">
                <Users className="w-4 h-4" />
                <span>{vehicle.customerName}</span>
              </div>
              <div className="vehicle-actions">
                <button className="btn-icon">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="btn-icon">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-content">
      <div className="analytics-header">
        <h3>Service Analytics & Insights</h3>
        <div className="analytics-controls">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="form-select"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="btn btn-primary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card performance">
          <div className="card-header">
            <h4>Performance Metrics</h4>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="metrics-list">
            <div className="metric-item">
              <span className="metric-label">Average Service Time</span>
              <span className="metric-value">2.5 hours</span>
              <span className="metric-trend positive">-15min</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Service Completion Rate</span>
              <span className="metric-value">96.8%</span>
              <span className="metric-trend positive">+2.1%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">First-time Fix Rate</span>
              <span className="metric-value">89.2%</span>
              <span className="metric-trend positive">+1.5%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Customer Return Rate</span>
              <span className="metric-value">68.4%</span>
              <span className="metric-trend positive">+5.2%</span>
            </div>
          </div>
        </div>

        <div className="analytics-card technician-performance">
          <div className="card-header">
            <h4>Top Performing Technicians</h4>
            <Users className="w-5 h-5" />
          </div>
          <div className="technician-list">
            <div className="technician-item">
              <div className="technician-info">
                <span className="technician-name">Samantha Silva</span>
                <span className="technician-services">156 services</span>
              </div>
              <div className="technician-rating">
                <span className="rating">4.9</span>
                <div className="rating-bar">
                  <div className="rating-fill" style={{ width: "98%" }}></div>
                </div>
              </div>
            </div>
            <div className="technician-item">
              <div className="technician-info">
                <span className="technician-name">Nuwan Perera</span>
                <span className="technician-services">142 services</span>
              </div>
              <div className="technician-rating">
                <span className="rating">4.7</span>
                <div className="rating-bar">
                  <div className="rating-fill" style={{ width: "94%" }}></div>
                </div>
              </div>
            </div>
            <div className="technician-item">
              <div className="technician-info">
                <span className="technician-name">Kasun Rajapaksa</span>
                <span className="technician-services">128 services</span>
              </div>
              <div className="technician-rating">
                <span className="rating">4.6</span>
                <div className="rating-bar">
                  <div className="rating-fill" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card revenue-analysis">
          <div className="card-header">
            <h4>Revenue Analysis</h4>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="revenue-metrics">
            <div className="revenue-item">
              <span className="revenue-label">Average Service Value</span>
              <span className="revenue-value">
                {formatCurrency(dashboardStats.averageServiceValue)}
              </span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Highest Value Service</span>
              <span className="revenue-value">{formatCurrency(85000)}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Most Profitable Category</span>
              <span className="revenue-value">Engine Repair</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Revenue per Vehicle</span>
              <span className="revenue-value">{formatCurrency(23500)}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card service-trends">
          <div className="card-header">
            <h4>Service Trends</h4>
            <Activity className="w-5 h-5" />
          </div>
          <div className="trends-list">
            <div className="trend-item">
              <div className="trend-info">
                <span className="trend-title">Brake Services</span>
                <span className="trend-period">Last 30 days</span>
              </div>
              <div className="trend-change positive">
                <span>+23%</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="trend-item">
              <div className="trend-info">
                <span className="trend-title">Engine Repairs</span>
                <span className="trend-period">Last 30 days</span>
              </div>
              <div className="trend-change positive">
                <span>+18%</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="trend-item">
              <div className="trend-info">
                <span className="trend-title">Oil Changes</span>
                <span className="trend-period">Last 30 days</span>
              </div>
              <div className="trend-change negative">
                <span>-5%</span>
                <TrendingUp className="w-4 h-4 rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    { id: "vehicles", label: "Vehicles", icon: <Car className="w-4 h-4" /> },
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  return (
    <div className="vehicle-history-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="page-title">
            <Activity className="w-6 h-6" />
            <span>Vehicle Service History Dashboard</span>
          </div>
          <div className="header-stats">
            <div className="quick-stat">
              <Clock className="w-4 h-4" />
              <span>{dashboardStats.pendingServices} pending services</span>
            </div>
            <div className="quick-stat">
              <CheckCircle className="w-4 h-4" />
              <span>96.8% completion rate</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="filters">
            <div className="filter-group">
              <label>Time Range:</label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="form-select"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn btn-secondary">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-navigation">
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "vehicles" && renderVehiclesTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default VehicleHistoryDashboard;
