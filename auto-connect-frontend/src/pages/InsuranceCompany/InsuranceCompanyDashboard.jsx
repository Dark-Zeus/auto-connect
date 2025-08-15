import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Users, 
  Car, 
  AlertTriangle,
  DollarSign,
  Plus,
  Filter,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';
import './InsuranceCompanyDashboard.css';

const InsuranceCompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

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
    ...ClaimDetailsTestData
  ];

  const dashboardCards = [
    { title: "Claims Management", description: "Process, review and manage insurance claims efficiently", icon: <FileText />, iconBg: "linear-gradient(45deg, #7AB2D3, #4A628A)", buttonText: "Manage Claims", buttonColor: "btn-blue", action: "manage-claims", stats: `${dashboardStats.activeClaims} Active`, navigateTo: "/claimsmanagement" },
    { title: "Policy Management", description: "Oversee all insurance policies and renewals", icon: <Shield />, iconBg: "linear-gradient(45deg, #B9E5E8, #7AB2D3)", buttonText: "View Policies", buttonColor: "btn-teal", action: "manage-policies", stats: `${dashboardStats.totalPolicies.toLocaleString()} Policies` },
    { title: "Customer Management", description: "Manage customer relationships and communications", icon: <Users />, iconBg: "linear-gradient(45deg, #4A628A, #7AB2D3)", buttonText: "View Customers", buttonColor: "btn-indigo", action: "manage-customers", stats: `${dashboardStats.totalCustomers.toLocaleString()} Customers` },
    { title: "Analytics & Reports", description: "Generate detailed analytics and business reports", icon: <BarChart3 />, iconBg: "linear-gradient(45deg, #B9E5E8, #4A628A)", buttonText: "View Analytics", buttonColor: "btn-purple", action: "analytics", stats: "Real-time Data" },
    { title: "Fraud Detection", description: "Monitor and investigate suspicious claims and activities", icon: <AlertTriangle />, iconBg: "linear-gradient(45deg, #4A628A, #B9E5E8)", buttonText: "Fraud Center", buttonColor: "btn-red", action: "fraud-detection", stats: "12 Flagged Cases" }
  ];

  const quickStats = [
    { label: "Monthly Premiums", value: `${(dashboardStats.monthlyPremiums / 1000000).toFixed(1)}M LKR`, trend: "+12%", trendColor: "text-green-600" },
    { label: "Claims Settled", value: `${(dashboardStats.claimsSettled / 1000000).toFixed(1)}M LKR`, trend: "-8%", trendColor: "text-red-600" },
    { label: "Avg Settlement Time", value: `${dashboardStats.averageSettlementTime} days`, trend: "-15%", trendColor: "text-green-600" },
    { label: "Customer Rating", value: dashboardStats.customerSatisfaction, trend: "+5%", trendColor: "text-green-600" }
  ];

  const policyData = [
    { name: 'Car', value: 120 },
    { name: 'SUV', value: 80 },
    { name: 'Truck', value: 30 },
    { name: 'Van', value: 40 },
    { name: 'Motorcycle', value: 40 },
    { name: 'Others', value: 40 }
  ];

  const claimData = [
    { name: 'Car', value: 60 },
    { name: 'SUV', value: 25 },
    { name: 'Truck', value: 15 },
    { name: 'Motorcycle', value: 20 },
    { name: 'Others', value: 40 }
  ];

  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#dc2626', '#8b5cf6', '#f472b6'];

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-card">
            <h2 className="welcome-title">Insurance Management</h2>
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
                  onClick={() => navigate(card.navigateTo)}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3 className="chart-title">New Policies by Vehicle Category</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={policyData} dataKey="value" nameKey="name" outerRadius={100}>
                  {policyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Claims by Vehicle Category</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={claimData} dataKey="value" nameKey="name" outerRadius={100}>
                  {claimData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="claims-section">
          <div className="section-header">
            <h2 className="section-title">Recent Claims</h2>
          </div>
          <table className="claims-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Amount (LKR)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.slice(0, 6).map((claim) => (
                <tr 
                  key={claim.id} 
                  onClick={() => navigate(`/insurance-claims/${claim.id}`)}
                >
                  <td>{claim.id}</td>
                  <td>{claim.customer}</td>
                  <td>{claim.vehicle}</td>
                  <td>{claim.type}</td>
                  <td>{claim.amount.toLocaleString()}</td>
                  <td>{claim.status}</td>
                  <td>{claim.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
