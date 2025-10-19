import React, { useState, useEffect } from "react";
import {
  Car,
  Search,
  Filter,
  Calendar,
  FileText,
  Wrench,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  Edit3,
  Download,
  BarChart3,
  Activity,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4A628A", "#7AB2D3", "#B9E5E8", "#DFF2EB", "#FF6F61"];
import "./VehicleHistoryDashboard.css";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";

const VehicleHistoryDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false); // Changed to false to show demo data initially
  const [dashboardData, setDashboardData] = useState({
    dashboardStats: {
      totalVehiclesServiced: 1247,
      totalServices: 3891,
      totalRevenue: 2875000,
      averageServiceValue: 18500,
      monthlyGrowth: 12.5,
      customerSatisfaction: 4.7,
      repeatCustomers: 68,
      pendingServices: 23,
    },
    serviceCategories: [
      { name: "Regular Service", count: 145, revenue: 2262500, percentage: 37.2 },
      { name: "Brake Service", count: 89, revenue: 1068000, percentage: 22.9 },
      { name: "Engine Repair", count: 67, revenue: 1675000, percentage: 17.2 }
    ],
    monthlyData: [
      { month: "Jan", services: 287, revenue: 4350000 },
      { month: "Feb", services: 312, revenue: 4680000 },
      { month: "Mar", services: 298, revenue: 4470000 },
      { month: "Apr", services: 334, revenue: 5010000 },
      { month: "May", services: 356, revenue: 5340000 },
      { month: "Jun", services: 389, revenue: 5835000 }
    ]
  });
  
  const [recentServicesData, setRecentServicesData] = useState([
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
    }
  ]);
  
  const [topVehiclesData, setTopVehiclesData] = useState([
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
    }
  ]);
  
  const [analyticsData, setAnalyticsData] = useState({
    performanceMetrics: {
      averageServiceTime: 2.5,
      serviceCompletionRate: 96.8,
      firstTimeFixRate: 89.2,
      customerReturnRate: 68.4
    },
    topTechnicians: [
      {
        technicianName: "Samantha Silva",
        totalServices: 156,
        averageRating: 4.9
      },
      {
        technicianName: "Nuwan Perera",
        totalServices: 142,
        averageRating: 4.7
      },
      {
        technicianName: "Kasun Rajapaksa",
        totalServices: 128,
        averageRating: 4.6
      }
    ],
    revenueAnalysis: {
      averageServiceValue: 18500,
      highestValueService: 85000,
      mostProfitableCategory: "Engine Repair",
      revenuePerVehicle: 23500
    },
    serviceTrends: [
      {
        serviceName: "Brake Services",
        totalServices: 23
      },
      {
        serviceName: "Engine Repairs",
        totalServices: 18
      },
      {
        serviceName: "Oil Changes",
        totalServices: 15
      }
    ]
  });
  
  const [apiError, setApiError] = useState(false);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      
      const [statsResponse, servicesResponse, vehiclesResponse, analyticsResponse] = await Promise.all([
        axios.get(`/vehicle-history/dashboard-stats?timeRange=${selectedTimeRange}`),
        axios.get(`/vehicle-history/recent-services?page=1&limit=10&status=${filterStatus}`),
        axios.get('/vehicle-history/top-vehicles?limit=10'),
        axios.get(`/vehicle-history/analytics?timeRange=${selectedTimeRange}`)
      ]);
      
      console.log('Dashboard stats response:', statsResponse.data);
      console.log('Services response:', servicesResponse.data);
      console.log('Vehicles response:', vehiclesResponse.data);
      console.log('Analytics response:', analyticsResponse.data);
      
      setDashboardData(statsResponse.data.data);
      setRecentServicesData(servicesResponse.data.data.services);
      setTopVehiclesData(vehiclesResponse.data.data.vehicles);
      setAnalyticsData(analyticsResponse.data.data);
      
      console.log('Data set successfully');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setApiError(true);
      toast.error('Using demo data - API not available: ' + (error.response?.data?.message || error.message));
      
      // Set mock data for testing if API fails
      setDashboardData({
        dashboardStats: {
          totalVehiclesServiced: 1247,
          totalServices: 3891,
          totalRevenue: 2875000,
          averageServiceValue: 18500,
          monthlyGrowth: 12.5,
          customerSatisfaction: 4.7,
          repeatCustomers: 68,
          pendingServices: 23,
        },
        serviceCategories: [
          { name: "Regular Service", count: 145, revenue: 2262500, percentage: 37.2 },
          { name: "Brake Service", count: 89, revenue: 1068000, percentage: 22.9 },
          { name: "Engine Repair", count: 67, revenue: 1675000, percentage: 17.2 }
        ],
        monthlyData: [
          { month: "Jan", services: 287, revenue: 4350000 },
          { month: "Feb", services: 312, revenue: 4680000 },
          { month: "Mar", services: 298, revenue: 4470000 }
        ]
      });
      
      setRecentServicesData([
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
        }
      ]);
      
      setTopVehiclesData([
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
        }
      ]);
      
      setAnalyticsData({
        performanceMetrics: {
          averageServiceTime: 2.5,
          serviceCompletionRate: 96.8,
          firstTimeFixRate: 89.2,
          customerReturnRate: 68.4
        },
        topTechnicians: [
          {
            technicianName: "Samantha Silva",
            totalServices: 156,
            averageRating: 4.9
          }
        ],
        revenueAnalysis: {
          averageServiceValue: 18500,
          highestValueService: 85000,
          mostProfitableCategory: "Engine Repair",
          revenuePerVehicle: 23500
        },
        serviceTrends: [
          {
            serviceName: "Brake Services",
            totalServices: 23
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to fetch real data, but fallback to demo data if it fails
    // For now, comment out to show demo data
    // fetchDashboardData();
    
    // Uncomment the line below to enable real API calls
    fetchDashboardData();
  }, [selectedTimeRange, filterStatus]);

  // Get dashboard stats from API data
  const dashboardStats = dashboardData?.dashboardStats || {
    totalVehiclesServiced: 0,
    totalServices: 0,
    totalRevenue: 0,
    averageServiceValue: 0,
    monthlyGrowth: 0,
    customerSatisfaction: 0,
    repeatCustomers: 0,
    pendingServices: 0,
  };

  // Use data from API
  const recentServices = recentServicesData;

  // Use data from API
  const topVehicles = topVehiclesData;

  // Use data from API
  const serviceCategories = dashboardData?.serviceCategories || [];

  // Use data from API
  const monthlyData = dashboardData?.monthlyData || [];

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
    return `Rs. ${Number(amount).toLocaleString()}`;
  };

  const handleTimeRangeChange = (newTimeRange) => {
    setSelectedTimeRange(newTimeRange);
  };

  const handleStatusFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
  };

  // Handle action functions
  const onView = (serviceId) => {
    console.log('View service:', serviceId);
    // Implement view functionality
  };

  const onEdit = (serviceId) => {
    console.log('Edit service:', serviceId);
    // Implement edit functionality
  };

  const onDownload = (serviceId) => {
    console.log('Download service:', serviceId);
    // Implement download functionality
  };

  if (loading) {
    return (
      <div className="vehicle-history-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // --- TABS CONTENT ---
  const renderOverviewTab = () => (
    <div className="overview-content">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon vehicles">
            <Car />
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
            <Wrench />
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalServices.toLocaleString()}</h3>
            <p>Total Services</p>
            <span className="stat-change positive">+156 from last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign />
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
            <Users />
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
        {/* Revenue Bar Chart */}
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3>Monthly Revenue Trend</h3>
            <div className="chart-actions">
              <button className="btn-icon" aria-label="Bar Chart">
                <BarChart3 />
              </button>
              <button className="btn-icon" aria-label="Download">
                <Download />
              </button>
            </div>
          </div>
          <div className="chart-content" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#4A628A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Categories Pie Chart */}
        <div className="chart-card service-distribution">
          <div className="chart-header">
            <h3>Service Categories</h3>
            <div className="chart-actions">
              <button className="btn-icon" aria-label="Pie Chart">
                <PieChart />
              </button>
              <button className="btn-icon" aria-label="Download">
                <Download />
              </button>
            </div>
          </div>
          <div className="chart-content" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceCategories}
                  dataKey="percentage"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {serviceCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="recent-services-section">
        <div className="section-header">
          <h3>Recent Services</h3>
          <button className="btn btn-primary">
            <Plus />
            Add Service Record
          </button>
        </div>
        <div className="services-table" style={{ textTransform: "uppercase" }}>
          <div className="table-header">
            <div className="table-cell">Vehicle</div>
            <div className="table-cell">Service</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Amount</div>
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
            <Search />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">
            <ExternalLink />
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
                <Car />
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
                <Users />
                <span>{vehicle.customerName}</span>
              </div>
              <div className="vehicle-actions">
                <button className="btn-icon" aria-label="View">
                  <Eye />
                </button>
                <button className="btn-icon" aria-label="History">
                  <FileText />
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
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="form-select"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="btn btn-primary">
            <RefreshCw />
            Refresh
          </button>
        </div>
      </div>
      <div className="analytics-grid">
        <div className="analytics-card performance">
          <div className="card-header">
            <h4>Performance Metrics</h4>
            <TrendingUp />
          </div>
          <div className="metrics-list">
            <div className="metric-item">
              <span className="metric-label">Average Service Time</span>
              <span className="metric-value">{analyticsData?.performanceMetrics?.averageServiceTime || 0} hours</span>
              <span className="metric-trend positive">-15min</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Service Completion Rate</span>
              <span className="metric-value">{analyticsData?.performanceMetrics?.serviceCompletionRate || 0}%</span>
              <span className="metric-trend positive">+2.1%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">First-time Fix Rate</span>
              <span className="metric-value">{analyticsData?.performanceMetrics?.firstTimeFixRate || 0}%</span>
              <span className="metric-trend positive">+1.5%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Customer Return Rate</span>
              <span className="metric-value">{analyticsData?.performanceMetrics?.customerReturnRate || 0}%</span>
              <span className="metric-trend positive">+5.2%</span>
            </div>
          </div>
        </div>
        <div className="analytics-card technician-performance">
          <div className="card-header">
            <h4>Top Performing Technicians</h4>
            <Users />
          </div>
          <div className="technician-list">
            {analyticsData?.topTechnicians?.map((technician, index) => (
              <div key={index} className="technician-item">
                <div className="technician-info">
                  <span className="technician-name">{technician.technicianName}</span>
                  <span className="technician-services">{technician.totalServices} services</span>
                </div>
                <div className="technician-rating">
                  <span className="rating">{technician.averageRating}</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width: `${(technician.averageRating / 5) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="no-data">No technician data available</div>
            )}
          </div>
        </div>
        <div className="analytics-card revenue-analysis">
          <div className="card-header">
            <h4>Revenue Analysis</h4>
            <DollarSign />
          </div>
          <div className="revenue-metrics">
            <div className="revenue-item">
              <span className="revenue-label">Average Service Value</span>
              <span className="revenue-value">
                {formatCurrency(analyticsData?.revenueAnalysis?.averageServiceValue || dashboardStats.averageServiceValue)}
              </span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Highest Value Service</span>
              <span className="revenue-value">{formatCurrency(analyticsData?.revenueAnalysis?.highestValueService || 0)}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Most Profitable Category</span>
              <span className="revenue-value">{analyticsData?.revenueAnalysis?.mostProfitableCategory || "N/A"}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Revenue per Vehicle</span>
              <span className="revenue-value">{formatCurrency(analyticsData?.revenueAnalysis?.revenuePerVehicle || 0)}</span>
            </div>
          </div>
        </div>
        <div className="analytics-card service-trends">
          <div className="card-header">
            <h4>Service Trends</h4>
            <Activity />
          </div>
          <div className="trends-list">
            {analyticsData?.serviceTrends?.slice(0, 3).map((trend, index) => (
              <div key={index} className="trend-item">
                <div className="trend-info">
                  <span className="trend-title">{trend.serviceName}</span>
                  <span className="trend-period">Last {selectedTimeRange.replace('days', ' days').replace('1year', ' year')}</span>
                </div>
                <div className="trend-change positive">
                  <span>{trend.totalServices} services</span>
                  <TrendingUp />
                </div>
              </div>
            )) || (
              <div className="no-data">No service trend data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 />,
    },
    { id: "vehicles", label: "Vehicles", icon: <Car /> },
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp />,
    },
  ];

  return (
    <div className="vehicle-history-dashboard">
      {/* API Status Banner */}
      {apiError && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '10px 20px',
          margin: '10px 20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          ⚠️ Currently showing demo data - API connection unavailable
        </div>
      )}
      
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="page-title">
            <Activity />
            <span>Vehicle Service History Dashboard</span>
          </div>

        </div>
        <div className="header-actions">
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="timeRange">Time Range:</label>
              <select
                id="timeRange"
                value={selectedTimeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
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
              <label htmlFor="statusFilter">Status:</label>
              <select
                id="statusFilter"
                value={filterStatus}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
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
              <Download />
              Export Report
            </button>
            <button className="btn btn-primary">
              <Plus />
              Add Service
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="dashboard-navigation">
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "vehicles" && renderVehiclesTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default VehicleHistoryDashboard;
