import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Users, 
  Car, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  User,
  BarChart3,
  PieChart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  LogOut,
  Building2
} from 'lucide-react';
import './InsuranceCompanyDashboard.css';

const InsuranceCompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for insurance company dashboard
  const dashboardStats = {
    totalPolicies: 12458,
    activeClaims: 347,
    pendingClaims: 89,
    approvedClaims: 234,
    rejectedClaims: 24,
    totalCustomers: 8945,
    monthlyPremiums: 2840000,
    claimsSettled: 1650000,
    averageSettlementTime: 7.2,
    customerSatisfaction: 4.6
  };

  const recentClaims = [
    { 
      id: 'CLM-2024-001', 
      customer: 'John Silva', 
      vehicle: 'Honda Civic - ABC-1234', 
      type: 'Accident', 
      amount: 150000, 
      status: 'pending',
      date: '2024-08-05',
      priority: 'high'
    },
    { 
      id: 'CLM-2024-002', 
      customer: 'Sarah Fernando', 
      vehicle: 'Toyota Prius - XYZ-5678', 
      type: 'Theft', 
      amount: 280000, 
      status: 'investigating',
      date: '2024-08-04',
      priority: 'urgent'
    },
    { 
      id: 'CLM-2024-003', 
      customer: 'Mike Perera', 
      vehicle: 'Nissan Leaf - DEF-9012', 
      type: 'Vandalism', 
      amount: 45000, 
      status: 'approved',
      date: '2024-08-03',
      priority: 'normal'
    },
    { 
      id: 'CLM-2024-004', 
      customer: 'Lisa Rajapaksa', 
      vehicle: 'BMW X5 - GHI-3456', 
      type: 'Fire Damage', 
      amount: 520000, 
      status: 'processing',
      date: '2024-08-02',
      priority: 'high'
    }
  ];

  const dashboardCards = [
    {
      title: "Claims Management",
      description: "Process, review and manage insurance claims efficiently",
      icon: <FileText />,
      iconBg: "linear-gradient(45deg, #7AB2D3, #4A628A)",
      buttonText: "Manage Claims",
      buttonColor: "btn-blue",
      action: "manage-claims",
      stats: `${dashboardStats.activeClaims} Active`
    },
    {
      title: "Policy Management",
      description: "Oversee all insurance policies and renewals",
      icon: <Shield />,
      iconBg: "linear-gradient(45deg, #B9E5E8, #7AB2D3)",
      buttonText: "View Policies",
      buttonColor: "btn-teal",
      action: "manage-policies",
      stats: `${dashboardStats.totalPolicies.toLocaleString()} Policies`
    },
    {
      title: "Customer Management",
      description: "Manage customer relationships and communications",
      icon: <Users />,
      iconBg: "linear-gradient(45deg, #4A628A, #7AB2D3)",
      buttonText: "View Customers",
      buttonColor: "btn-indigo",
      action: "manage-customers",
      stats: `${dashboardStats.totalCustomers.toLocaleString()} Customers`
    },
    {
      title: "Vehicle Database",
      description: "Access comprehensive vehicle information and history",
      icon: <Car />,
      iconBg: "linear-gradient(45deg, #7AB2D3, #B9E5E8)",
      buttonText: "Vehicle DB",
      buttonColor: "btn-green",
      action: "vehicle-database",
      stats: "15,200+ Vehicles"
    },
    {
      title: "Analytics & Reports",
      description: "Generate detailed analytics and business reports",
      icon: <BarChart3 />,
      iconBg: "linear-gradient(45deg, #B9E5E8, #4A628A)",
      buttonText: "View Analytics",
      buttonColor: "btn-purple",
      action: "analytics",
      stats: "Real-time Data"
    },
    {
      title: "Fraud Detection",
      description: "Monitor and investigate suspicious claims and activities",
      icon: <AlertTriangle />,
      iconBg: "linear-gradient(45deg, #4A628A, #B9E5E8)",
      buttonText: "Fraud Center",
      buttonColor: "btn-red",
      action: "fraud-detection",
      stats: "12 Flagged Cases"
    }
  ];

  const quickStats = [
    { 
      label: "Monthly Premiums", 
      value: `${(dashboardStats.monthlyPremiums / 1000000).toFixed(1)}M LKR`,
      trend: "+12%",
      trendColor: "text-green-600"
    },
    { 
      label: "Claims Settled", 
      value: `${(dashboardStats.claimsSettled / 1000000).toFixed(1)}M LKR`,
      trend: "-8%",
      trendColor: "text-red-600"
    },
    { 
      label: "Avg Settlement Time", 
      value: `${dashboardStats.averageSettlementTime} days`,
      trend: "-15%",
      trendColor: "text-green-600"
    },
    { 
      label: "Customer Rating", 
      value: dashboardStats.customerSatisfaction,
      trend: "+5%",
      trendColor: "text-green-600"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'investigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const ClaimCard = ({ claim }) => (
    <div className="claim-card">
      <div className="claim-header">
        <div className="claim-info">
          <div className={`priority-dot ${getPriorityColor(claim.priority)}`}></div>
          <div>
            <h4 className="claim-id">{claim.id}</h4>
            <p className="claim-customer">{claim.customer}</p>
          </div>
        </div>
        <span className={`claim-status ${getStatusColor(claim.status)}`}>
          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
        </span>
      </div>
      
      <div className="claim-details">
        <div className="claim-detail-item">
          <Car />
          {claim.vehicle}
        </div>
        <div className="claim-detail-item">
          <AlertTriangle />
          {claim.type}
        </div>
        <div className="claim-detail-item">
          <DollarSign />
          {claim.amount.toLocaleString()} LKR
        </div>
      </div>
      
      <div className="claim-footer">
        <span className="claim-date">{claim.date}</span>
        <button className="view-details-btn">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-card">
            <h2 className="welcome-title">Insurance Management Dashboard</h2>
            <h6 className="welcome-text">
              Streamline your insurance operations with comprehensive tools for claims processing, policy management, customer relations, and business analytics.
            </h6>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="stat-number">{stat.value}</h3>
              <h4 className="stat-label">{stat.label}</h4>
              <h4 className={`stat-trend ${stat.trendColor}`}>{stat.trend}</h4>
            </div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <div key={index} className="dashboard-card">
              <div className="card-content">
                <div className="card-icon" style={{ background: card.iconBg }}>
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <p className="card-stats">{card.stats}</p>
                <button 
                  className={`card-button ${card.buttonColor}`}
                  onClick={() => console.log(`Action: ${card.action}`)}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Claims Section */}
        <div className="claims-section">
          <div className="section-header">
            <h2 className="section-title">Recent Claims</h2>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                <span>Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={16} />
                <span>New Claim</span>
              </button>
            </div>
          </div>
          <div className="claims-grid">
            {recentClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
          
          <div className="text-center mt-6">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              View All Claims
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCompanyDashboard;