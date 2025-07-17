import React, { useState, useEffect } from "react";
import {
  Car,
  Wrench,
  FileText,
  Camera,
  Upload,
  Plus,
  Minus,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Save,
  X,
  Info,
  Shield,
  Hammer,
  Fuel,
  Settings,
} from "lucide-react";
import "./ServiceUpdateForm.css";

const ServiceUpdateForm = ({ appointmentId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    appointmentId: appointmentId || "",
    vehicleInfo: {
      registrationNumber: "",
      make: "",
      model: "",
      year: "",
      mileage: "",
    },
    serviceDetails: {
      serviceType: "",
      date: "",
      startTime: "",
      endTime: "",
      technicianName: "",
      technicianId: "",
    },
    servicesPerformed: [
      {
        id: 1,
        service: "",
        description: "",
        partsUsed: [],
        laborHours: "",
        cost: "",
      },
    ],
    partsReplaced: [
      {
        id: 1,
        partName: "",
        partNumber: "",
        brand: "",
        quantity: 1,
        unitCost: "",
        totalCost: "",
        warranty: "",
      },
    ],
    recommendations: {
      nextServiceDate: "",
      nextServiceMileage: "",
      urgentIssues: [],
      futureMaintenanceItems: [],
      notes: "",
    },
    costs: {
      laborCost: "",
      partsCost: "",
      additionalCosts: "",
      discount: "",
      tax: "",
      totalCost: "",
    },
    warranty: {
      laborWarranty: "",
      partsWarranty: "",
      warrantyTerms: "",
    },
    photos: [],
    serviceReport: "",
    customerSignature: "",
    technicianSignature: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    // In real implementation, fetch appointment data
    setFormData((prev) => ({
      ...prev,
      vehicleInfo: {
        registrationNumber: "CAB-1234",
        make: "Toyota",
        model: "Prius",
        year: "2020",
        mileage: "45000",
      },
      serviceDetails: {
        serviceType: "Regular Service",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "",
        technicianName: "Samantha Silva",
        technicianId: "TECH001",
      },
    }));
  }, [appointmentId]);

  const serviceTypes = [
    "Regular Service",
    "Brake Service",
    "Engine Repair",
    "Transmission Service",
    "Air Conditioning",
    "Electrical Repair",
    "Body Work",
    "Tire Service",
    "Battery Service",
    "Oil Change",
    "Other",
  ];

  const commonServices = [
    "Engine Oil Change",
    "Oil Filter Replacement",
    "Air Filter Cleaning/Replacement",
    "Brake Pad Replacement",
    "Brake Fluid Change",
    "Battery Test and Service",
    "Tire Rotation",
    "Wheel Alignment",
    "Transmission Fluid Change",
    "Coolant System Flush",
    "Spark Plug Replacement",
    "Timing Belt Replacement",
    "Suspension Service",
    "AC Service and Repair",
    "Electrical Diagnostics",
  ];

  const warrantyPeriods = [
    "3 months",
    "6 months",
    "12 months",
    "24 months",
    "36 months",
    "Lifetime",
  ];

  const addServiceItem = () => {
    const newService = {
      id: formData.servicesPerformed.length + 1,
      service: "",
      description: "",
      partsUsed: [],
      laborHours: "",
      cost: "",
    };
    setFormData((prev) => ({
      ...prev,
      servicesPerformed: [...prev.servicesPerformed, newService],
    }));
  };

  const removeServiceItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      servicesPerformed: prev.servicesPerformed.filter(
        (service) => service.id !== id
      ),
    }));
  };

  const addPartItem = () => {
    const newPart = {
      id: formData.partsReplaced.length + 1,
      partName: "",
      partNumber: "",
      brand: "",
      quantity: 1,
      unitCost: "",
      totalCost: "",
      warranty: "",
    };
    setFormData((prev) => ({
      ...prev,
      partsReplaced: [...prev.partsReplaced, newPart],
    }));
  };

  const removePartItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      partsReplaced: prev.partsReplaced.filter((part) => part.id !== id),
    }));
  };

  const calculateTotalCost = () => {
    const laborCost = parseFloat(formData.costs.laborCost) || 0;
    const partsCost = parseFloat(formData.costs.partsCost) || 0;
    const additionalCosts = parseFloat(formData.costs.additionalCosts) || 0;
    const discount = parseFloat(formData.costs.discount) || 0;
    const tax = parseFloat(formData.costs.tax) || 0;

    const subtotal = laborCost + partsCost + additionalCosts - discount;
    const total = subtotal + tax;

    setFormData((prev) => ({
      ...prev,
      costs: {
        ...prev.costs,
        totalCost: total.toFixed(2),
      },
    }));
  };

  useEffect(() => {
    calculateTotalCost();
  }, [
    formData.costs.laborCost,
    formData.costs.partsCost,
    formData.costs.additionalCosts,
    formData.costs.discount,
    formData.costs.tax,
  ]);

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const photoPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            file,
            url: e.target.result,
            name: file.name,
            description: "",
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(photoPromises).then((photos) => {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...photos],
      }));
    });
  };

  const removePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.serviceDetails.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.servicesPerformed.some((service) => !service.service)) {
      newErrors.services = "All service items must have a service type";
    }

    if (
      !formData.costs.totalCost ||
      parseFloat(formData.costs.totalCost) <= 0
    ) {
      newErrors.totalCost = "Total cost must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Service Details",
      icon: <Wrench className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Services Performed",
      icon: <Hammer className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Parts & Costs",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Documentation",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.id} className="step-item">
          <div
            className={`step-circle ${currentStep >= step.id ? "active" : ""} ${
              currentStep === step.id ? "current" : ""
            }`}
            onClick={() => setCurrentStep(step.id)}
          >
            {step.icon}
          </div>
          <span className="step-label">{step.title}</span>
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );

  const renderServiceDetails = () => (
    <div className="form-section">
      <div className="section-header">
        <h3>Service Information</h3>
        <p>Update basic service details and timeline</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Vehicle Registration</label>
          <div className="input-with-icon">
            <Car className="w-4 h-4" />
            <input
              type="text"
              value={formData.vehicleInfo.registrationNumber}
              disabled
              className="form-input disabled"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Service Type</label>
          <select
            value={formData.serviceDetails.serviceType}
            onChange={(e) =>
              handleInputChange("serviceDetails", "serviceType", e.target.value)
            }
            className="form-select"
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Service Date</label>
          <div className="input-with-icon">
            <Calendar className="w-4 h-4" />
            <input
              type="date"
              value={formData.serviceDetails.date}
              onChange={(e) =>
                handleInputChange("serviceDetails", "date", e.target.value)
              }
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Current Mileage</label>
          <div className="input-with-icon">
            <MapPin className="w-4 h-4" />
            <input
              type="number"
              value={formData.vehicleInfo.mileage}
              onChange={(e) =>
                handleInputChange("vehicleInfo", "mileage", e.target.value)
              }
              className="form-input"
              placeholder="Enter current mileage"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <div className="input-with-icon">
            <Clock className="w-4 h-4" />
            <input
              type="time"
              value={formData.serviceDetails.startTime}
              onChange={(e) =>
                handleInputChange("serviceDetails", "startTime", e.target.value)
              }
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>End Time *</label>
          <div className="input-with-icon">
            <Clock className="w-4 h-4" />
            <input
              type="time"
              value={formData.serviceDetails.endTime}
              onChange={(e) =>
                handleInputChange("serviceDetails", "endTime", e.target.value)
              }
              className={`form-input ${errors.endTime ? "error" : ""}`}
            />
          </div>
          {errors.endTime && (
            <span className="error-text">{errors.endTime}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label>Technician</label>
          <div className="input-with-icon">
            <User className="w-4 h-4" />
            <input
              type="text"
              value={formData.serviceDetails.technicianName}
              onChange={(e) =>
                handleInputChange(
                  "serviceDetails",
                  "technicianName",
                  e.target.value
                )
              }
              className="form-input"
              placeholder="Enter technician name"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderServicesPerformed = () => (
    <div className="form-section">
      <div className="section-header">
        <h3>Services Performed</h3>
        <p>Add all services and repairs completed</p>
      </div>

      <div className="services-list">
        {formData.servicesPerformed.map((service, index) => (
          <div key={service.id} className="service-item">
            <div className="service-header">
              <h4>Service {index + 1}</h4>
              {formData.servicesPerformed.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeServiceItem(service.id)}
                  className="remove-btn"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Service Type</label>
                <select
                  value={service.service}
                  onChange={(e) =>
                    handleInputChange(
                      "servicesPerformed",
                      "service",
                      e.target.value,
                      index
                    )
                  }
                  className="form-select"
                >
                  <option value="">Select service</option>
                  {commonServices.map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Labor Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={service.laborHours}
                  onChange={(e) =>
                    handleInputChange(
                      "servicesPerformed",
                      "laborHours",
                      e.target.value,
                      index
                    )
                  }
                  className="form-input"
                  placeholder="0.0"
                />
              </div>

              <div className="form-group full-width">
                <label>Description / Notes</label>
                <textarea
                  value={service.description}
                  onChange={(e) =>
                    handleInputChange(
                      "servicesPerformed",
                      "description",
                      e.target.value,
                      index
                    )
                  }
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe the work performed..."
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addServiceItem} className="add-item-btn">
          <Plus className="w-4 h-4" />
          Add Another Service
        </button>
      </div>

      {errors.services && <span className="error-text">{errors.services}</span>}
    </div>
  );

  const renderPartsAndCosts = () => (
    <div className="form-section">
      <div className="section-header">
        <h3>Parts Replaced & Costs</h3>
        <p>Document all parts used and calculate total costs</p>
      </div>

      <div className="parts-section">
        <h4>Parts Replaced</h4>
        <div className="parts-list">
          {formData.partsReplaced.map((part, index) => (
            <div key={part.id} className="part-item">
              <div className="part-header">
                <h5>Part {index + 1}</h5>
                {formData.partsReplaced.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePartItem(part.id)}
                    className="remove-btn"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Part Name</label>
                  <input
                    type="text"
                    value={part.partName}
                    onChange={(e) =>
                      handleInputChange(
                        "partsReplaced",
                        "partName",
                        e.target.value,
                        index
                      )
                    }
                    className="form-input"
                    placeholder="e.g., Brake Pad Set"
                  />
                </div>

                <div className="form-group">
                  <label>Part Number</label>
                  <input
                    type="text"
                    value={part.partNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "partsReplaced",
                        "partNumber",
                        e.target.value,
                        index
                      )
                    }
                    className="form-input"
                    placeholder="e.g., BP-001-TOY"
                  />
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={part.brand}
                    onChange={(e) =>
                      handleInputChange(
                        "partsReplaced",
                        "brand",
                        e.target.value,
                        index
                      )
                    }
                    className="form-input"
                    placeholder="e.g., Toyota Original"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={part.quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "partsReplaced",
                        "quantity",
                        parseInt(e.target.value),
                        index
                      )
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Unit Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={part.unitCost}
                    onChange={(e) =>
                      handleInputChange(
                        "partsReplaced",
                        "unitCost",
                        e.target.value,
                        index
                      )
                    }
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Warranty</label>
                  <select
                    value={part.warranty}
                    onChange={(e) =>
                      handleInputChange(
                        "partsReplaced",
                        "warranty",
                        e.target.value,
                        index
                      )
                    }
                    className="form-select"
                  >
                    <option value="">Select warranty period</option>
                    {warrantyPeriods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addPartItem} className="add-item-btn">
            <Plus className="w-4 h-4" />
            Add Another Part
          </button>
        </div>
      </div>

      <div className="costs-section">
        <h4>Cost Breakdown</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Labor Cost (₹)</label>
            <div className="input-with-icon">
              <DollarSign className="w-4 h-4" />
              <input
                type="number"
                step="0.01"
                value={formData.costs.laborCost}
                onChange={(e) =>
                  handleInputChange("costs", "laborCost", e.target.value)
                }
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Parts Cost (₹)</label>
            <div className="input-with-icon">
              <DollarSign className="w-4 h-4" />
              <input
                type="number"
                step="0.01"
                value={formData.costs.partsCost}
                onChange={(e) =>
                  handleInputChange("costs", "partsCost", e.target.value)
                }
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Costs (₹)</label>
            <div className="input-with-icon">
              <DollarSign className="w-4 h-4" />
              <input
                type="number"
                step="0.01"
                value={formData.costs.additionalCosts}
                onChange={(e) =>
                  handleInputChange("costs", "additionalCosts", e.target.value)
                }
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Discount (₹)</label>
            <div className="input-with-icon">
              <DollarSign className="w-4 h-4" />
              <input
                type="number"
                step="0.01"
                value={formData.costs.discount}
                onChange={(e) =>
                  handleInputChange("costs", "discount", e.target.value)
                }
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tax (₹)</label>
            <div className="input-with-icon">
              <DollarSign className="w-4 h-4" />
              <input
                type="number"
                step="0.01"
                value={formData.costs.tax}
                onChange={(e) =>
                  handleInputChange("costs", "tax", e.target.value)
                }
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group total-cost">
            <label>Total Cost (₹)</label>
            <div className="total-display">
              ₹{formData.costs.totalCost || "0.00"}
            </div>
          </div>
        </div>

        {errors.totalCost && (
          <span className="error-text">{errors.totalCost}</span>
        )}
      </div>

      <div className="warranty-section">
        <h4>Warranty Information</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Labor Warranty</label>
            <select
              value={formData.warranty.laborWarranty}
              onChange={(e) =>
                handleInputChange("warranty", "laborWarranty", e.target.value)
              }
              className="form-select"
            >
              <option value="">Select warranty period</option>
              {warrantyPeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Parts Warranty</label>
            <select
              value={formData.warranty.partsWarranty}
              onChange={(e) =>
                handleInputChange("warranty", "partsWarranty", e.target.value)
              }
              className="form-select"
            >
              <option value="">Select warranty period</option>
              {warrantyPeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Warranty Terms & Conditions</label>
            <textarea
              value={formData.warranty.warrantyTerms}
              onChange={(e) =>
                handleInputChange("warranty", "warrantyTerms", e.target.value)
              }
              className="form-textarea"
              rows="3"
              placeholder="Enter warranty terms and conditions..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="form-section">
      <div className="section-header">
        <h3>Documentation & Photos</h3>
        <p>Upload photos and add service recommendations</p>
      </div>

      <div className="photos-section">
        <h4>Service Photos</h4>
        <div className="photo-upload-area">
          <div className="upload-dropzone">
            <Upload className="w-8 h-8" />
            <p>Drop photos here or click to select</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="file-input"
            />
          </div>
        </div>

        {formData.photos.length > 0 && (
          <div className="photos-grid">
            {formData.photos.map((photo) => (
              <div key={photo.id} className="photo-item">
                <img src={photo.url} alt={photo.name} />
                <div className="photo-overlay">
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="remove-photo-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Photo description..."
                  value={photo.description}
                  onChange={(e) => {
                    const updatedPhotos = formData.photos.map((p) =>
                      p.id === photo.id
                        ? { ...p, description: e.target.value }
                        : p
                    );
                    setFormData((prev) => ({
                      ...prev,
                      photos: updatedPhotos,
                    }));
                  }}
                  className="photo-description"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="recommendations-section">
        <h4>Recommendations & Next Service</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Next Service Date</label>
            <div className="input-with-icon">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={formData.recommendations.nextServiceDate}
                onChange={(e) =>
                  handleInputChange(
                    "recommendations",
                    "nextServiceDate",
                    e.target.value
                  )
                }
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Next Service Mileage</label>
            <div className="input-with-icon">
              <MapPin className="w-4 h-4" />
              <input
                type="number"
                value={formData.recommendations.nextServiceMileage}
                onChange={(e) =>
                  handleInputChange(
                    "recommendations",
                    "nextServiceMileage",
                    e.target.value
                  )
                }
                className="form-input"
                placeholder="e.g., 50000"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>
              <AlertTriangle className="w-4 h-4" />
              Urgent Issues Found
            </label>
            <textarea
              value={formData.recommendations.urgentIssues.join("\n")}
              onChange={(e) =>
                handleInputChange(
                  "recommendations",
                  "urgentIssues",
                  e.target.value.split("\n").filter((item) => item.trim())
                )
              }
              className="form-textarea"
              rows="3"
              placeholder="List any urgent issues that need immediate attention (one per line)..."
            />
          </div>

          <div className="form-group full-width">
            <label>
              <Info className="w-4 h-4" />
              Future Maintenance Items
            </label>
            <textarea
              value={formData.recommendations.futureMaintenanceItems.join("\n")}
              onChange={(e) =>
                handleInputChange(
                  "recommendations",
                  "futureMaintenanceItems",
                  e.target.value.split("\n").filter((item) => item.trim())
                )
              }
              className="form-textarea"
              rows="4"
              placeholder="List recommended future maintenance items (one per line)..."
            />
          </div>

          <div className="form-group full-width">
            <label>Additional Notes</label>
            <textarea
              value={formData.recommendations.notes}
              onChange={(e) =>
                handleInputChange("recommendations", "notes", e.target.value)
              }
              className="form-textarea"
              rows="4"
              placeholder="Any additional notes or observations..."
            />
          </div>
        </div>
      </div>

      <div className="service-report-section">
        <h4>Service Report Summary</h4>
        <div className="form-group">
          <label>Detailed Service Report</label>
          <textarea
            value={formData.serviceReport}
            onChange={(e) =>
              handleInputChange(null, "serviceReport", e.target.value)
            }
            className="form-textarea"
            rows="6"
            placeholder="Provide a comprehensive summary of all work performed, findings, and recommendations..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="service-update-form">
      <div className="form-header">
        <div className="header-content">
          <h2>Update Vehicle Service Record</h2>
          <p>Complete service documentation for appointment #{appointmentId}</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="update-form">
        <div className="form-content">
          {currentStep === 1 && renderServiceDetails()}
          {currentStep === 2 && renderServicesPerformed()}
          {currentStep === 3 && renderPartsAndCosts()}
          {currentStep === 4 && renderDocumentation()}
        </div>

        <div className="form-navigation">
          <div className="nav-buttons">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn btn-secondary"
              >
                Previous
              </button>
            )}

            {currentStep < 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-primary"
              >
                Next
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success"
              >
                {isSubmitting ? (
                  <>
                    <Settings className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Vehicle Passport
                  </>
                )}
              </button>
            )}
          </div>

          <div className="form-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceUpdateForm;
