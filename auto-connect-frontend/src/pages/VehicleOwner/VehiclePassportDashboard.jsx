import React, { useState, useEffect } from "react";
import {
  Car,
  Calendar,
  FileText,
  Shield,
  Wrench,
  Zap,
  AlertTriangle,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  Award,
  Camera,
  Phone,
  Mail,
  User,
  Building,
  Calendar as CalendarIcon,
  Info,
  Star,
  AlertCircle,
} from "lucide-react";
import "./VehiclePassportDashboard.css";

const VehiclePassportDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample vehicle data
  const [vehicleData] = useState({
    id: "V001",
    plateNumber: "ABC-1234",
    make: "Toyota",
    model: "Camry",
    year: "2019",
    color: "Silver",
    vin: "1HGBH41JXMN109186",
    engineNumber: "4G63T123456",
    currentMileage: 45000,
    registrationDate: "2019-03-15",
    owner: {
      name: "John Doe",
      phone: "+94 77 123 4567",
      email: "john.doe@email.com",
      address: "123 Main Street, Colombo 07",
    },
  });

  // Sample service records
  const [serviceRecords] = useState([
    {
      id: "SR001",
      type: "service",
      date: "2024-07-15",
      provider: "AutoCare Service Center",
      service: "Oil Change & Filter Replacement",
      mileage: 45000,
      cost: 8500,
      status: "completed",
      nextService: "2024-10-15",
      technician: "Mike Johnson",
      workOrder: "WO-2024-001234",
      parts: ["Oil Filter", "Engine Oil 5L"],
      images: 3,
      warranty: "6 months",
    },
    {
      id: "SR002",
      type: "service",
      date: "2024-06-20",
      provider: "Brake Masters",
      service: "Brake Pad Replacement",
      mileage: 44200,
      cost: 15000,
      status: "completed",
      technician: "David Wilson",
      workOrder: "WO-2024-001156",
      parts: ["Front Brake Pads", "Brake Fluid"],
      images: 5,
      warranty: "12 months",
    },
    {
      id: "SR003",
      type: "service",
      date: "2024-05-10",
      provider: "Engine Specialists",
      service: "Engine Tune-up",
      mileage: 43800,
      cost: 25000,
      status: "completed",
      technician: "Robert Smith",
      workOrder: "WO-2024-000987",
      parts: ["Spark Plugs", "Air Filter", "Fuel Filter"],
      images: 7,
      warranty: "12 months",
    },
  ]);

  const [insuranceRecords] = useState([
    {
      id: "IN001",
      type: "insurance",
      date: "2024-01-15",
      provider: "Ceylon Insurance",
      policyNumber: "POL-2024-567890",
      coverage: "Comprehensive Coverage",
      premium: 35000,
      validUntil: "2025-01-15",
      status: "active",
      agent: "Sarah Williams",
      claims: 0,
    },
    {
      id: "IN002",
      type: "insurance",
      date: "2023-01-15",
      provider: "Ceylon Insurance",
      policyNumber: "POL-2023-345678",
      coverage: "Comprehensive Coverage",
      premium: 32000,
      validUntil: "2024-01-15",
      status: "expired",
      agent: "Sarah Williams",
      claims: 1,
    },
  ]);

  const [emissionRecords] = useState([
    {
      id: "EM001",
      type: "emission",
      date: "2024-05-10",
      provider: "Environmental Test Center",
      testNumber: "ET-2024-789012",
      result: "Pass",
      validUntil: "2025-05-10",
      status: "valid",
      inspector: "Dr. Kumar Perera",
      emissions: {
        co: "0.12%",
        hc: "85 ppm",
        nox: "120 ppm",
      },
    },
    {
      id: "EM002",
      type: "emission",
      date: "2023-05-10",
      provider: "Environmental Test Center",
      testNumber: "ET-2023-567890",
      result: "Pass",
      validUntil: "2024-05-10",
      status: "expired",
      inspector: "Dr. Kumar Perera",
      emissions: {
        co: "0.14%",
        hc: "92 ppm",
        nox: "135 ppm",
      },
    },
  ]);

  const [accidentRecords] = useState([
    {
      id: "AC001",
      type: "accident",
      date: "2023-11-22",
      location: "Galle Road, Colombo 03",
      severity: "Minor",
      damage: "Front bumper scratched",
      repairCost: 25000,
      status: "repaired",
      policeReport: "PR-2023-445566",
      insuranceClaim: "CL-2023-778899",
      images: 8,
    },
  ]);

  // Tab configuration
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Activity,
      count: null,
      color: "#7AB2D3",
    },
    {
      id: "service",
      label: "Service & Maintenance",
      icon: Wrench,
      count: serviceRecords.length,
      color: "#16a34a",
    },
    {
      id: "insurance",
      label: "Insurance",
      icon: Shield,
      count: insuranceRecords.length,
      color: "#2563eb",
    },
    {
      id: "emission",
      label: "Emission Tests",
      icon: Zap,
      count: emissionRecords.length,
      color: "#eab308",
    },
    {
      id: "accidents",
      label: "Accidents & Claims",
      icon: AlertTriangle,
      count: accidentRecords.length,
      color: "#dc2626",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      count: 12,
      color: "#7c3aed",
    },
  ];

  // Status badge component
  const StatusBadge = ({ status, type = "default" }) => {
    const getStatusClass = () => {
      switch (status.toLowerCase()) {
        case "completed":
        case "active":
        case "valid":
        case "pass":
        case "repaired":
          return "status-badge status-success";
        case "pending":
        case "scheduled":
          return "status-badge status-warning";
        case "expired":
        case "failed":
        case "cancelled":
          return "status-badge status-error";
        default:
          return "status-badge status-default";
      }
    };

    return <span className={getStatusClass()}>{status}</span>;
  };

  // Record card component
  const RecordCard = ({ record, type }) => {
    const getTypeIcon = () => {
      switch (type) {
        case "service":
          return <Wrench size={20} className="record-icon service-icon" />;
        case "insurance":
          return <Shield size={20} className="record-icon insurance-icon" />;
        case "emission":
          return <Zap size={20} className="record-icon emission-icon" />;
        case "accident":
          return (
            <AlertTriangle size={20} className="record-icon accident-icon" />
          );
        default:
          return <FileText size={20} className="record-icon default-icon" />;
      }
    };

    return (
      <div className="record-card">
        {/* Header */}
        <div className="record-header">
          <div className="record-title">
            {getTypeIcon()}
            <div className="record-info">
              <h3 className="record-name">
                {record.service ||
                  record.coverage ||
                  record.result ||
                  record.severity ||
                  "Record"}
              </h3>
              <p className="record-meta">
                {record.provider} • {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <StatusBadge status={record.status} />
        </div>

        {/* Content */}
        <div className="record-content">
          {type === "service" && (
            <>
              <div className="record-field">
                <span className="field-label">Mileage</span>
                <p className="field-value">
                  {record.mileage?.toLocaleString()} km
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Cost</span>
                <p className="field-value">
                  LKR {record.cost?.toLocaleString()}
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Next Service</span>
                <p className="field-value">
                  {record.nextService
                    ? new Date(record.nextService).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Technician</span>
                <p className="field-value">{record.technician}</p>
              </div>
            </>
          )}

          {type === "insurance" && (
            <>
              <div className="record-field">
                <span className="field-label">Policy Number</span>
                <p className="field-value">{record.policyNumber}</p>
              </div>
              <div className="record-field">
                <span className="field-label">Premium</span>
                <p className="field-value">
                  LKR {record.premium?.toLocaleString()}
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Valid Until</span>
                <p className="field-value">
                  {new Date(record.validUntil).toLocaleDateString()}
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Agent</span>
                <p className="field-value">{record.agent}</p>
              </div>
            </>
          )}

          {type === "emission" && (
            <>
              <div className="record-field">
                <span className="field-label">Test Number</span>
                <p className="field-value">{record.testNumber}</p>
              </div>
              <div className="record-field">
                <span className="field-label">Valid Until</span>
                <p className="field-value">
                  {new Date(record.validUntil).toLocaleDateString()}
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Inspector</span>
                <p className="field-value">{record.inspector}</p>
              </div>
              <div className="record-field">
                <span className="field-label">CO Emissions</span>
                <p className="field-value">{record.emissions?.co}</p>
              </div>
            </>
          )}

          {type === "accident" && (
            <>
              <div className="record-field">
                <span className="field-label">Location</span>
                <p className="field-value">{record.location}</p>
              </div>
              <div className="record-field">
                <span className="field-label">Repair Cost</span>
                <p className="field-value">
                  LKR {record.repairCost?.toLocaleString()}
                </p>
              </div>
              <div className="record-field">
                <span className="field-label">Police Report</span>
                <p className="field-value">{record.policeReport}</p>
              </div>
              <div className="record-field">
                <span className="field-label">Insurance Claim</span>
                <p className="field-value">{record.insuranceClaim}</p>
              </div>
            </>
          )}
        </div>

        {/* Details Section */}
        {(record.parts || record.emissions) && (
          <div className="record-details">
            {record.parts && (
              <div className="parts-section">
                <span className="details-label">Parts Replaced</span>
                <div className="parts-list">
                  {record.parts.map((part, index) => (
                    <span key={index} className="part-tag">
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {record.emissions && (
              <div className="emissions-section">
                <span className="details-label">Emission Levels</span>
                <div className="emissions-grid">
                  <div className="emission-item">
                    <span className="emission-label">CO:</span>
                    <span className="emission-value">
                      {record.emissions.co}
                    </span>
                  </div>
                  <div className="emission-item">
                    <span className="emission-label">HC:</span>
                    <span className="emission-value">
                      {record.emissions.hc}
                    </span>
                  </div>
                  <div className="emission-item">
                    <span className="emission-label">NOx:</span>
                    <span className="emission-value">
                      {record.emissions.nox}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="record-actions">
          <div className="record-meta-info">
            {record.images && (
              <span className="meta-item">
                <Camera size={14} />
                {record.images} photos
              </span>
            )}
            {record.parts && (
              <span className="meta-item">
                <FileText size={14} />
                {record.parts.length} parts
              </span>
            )}
            {record.warranty && (
              <span className="meta-item">
                <Shield size={14} />
                {record.warranty} warranty
              </span>
            )}
          </div>
          <div className="action-buttons">
            <button className="action-btn view-btn">
              <Eye size={16} />
            </button>
            <button className="action-btn download-btn">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Overview tab content
  const renderOverviewTab = () => (
    <div className="overview-content">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card service-summary">
          <div className="card-header">
            <Wrench size={24} />
            <h3>Service Records</h3>
          </div>
          <p className="card-value">{serviceRecords.length}</p>
          <p className="card-subtitle">
            Last service:{" "}
            {serviceRecords[0]
              ? new Date(serviceRecords[0].date).toLocaleDateString()
              : "None"}
          </p>
        </div>

        <div className="summary-card insurance-summary">
          <div className="card-header">
            <Shield size={24} />
            <h3>Insurance Status</h3>
          </div>
          <p className="card-value">Active</p>
          <p className="card-subtitle">
            Valid until:{" "}
            {insuranceRecords[0]
              ? new Date(insuranceRecords[0].validUntil).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="summary-card emission-summary">
          <div className="card-header">
            <Zap size={24} />
            <h3>Emission Test</h3>
          </div>
          <p className="card-value">Valid</p>
          <p className="card-subtitle">
            Valid until:{" "}
            {emissionRecords[0]
              ? new Date(emissionRecords[0].validUntil).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="summary-card value-summary">
          <div className="card-header">
            <TrendingUp size={24} />
            <h3>Vehicle Value</h3>
          </div>
          <p className="card-value">LKR 2.8M</p>
          <p className="card-subtitle">Estimated current value</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3 className="section-title">
          <Activity size={24} />
          Recent Activity
        </h3>

        <div className="activity-list">
          {[
            ...serviceRecords,
            ...insuranceRecords,
            ...emissionRecords,
            ...accidentRecords,
          ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((record) => (
              <div key={record.id} className="activity-item">
                <div className={`activity-icon ${record.type}-activity`}>
                  {record.type === "service" && <Wrench size={16} />}
                  {record.type === "insurance" && <Shield size={16} />}
                  {record.type === "emission" && <Zap size={16} />}
                  {record.type === "accident" && <AlertTriangle size={16} />}
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">
                    {record.service ||
                      record.coverage ||
                      record.result ||
                      record.severity}
                  </h4>
                  <p className="activity-meta">
                    {record.provider} •{" "}
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={record.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "service":
        return (
          <div className="tab-content">
            {serviceRecords.map((record) => (
              <RecordCard key={record.id} record={record} type="service" />
            ))}
          </div>
        );
      case "insurance":
        return (
          <div className="tab-content">
            {insuranceRecords.map((record) => (
              <RecordCard key={record.id} record={record} type="insurance" />
            ))}
          </div>
        );
      case "emission":
        return (
          <div className="tab-content">
            {emissionRecords.map((record) => (
              <RecordCard key={record.id} record={record} type="emission" />
            ))}
          </div>
        );
      case "accidents":
        return (
          <div className="tab-content">
            {accidentRecords.map((record) => (
              <RecordCard key={record.id} record={record} type="accident" />
            ))}
          </div>
        );
      case "documents":
        return (
          <div className="documents-placeholder">
            <FileText size={48} />
            <h3>Document Management</h3>
            <p>Access and manage all your vehicle documents in one place</p>
            <button className="primary-btn">View Documents</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="vehicle-passport-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <h1 className="page-title">
                <Car size={40} />
                Vehicle Passport
              </h1>
              <p className="page-subtitle">
                Complete digital record for {vehicleData.plateNumber}
              </p>
            </div>

            <div className="header-actions">
              <button className="secondary-btn">
                <Download size={16} />
                Export Report
              </button>

              <button className="primary-btn">
                <Phone size={16} />
                Contact Support
              </button>
            </div>
          </div>

          {/* Vehicle Info Grid */}
          <div className="vehicle-info-grid">
            <div className="vehicle-info-item">
              <span className="info-label">Vehicle</span>
              <p className="info-value">
                {vehicleData.year} {vehicleData.make} {vehicleData.model}
              </p>
            </div>
            <div className="vehicle-info-item">
              <span className="info-label">License Plate</span>
              <p className="info-value">{vehicleData.plateNumber}</p>
            </div>
            <div className="vehicle-info-item">
              <span className="info-label">Current Mileage</span>
              <p className="info-value">
                {vehicleData.currentMileage.toLocaleString()} km
              </p>
            </div>
            <div className="vehicle-info-item">
              <span className="info-label">Registered Since</span>
              <p className="info-value">
                {new Date(vehicleData.registrationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="vehicle-info-item">
              <span className="info-label">VIN</span>
              <p className="info-value">{vehicleData.vin}</p>
            </div>
          </div>
        </div>
        <br />

        {/* Navigation Tabs */}
        <div
          className="navigation-tabs"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "var(--radius-2xl)",
            padding: "var(--space-4)",
            marginBottom: "var(--space-8)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid rgba(122, 178, 211, 0.2)",
            backdropFilter: "blur(12px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="tabs-container"
            style={{
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 var(--space-2)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${isActive ? "active" : ""}`}
                  data-color={tab.color}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)`
                      : "transparent",
                    color: isActive ? "white" : "#6c757d",
                    border: isActive ? "none" : "1px solid #e5e7eb",
                    padding: "var(--space-4) var(--space-6)",
                    borderRadius: "var(--radius-xl)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-semibold)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-3)",
                    transition: "all var(--transition-normal)",
                    whiteSpace: "nowrap",
                    minWidth: "fit-content",
                    fontFamily: "var(--font-family-primary)",
                    position: "relative",
                    overflow: "hidden",
                    flex: "1 1 auto",
                    maxWidth: "200px",
                    minHeight: "48px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.borderColor = tab.color;
                      e.target.style.color = tab.color;
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "var(--shadow-md)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.color = "#6c757d";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <Icon size={18} />
                  <span
                    style={{
                      textAlign: "center",
                      lineHeight: "1.2",
                      fontSize: "inherit",
                    }}
                  >
                    {tab.label}
                  </span>
                  {tab.count !== null && (
                    <span
                      className="tab-count"
                      style={{
                        background: isActive
                          ? "rgba(255, 255, 255, 0.3)"
                          : tab.color,
                        color: "white",
                        borderRadius: "var(--radius-full)",
                        padding: "var(--space-1) var(--space-2)",
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-bold)",
                        minWidth: "1.5rem",
                        height: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1",
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Bar (for non-overview tabs) */}
        {activeTab !== "overview" && (
          <div className="filters-bar">
            <div className="filters-content">
              <div className="filter-controls">
                {/* Search */}
                <div className="search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>

                {/* Date Range Filter */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                  <option value="2years">Last 2 Years</option>
                </select>
              </div>

              <div className="filter-actions">
                <button className="filter-btn">
                  <Filter size={16} />
                </button>

                <button className="filter-btn">
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="main-content">{renderTabContent()}</div>

        {/* Footer Information */}
        <div className="dashboard-footer">
          <div className="footer-grid">
            {/* Upcoming Reminders */}
            <div className="footer-section">
              <h3 className="footer-title">
                <AlertCircle size={20} />
                Upcoming Reminders
              </h3>
              <div className="reminders-list">
                <div className="reminder-item warning">
                  <p className="reminder-title">Oil Change Due</p>
                  <p className="reminder-subtitle">
                    Due in 15 days or 2,000 km
                  </p>
                </div>
                <div className="reminder-item info">
                  <p className="reminder-title">Insurance Renewal</p>
                  <p className="reminder-subtitle">Due in 6 months</p>
                </div>
              </div>
            </div>

            {/* Vehicle Health Score */}
            <div className="footer-section">
              <h3 className="footer-title">
                <Award size={20} />
                Vehicle Health Score
              </h3>
              <div className="health-score">
                <div className="health-circle">
                  <div className="health-percentage">85%</div>
                </div>
                <div className="health-info">
                  <p className="health-status">Excellent Condition</p>
                  <p className="health-subtitle">
                    Regular maintenance up to date
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="footer-section">
              <h3 className="footer-title">
                <Zap size={20} />
                Quick Actions
              </h3>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  Book Service Appointment
                </button>
                <button className="quick-action-btn">
                  Find Service Providers
                </button>
                <button className="quick-action-btn">
                  Update Vehicle Information
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePassportDashboard;
