import React, { useState, useEffect } from "react";
import {
  Car,
  FileText,
  Wrench,
  Shield,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
  Printer,
  BarChart3,
  Fuel,
  Users,
  Badge,
  ExternalLink,
  Filter,
  Search,
  Eye,
  Edit3,
  Plus,
} from "lucide-react";
import "./VehiclePassportPage.css";

const VehiclePassportPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  const vehicleData = {
    id: "LK-CAR-001234",
    registrationNumber: "CAB-1234",
    make: "Toyota",
    model: "Prius",
    year: 2020,
    color: "Pearl White",
    engineNumber: "1NZ-FXE123456",
    chassisNumber: "JTDKB20U800123456",
    fuelType: "Hybrid",
    transmission: "CVT",
    mileage: 45000,
    ownershipHistory: [
      {
        id: 1,
        owner: "John Perera",
        period: "2020-03-15 to Present",
        duration: "4 years 4 months",
        transferType: "First Owner",
        location: "Colombo, Western Province",
      },
    ],
    currentStatus: "Active",
    lastUpdated: "2024-07-10T10:30:00Z",
    qrCode: "data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAF...",
  };

  const maintenanceHistory = [
    {
      id: "M001",
      date: "2024-07-01",
      service: "Regular Service",
      provider: "Toyota Lanka Auto Miraj",
      type: "scheduled",
      mileage: 45000,
      cost: 15500,
      status: "completed",
      services: [
        "Engine Oil Change",
        "Oil Filter Replacement",
        "Air Filter Cleaning",
        "Brake System Check",
        "Battery Test",
      ],
      nextService: "2024-10-01",
      warranty: "6 months",
      technician: "Mr. Samantha Silva",
      rating: 4.8,
    },
    {
      id: "M002",
      date: "2024-04-15",
      service: "Brake Pad Replacement",
      provider: "Quick Fix Auto Center",
      type: "repair",
      mileage: 43500,
      cost: 8750,
      status: "completed",
      services: ["Front Brake Pads", "Brake Fluid Top-up", "Brake Test"],
      warranty: "12 months",
      technician: "Mr. Nuwan Fernando",
      rating: 4.5,
    },
    {
      id: "M003",
      date: "2024-01-20",
      service: "Annual Inspection",
      provider: "Government Testing Station",
      type: "inspection",
      mileage: 42000,
      cost: 2500,
      status: "completed",
      services: ["Emission Test", "Safety Inspection", "Documentation"],
      certificate: "EMT-2024-001234",
      validUntil: "2025-01-20",
      rating: 5.0,
    },
  ];

  const accidents = [
    {
      id: "A001",
      date: "2023-08-15",
      type: "Minor Collision",
      location: "Galle Road, Colombo 03",
      severity: "minor",
      damages: ["Front Bumper", "Right Headlight", "Paint Work"],
      repairCost: 45000,
      insuranceClaim: "INS-2023-789456",
      repairCenter: "Premium Auto Body",
      status: "completed",
      photos: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1583200794647-5c1d89b15c8a?w=300&h=200&fit=crop",
      ],
    },
  ];

  const emissionsData = [
    {
      id: "E001",
      date: "2024-01-20",
      testCenter: "Government Testing Station - Colombo",
      certificateNumber: "EMT-2024-001234",
      result: "PASS",
      co2Level: 95,
      noxLevel: 18,
      particulateLevel: 2.1,
      validUntil: "2025-01-20",
      grade: "Euro 5",
    },
    {
      id: "E002",
      date: "2023-01-15",
      testCenter: "Government Testing Station - Colombo",
      certificateNumber: "EMT-2023-001234",
      result: "PASS",
      co2Level: 98,
      noxLevel: 20,
      particulateLevel: 2.3,
      validUntil: "2024-01-15",
      grade: "Euro 5",
    },
  ];

  const upcomingServices = [
    {
      id: "US001",
      type: "Regular Service",
      dueDate: "2024-10-01",
      dueMileage: 50000,
      currentMileage: 45000,
      provider: "Toyota Lanka Auto Miraj",
      estimatedCost: "₹15,000 - ₹20,000",
      urgency: "medium",
    },
    {
      id: "US002",
      type: "Emission Test",
      dueDate: "2025-01-20",
      provider: "Government Testing Station",
      estimatedCost: "₹2,500",
      urgency: "low",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <Car className="w-4 h-4" /> },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "accidents",
      label: "Accidents",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: "emissions",
      label: "Emissions",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "danger";
      default:
        return "primary";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "primary";
    }
  };

  const renderOverview = () => (
    <div className="passport-overview">
      <div className="overview-grid">
        {/* Vehicle Information Card */}
        <div className="overview-card vehicle-info-card">
          <div className="card-header">
            <div className="card-title">
              <Car className="w-5 h-5" />
              <span>Vehicle Information</span>
            </div>
            <div className="card-actions">
              <button className="action-btn edit-btn">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="vehicle-header">
              <div className="vehicle-image">
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200&h=150&fit=crop"
                  alt="Vehicle"
                />
              </div>
              <div className="vehicle-details">
                <h3 className="vehicle-title">
                  {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </h3>
                <p className="registration-number">
                  {vehicleData.registrationNumber}
                </p>
                <div className="vehicle-status active">
                  <CheckCircle className="w-4 h-4" />
                  <span>Active Registration</span>
                </div>
              </div>
            </div>
            <div className="vehicle-specs">
              <div className="spec-item">
                <span className="spec-label">Engine</span>
                <span className="spec-value">{vehicleData.engineNumber}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Chassis</span>
                <span className="spec-value">{vehicleData.chassisNumber}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Fuel Type</span>
                <span className="spec-value">{vehicleData.fuelType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Transmission</span>
                <span className="spec-value">{vehicleData.transmission}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Mileage</span>
                <span className="spec-value">
                  {vehicleData.mileage.toLocaleString()} km
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color</span>
                <span className="spec-value">{vehicleData.color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="overview-card qr-card">
          <div className="card-header">
            <div className="card-title">
              <Badge className="w-5 h-5" />
              <span>Digital Passport</span>
            </div>
            <div className="card-actions">
              <button className="action-btn">
                <Download className="w-4 h-4" />
              </button>
              <button className="action-btn">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="action-btn">
                <Print className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="card-body qr-body">
            <div className="qr-code">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=autoconnect.lk/passport/LK-CAR-001234"
                alt="Vehicle QR Code"
              />
            </div>
            <p className="qr-description">
              Scan to view public vehicle information
            </p>
            <div className="passport-id">
              <span>Passport ID: {vehicleData.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="overview-card stats-card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 className="w-5 h-5" />
              <span>Vehicle Statistics</span>
            </div>
          </div>
          <div className="card-body">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">
                    {maintenanceHistory.length}
                  </span>
                  <span className="stat-label">Service Records</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{accidents.length}</span>
                  <span className="stat-label">Accident Reports</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{emissionsData.length}</span>
                  <span className="stat-label">Emission Tests</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Users className="w-5 h-5" />
                </div>
                <div className="stat-info">
                  <span className="stat-number">
                    {vehicleData.ownershipHistory.length}
                  </span>
                  <span className="stat-label">Previous Owners</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Services */}
        <div className="overview-card upcoming-card">
          <div className="card-header">
            <div className="card-title">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Services</span>
            </div>
            <div className="card-actions">
              <button className="action-btn primary-btn">
                <Plus className="w-4 h-4" />
                Schedule
              </button>
            </div>
          </div>
          <div className="card-body">
            {upcomingServices.map((service) => (
              <div key={service.id} className="upcoming-service">
                <div className="service-icon">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="service-info">
                  <div className="service-header">
                    <span className="service-name">{service.type}</span>
                    <span className={`urgency-badge ${service.urgency}`}>
                      {service.urgency}
                    </span>
                  </div>
                  <div className="service-details">
                    <span className="service-date">Due: {service.dueDate}</span>
                    <span className="service-cost">
                      {service.estimatedCost}
                    </span>
                  </div>
                  <div className="service-provider">{service.provider}</div>
                </div>
                <button className="view-btn">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="maintenance-section">
      <div className="section-header">
        <div className="section-title">
          <Wrench className="w-5 h-5" />
          <span>Maintenance History</span>
        </div>
        <div className="section-actions">
          <button className="action-btn primary-btn">
            <Plus className="w-4 h-4" />
            Add Service Record
          </button>
        </div>
      </div>

      <div className="maintenance-filters">
        <div className="filter-group">
          <div className="search-box">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Services</option>
            <option value="scheduled">Scheduled</option>
            <option value="repair">Repairs</option>
            <option value="inspection">Inspections</option>
          </select>
        </div>
      </div>

      <div className="maintenance-timeline">
        {maintenanceHistory.map((record, index) => (
          <div key={record.id} className="timeline-item">
            <div className="timeline-marker">
              <div className={`marker-dot ${getStatusColor(record.status)}`}>
                {record.type === "scheduled" && (
                  <Calendar className="w-3 h-3" />
                )}
                {record.type === "repair" && <Wrench className="w-3 h-3" />}
                {record.type === "inspection" && <Shield className="w-3 h-3" />}
              </div>
              {index < maintenanceHistory.length - 1 && (
                <div className="timeline-line"></div>
              )}
            </div>

            <div className="timeline-content">
              <div className="maintenance-card">
                <div className="card-header">
                  <div className="service-info">
                    <h3 className="service-title">{record.service}</h3>
                    <div className="service-meta">
                      <span className="service-date">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="service-mileage">
                        <MapPin className="w-4 h-4" />
                        {record.mileage?.toLocaleString()} km
                      </span>
                      <span className="service-cost">
                        ₹{record.cost?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="action-btn">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="action-btn">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="provider-info">
                    <div className="provider-name">
                      <span>{record.provider}</span>
                      {record.technician && (
                        <span className="technician">
                          by {record.technician}
                        </span>
                      )}
                    </div>
                    {record.rating && (
                      <div className="service-rating">
                        <span className="rating-stars">★★★★★</span>
                        <span className="rating-value">{record.rating}/5</span>
                      </div>
                    )}
                  </div>

                  <div className="services-performed">
                    <h4>Services Performed:</h4>
                    <div className="service-tags">
                      {record.services.map((service, idx) => (
                        <span key={idx} className="service-tag">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {record.nextService && (
                    <div className="next-service">
                      <Clock className="w-4 h-4" />
                      <span>Next service due: {record.nextService}</span>
                    </div>
                  )}

                  {record.warranty && (
                    <div className="warranty-info">
                      <Shield className="w-4 h-4" />
                      <span>Warranty: {record.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccidents = () => (
    <div className="accidents-section">
      <div className="section-header">
        <div className="section-title">
          <AlertTriangle className="w-5 h-5" />
          <span>Accident History</span>
        </div>
        <div className="section-actions">
          <button className="action-btn primary-btn">
            <Plus className="w-4 h-4" />
            Report Accident
          </button>
        </div>
      </div>

      {accidents.length === 0 ? (
        <div className="empty-state">
          <CheckCircle className="w-12 h-12" />
          <h3>No Accidents Reported</h3>
          <p>This vehicle has a clean accident history record.</p>
        </div>
      ) : (
        <div className="accidents-list">
          {accidents.map((accident) => (
            <div key={accident.id} className="accident-card">
              <div className="card-header">
                <div className="accident-info">
                  <h3 className="accident-type">{accident.type}</h3>
                  <div className="accident-meta">
                    <span className="accident-date">
                      <Calendar className="w-4 h-4" />
                      {new Date(accident.date).toLocaleDateString()}
                    </span>
                    <span className="accident-location">
                      <MapPin className="w-4 h-4" />
                      {accident.location}
                    </span>
                    <span className={`severity-badge ${accident.severity}`}>
                      {accident.severity}
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="action-btn">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="damages-section">
                  <h4>Damages Reported:</h4>
                  <div className="damage-tags">
                    {accident.damages.map((damage, idx) => (
                      <span key={idx} className="damage-tag">
                        {damage}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="accident-details">
                  <div className="detail-item">
                    <span className="detail-label">Repair Cost:</span>
                    <span className="detail-value">
                      ₹{accident.repairCost?.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Insurance Claim:</span>
                    <span className="detail-value">
                      {accident.insuranceClaim}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Repair Center:</span>
                    <span className="detail-value">
                      {accident.repairCenter}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${accident.status}`}>
                      {accident.status}
                    </span>
                  </div>
                </div>

                {accident.photos && accident.photos.length > 0 && (
                  <div className="accident-photos">
                    <h4>Photos:</h4>
                    <div className="photo-gallery">
                      {accident.photos.map((photo, idx) => (
                        <div key={idx} className="photo-item">
                          <img src={photo} alt={`Accident ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEmissions = () => (
    <div className="emissions-section">
      <div className="section-header">
        <div className="section-title">
          <Shield className="w-5 h-5" />
          <span>Emission Test History</span>
        </div>
        <div className="section-actions">
          <button className="action-btn primary-btn">
            <Plus className="w-4 h-4" />
            Schedule Test
          </button>
        </div>
      </div>

      <div className="emissions-grid">
        {emissionsData.map((test) => (
          <div key={test.id} className="emission-card">
            <div className="card-header">
              <div className="test-info">
                <div className="test-result">
                  <span className={`result-badge ${test.result.toLowerCase()}`}>
                    {test.result === "PASS" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {test.result}
                  </span>
                  <span className="test-grade">{test.grade}</span>
                </div>
                <div className="test-date">
                  {new Date(test.date).toLocaleDateString()}
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn">
                  <Download className="w-4 h-4" />
                  Certificate
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="test-center">
                <span className="center-name">{test.testCenter}</span>
                <span className="certificate-number">
                  Certificate: {test.certificateNumber}
                </span>
              </div>

              <div className="emission-levels">
                <div className="level-item">
                  <span className="level-label">CO₂</span>
                  <div className="level-bar">
                    <div
                      className="level-fill co2"
                      style={{ width: `${(test.co2Level / 120) * 100}%` }}
                    ></div>
                  </div>
                  <span className="level-value">{test.co2Level} g/km</span>
                </div>
                <div className="level-item">
                  <span className="level-label">NOx</span>
                  <div className="level-bar">
                    <div
                      className="level-fill nox"
                      style={{ width: `${(test.noxLevel / 60) * 100}%` }}
                    ></div>
                  </div>
                  <span className="level-value">{test.noxLevel} mg/km</span>
                </div>
                <div className="level-item">
                  <span className="level-label">PM</span>
                  <div className="level-bar">
                    <div
                      className="level-fill pm"
                      style={{ width: `${(test.particulateLevel / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="level-value">
                    {test.particulateLevel} mg/km
                  </span>
                </div>
              </div>

              <div className="validity-info">
                <Clock className="w-4 h-4" />
                <span>Valid until: {test.validUntil}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="documents-section">
      <div className="section-header">
        <div className="section-title">
          <FileText className="w-5 h-5" />
          <span>Vehicle Documents</span>
        </div>
        <div className="section-actions">
          <button className="action-btn primary-btn">
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="documents-grid">
        <div className="document-card">
          <div className="document-icon">
            <FileText className="w-8 h-8" />
          </div>
          <div className="document-info">
            <h3>Registration Certificate</h3>
            <p>Vehicle registration document</p>
            <span className="document-status valid">Valid</span>
          </div>
          <div className="document-actions">
            <button className="action-btn">
              <Eye className="w-4 h-4" />
            </button>
            <button className="action-btn">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="document-card">
          <div className="document-icon">
            <Shield className="w-8 h-8" />
          </div>
          <div className="document-info">
            <h3>Insurance Policy</h3>
            <p>Current insurance coverage</p>
            <span className="document-status valid">Valid until Dec 2024</span>
          </div>
          <div className="document-actions">
            <button className="action-btn">
              <Eye className="w-4 h-4" />
            </button>
            <button className="action-btn">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="document-card">
          <div className="document-icon">
            <Fuel className="w-8 h-8" />
          </div>
          <div className="document-info">
            <h3>Emission Certificate</h3>
            <p>Latest emission test results</p>
            <span className="document-status valid">Valid until Jan 2025</span>
          </div>
          <div className="document-actions">
            <button className="action-btn">
              <Eye className="w-4 h-4" />
            </button>
            <button className="action-btn">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="vehicle-passport-page">
      <div className="passport-header">
        <div className="header-content">
          <div className="page-title">
            <Car className="w-6 h-6" />
            <span>Digital Vehicle Passport</span>
          </div>
          <div className="header-actions">
            <button className="action-btn">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="action-btn">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="action-btn primary-btn">
              <Printer className="w-4 h-4" />
              Print Passport
            </button>
          </div>
        </div>
      </div>

      <div className="passport-navigation">
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

      <div className="passport-content">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "maintenance" && renderMaintenance()}
        {activeTab === "accidents" && renderAccidents()}
        {activeTab === "emissions" && renderEmissions()}
        {activeTab === "documents" && renderDocuments()}
      </div>
    </div>
  );
};

export default VehiclePassportPage;
