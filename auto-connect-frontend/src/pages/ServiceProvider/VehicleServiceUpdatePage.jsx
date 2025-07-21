import React, { useState, useEffect } from "react";
import VehicleServiceUpdateForm from "@components/ServiceProvider/VehicleServiceUpdateForm";
import {
  ArrowLeft,
  Car,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";

const VehicleServiceUpdatePage = () => {
  const [currentStep, setCurrentStep] = useState("form"); // 'form', 'preview', 'success'
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample vehicle data (would come from route params or API in real app)
  const [vehicleData] = useState({
    plateNumber: "ABC-1234",
    make: "Toyota",
    model: "Camry",
    year: "2019",
    owner: "John Doe",
    vin: "1HGBH41JXMN109186",
    currentMileage: "45000",
  });

  // Sample customer data
  const [customerData] = useState({
    name: "John Doe",
    phone: "+94 77 123 4567",
    email: "john.doe@email.com",
    address: "123 Main Street, Colombo 07",
  });

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setCurrentStep("preview");

    // Simulate API submission
    setTimeout(() => {
      setSubmittedData(formData);
      setLoading(false);
      setCurrentStep("success");
    }, 2000);
  };

  const handleFormCancel = () => {
    // Navigate back to previous page
    console.log("Navigate back to service dashboard");
  };

  const handleNewService = () => {
    setCurrentStep("form");
    setSubmittedData(null);
  };

  const renderSuccessPage = () => (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "24px",
          padding: "3rem",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(74, 98, 138, 0.2)",
          border: "1px solid rgba(122, 178, 211, 0.3)",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem auto",
            border: "4px solid #16a34a",
          }}
        >
          <CheckCircle size={60} style={{ color: "#16a34a" }} />
        </div>

        {/* Success Message */}
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            color: "#2c3e50",
            marginBottom: "1rem",
          }}
        >
          Service Record Submitted!
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "#6c757d",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          The vehicle passport has been successfully updated with the service
          details. The customer will receive a notification with the service
          summary.
        </p>

        {/* Service Summary Card */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FileText size={20} style={{ color: "#7AB2D3" }} />
            Service Summary
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              fontSize: "0.875rem",
            }}
          >
            <div>
              <span style={{ color: "#6c757d" }}>Vehicle:</span>
              <br />
              <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                {vehicleData.plateNumber} - {vehicleData.year}{" "}
                {vehicleData.make} {vehicleData.model}
              </span>
            </div>
            <div>
              <span style={{ color: "#6c757d" }}>Work Order:</span>
              <br />
              <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                {submittedData?.serviceDetails?.workOrderNumber || "N/A"}
              </span>
            </div>
            <div>
              <span style={{ color: "#6c757d" }}>Service Type:</span>
              <br />
              <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                {submittedData?.serviceDetails?.serviceType || "N/A"}
              </span>
            </div>
            <div>
              <span style={{ color: "#6c757d" }}>Total Cost:</span>
              <br />
              <span
                style={{
                  fontWeight: "700",
                  color: "#4A628A",
                  fontSize: "1rem",
                }}
              >
                LKR {submittedData?.costs?.total || "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleNewService}
            style={{
              background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            Record Another Service
          </button>

          <button
            onClick={() => console.log("Navigate to dashboard")}
            style={{
              background: "none",
              color: "#7AB2D3",
              border: "2px solid #7AB2D3",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#7AB2D3";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.color = "#7AB2D3";
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingPage = () => (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "24px",
          padding: "3rem",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(74, 98, 138, 0.2)",
          border: "1px solid rgba(122, 178, 211, 0.3)",
        }}
      >
        {/* Loading Animation */}
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "8px solid #DFF2EB",
            borderTop: "8px solid #7AB2D3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 2rem auto",
          }}
        />

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#2c3e50",
            marginBottom: "1rem",
          }}
        >
          Submitting Service Record...
        </h2>

        <p
          style={{
            color: "#6c757d",
            fontSize: "1rem",
          }}
        >
          Please wait while we update the vehicle passport with your service
          details.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const renderFormPage = () => (
    <div>
      {/* Header Section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
          padding: "2rem 0",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={handleFormCancel}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#4A628A",
                padding: "0.75rem",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.3)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.2)")
              }
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "#2c3e50",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Vehicle Service Update
              </h1>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#4A628A",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                Record comprehensive service details for vehicle passport
              </p>
            </div>
          </div>

          {/* Vehicle Info Header Card */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              {/* Vehicle Details */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
                    borderRadius: "16px",
                    padding: "1rem",
                    color: "white",
                  }}
                >
                  <Car size={32} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {vehicleData.plateNumber}
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#6c757d",
                      margin: 0,
                    }}
                  >
                    {vehicleData.year} {vehicleData.make} {vehicleData.model}
                  </p>
                </div>
              </div>

              {/* Customer Details */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                    borderRadius: "16px",
                    padding: "1rem",
                    color: "#16a34a",
                  }}
                >
                  <User size={32} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {customerData.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#6c757d",
                      margin: 0,
                    }}
                  >
                    {customerData.phone}
                  </p>
                </div>
              </div>

              {/* Current Mileage */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                    borderRadius: "16px",
                    padding: "1rem",
                    color: "#d97706",
                  }}
                >
                  <Settings size={32} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {vehicleData.currentMileage} km
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#6c757d",
                      margin: 0,
                    }}
                  >
                    Current Mileage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <VehicleServiceUpdateForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        initialData={{
          vehicleInfo: vehicleData,
          customerInfo: customerData,
        }}
      />

      {/* Information Footer */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
          padding: "3rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Professional Standards Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
                border: "1px solid rgba(122, 178, 211, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                  }}
                >
                  <CheckCircle size={24} style={{ color: "#2563eb" }} />
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    margin: 0,
                  }}
                >
                  Professional Standards
                </h3>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  color: "#4b5563",
                  fontSize: "0.875rem",
                  lineHeight: "1.7",
                }}
              >
                <li>
                  All service records are permanently stored in the vehicle's
                  digital passport
                </li>
                <li>
                  Complete documentation helps maintain vehicle warranty
                  coverage
                </li>
                <li>
                  Detailed records increase vehicle resale value and buyer
                  confidence
                </li>
                <li>
                  Quality documentation protects your professional reputation
                </li>
              </ul>
            </div>

            {/* Best Practices Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
                border: "1px solid rgba(122, 178, 211, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                  }}
                >
                  <Info size={24} style={{ color: "#16a34a" }} />
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    margin: 0,
                  }}
                >
                  Documentation Best Practices
                </h3>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  color: "#4b5563",
                  fontSize: "0.875rem",
                  lineHeight: "1.7",
                }}
              >
                <li>Include before and after photos of work performed</li>
                <li>Document all part numbers and warranty information</li>
                <li>Record technician certifications and qualifications</li>
                <li>Provide detailed cost breakdowns for transparency</li>
              </ul>
            </div>

            {/* Compliance Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
                border: "1px solid rgba(122, 178, 211, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                  }}
                >
                  <AlertTriangle size={24} style={{ color: "#d97706" }} />
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    margin: 0,
                  }}
                >
                  Compliance & Quality
                </h3>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  color: "#4b5563",
                  fontSize: "0.875rem",
                  lineHeight: "1.7",
                }}
              >
                <li>Ensure all required safety checks are documented</li>
                <li>Follow manufacturer service specifications</li>
                <li>Maintain accurate labor time and cost records</li>
                <li>Complete quality assurance verification process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (currentStep === "success") {
    return renderSuccessPage();
  }

  if (currentStep === "preview" && loading) {
    return renderLoadingPage();
  }

  return renderFormPage();
};

export default VehicleServiceUpdatePage;
