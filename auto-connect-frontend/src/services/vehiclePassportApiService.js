// src/services/vehiclePassportApiService.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

// Success handler
const handleSuccess = (data, action) => {
  const message = data.message || `Vehicle passport ${action} successfully`;
  if (action !== "fetched") {
    toast.success(message);
  }
  return data;
};

// Error handler
const handleError = (error, action) => {
  const message = error.response?.data?.message || error.message || `Failed to ${action} vehicle passport data`;
  toast.error(message);
  console.error(`Error ${action} vehicle passport:`, error);
  throw error;
};

// Vehicle Passport API endpoints
const vehiclePassportAPI = {
  // Get all vehicles for passport selection
  getPassportVehicles: async () => {
    try {
      const response = await axios.get("/vehicle-passport/vehicles");
      return handleSuccess(response.data, "fetched");
    } catch (error) {
      handleError(error, "fetch vehicles for passport");
    }
  },

  // Get complete vehicle passport data for a specific vehicle
  getVehiclePassport: async (vehicleId) => {
    try {
      const response = await axios.get(`/vehicle-passport/vehicles/${vehicleId}`);
      return handleSuccess(response.data, "fetched");
    } catch (error) {
      handleError(error, "fetch vehicle passport");
    }
  },

  // Export vehicle passport as PDF (placeholder for future implementation)
  exportPassportPDF: async (vehicleId) => {
    try {
      const response = await axios.get(`/vehicle-passport/vehicles/${vehicleId}/export`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vehicle-passport-${vehicleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Vehicle passport exported successfully");
      return response.data;
    } catch (error) {
      handleError(error, "export vehicle passport");
    }
  },

  // Format currency for display
  formatCurrency: (amount) => {
    if (!amount || amount === 0) return "LKR 0";
    return `LKR ${amount.toLocaleString()}`;
  },

  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  },

  // Get status color for badges
  getStatusColor: (status) => {
    const statusColors = {
      'completed': '#059669',
      'active': '#059669',
      'valid': '#059669',
      'pass': '#059669',
      'repaired': '#059669',
      'pending': '#d97706',
      'scheduled': '#d97706',
      'in_progress': '#d97706',
      'expired': '#dc2626',
      'failed': '#dc2626',
      'cancelled': '#dc2626',
      'default': '#6b7280'
    };
    return statusColors[status?.toLowerCase()] || statusColors.default;
  },

  // Calculate time ago for activities
  getTimeAgo: (dateString) => {
    if (!dateString) return "Unknown";

    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  },

  // Validate vehicle ID format
  isValidVehicleId: (vehicleId) => {
    return /^[0-9a-fA-F]{24}$/.test(vehicleId);
  },

  // Get health score color
  getHealthScoreColor: (score) => {
    if (score >= 85) return '#059669'; // Green - Excellent
    if (score >= 70) return '#d97706'; // Orange - Good
    if (score >= 55) return '#f59e0b'; // Yellow - Fair
    return '#dc2626'; // Red - Poor
  },

  // Get priority color for recommendations
  getPriorityColor: (priority) => {
    const priorityColors = {
      'high': '#dc2626',
      'medium': '#d97706',
      'low': '#059669'
    };
    return priorityColors[priority?.toLowerCase()] || '#6b7280';
  },

  // Mock data for testing (remove in production)
  getMockVehiclePassport: () => {
    return {
      success: true,
      data: {
        vehicleInfo: {
          id: "mock_vehicle_001",
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
        },
        serviceRecords: [
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
        ],
        insuranceRecords: [
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
        ],
        emissionRecords: [
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
        ],
        accidentRecords: [],
        documentsInfo: {
          totalDocuments: 12
        },
        vehicleValue: {
          estimatedValue: 2800000,
          currency: "LKR"
        },
        recentActivity: [],
        healthScore: {
          score: 85,
          category: "Excellent"
        },
        recommendations: [
          {
            type: 'maintenance',
            priority: 'medium',
            title: 'Service Due Soon',
            description: 'Schedule your next service within the next month',
            dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
          }
        ]
      }
    };
  }
};

export default vehiclePassportAPI;