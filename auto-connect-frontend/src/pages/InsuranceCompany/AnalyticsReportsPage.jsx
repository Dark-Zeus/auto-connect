import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Download,
  Filter,
  Calendar,
  PieChart,
  FileText,
  AlertTriangle,
  Users,
  Car,
  Eye,
  RefreshCw,
  Target,
  Activity,
  Shield
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import './AnalyticsReportsPage.css';
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';
import PolicyDetailsTestData from './testData/PolicyDetailsTestData';

const AnalyticsReportsPage = () => {
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2025-12-31' });
  const [reportType, setReportType] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('claims');
  const [activePieIndex, setActivePieIndex] = useState(0);

  // Process claims data for analytics
  const processClaimsData = () => {
    const filtered = ClaimDetailsTestData.filter(claim => {
      const claimDate = new Date(claim.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return claimDate >= startDate && claimDate <= endDate;
    });

    return filtered;
  };

  const filteredClaims = processClaimsData();
  const filteredPolicies = PolicyDetailsTestData.filter(policy => {
    const startDate = new Date(policy.startDate);
    const filterStart = new Date(dateRange.start);
    const filterEnd = new Date(dateRange.end);
    return startDate >= filterStart && startDate <= filterEnd;
  });

  // Calculate key metrics
  const totalClaims = filteredClaims.length;
  const totalPolicies = filteredPolicies.length;
  const approvedClaims = filteredClaims.filter(c => c.status === 'Approved').length;
  const rejectedClaims = filteredClaims.filter(c => c.status === 'Rejected').length;
  const pendingClaims = filteredClaims.filter(c => c.status === 'Pending').length;
  const totalClaimAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const totalPremiums = filteredPolicies.reduce((sum, policy) => sum + policy.premium, 0);
  const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : 0;
  const lossRatio = totalPremiums > 0 ? ((totalClaimAmount / totalPremiums) * 100).toFixed(1) : 0;

  // Claims by status data
  const claimStatusData = [
    { name: 'Approved', value: approvedClaims, color: '#10b981' },
    { name: 'Pending', value: pendingClaims, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedClaims, color: '#ef4444' },
    { name: 'Investigating', value: filteredClaims.filter(c => c.status === 'Investigating').length, color: '#3b82f6' },
    { name: 'Processing', value: filteredClaims.filter(c => c.status.includes('Processing')).length, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

  // Claims by type data
  const claimTypeData = filteredClaims.reduce((acc, claim) => {
    acc[claim.type] = (acc[claim.type] || 0) + 1;
    return acc;
  }, {});
  const claimTypeChartData = Object.entries(claimTypeData).map(([name, value]) => ({ name, value }));

  // Claims by vehicle make
  const claimVehicleData = filteredClaims.reduce((acc, claim) => {
    acc[claim.vehicle] = (acc[claim.vehicle] || 0) + 1;
    return acc;
  }, {});
  const vehicleClaimsData = Object.entries(claimVehicleData).map(([name, value]) => ({ name, value }));

  // Policy distribution by type
  const policyTypeData = filteredPolicies.reduce((acc, policy) => {
    acc[policy.policyType] = (acc[policy.policyType] || 0) + 1;
    return acc;
  }, {});
  const policyDistributionData = Object.entries(policyTypeData).map(([name, value]) => ({ name, value }));

  // Premium vs Claims comparison
  const premiumClaimsData = [
    { category: 'Comprehensive', premiums: 498000, claims: 380000 },
    { category: 'Third Party', premiums: 153000, claims: 95000 },
    { category: 'Third Party Fire & Theft', premiums: 270000, claims: 200000 }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Generate comprehensive PDF report
  const generatePDFReport = () => {
    const reportDate = new Date().toLocaleDateString();
    const reportContent = `
INSURANCE ANALYTICS REPORT
==========================
Generated on: ${reportDate}
Report Period: ${dateRange.start} to ${dateRange.end}

EXECUTIVE SUMMARY
================
Total Policies: ${totalPolicies}
Total Claims: ${totalClaims}
Total Premium Collected: LKR ${totalPremiums.toLocaleString()}
Total Claim Payouts: LKR ${totalClaimAmount.toLocaleString()}
Loss Ratio: ${lossRatio}%
Claim Approval Rate: ${approvalRate}%

CLAIMS BREAKDOWN
===============
Approved Claims: ${approvedClaims} (${((approvedClaims/totalClaims)*100).toFixed(1)}%)
Rejected Claims: ${rejectedClaims} (${((rejectedClaims/totalClaims)*100).toFixed(1)}%)
Pending Claims: ${pendingClaims} (${((pendingClaims/totalClaims)*100).toFixed(1)}%)

CLAIMS BY TYPE
=============
${claimTypeChartData.map(item => `${item.name}: ${item.value} claims`).join('\n')}

CLAIMS BY VEHICLE MAKE
=====================
${vehicleClaimsData.map(item => `${item.name}: ${item.value} claims`).join('\n')}

POLICY DISTRIBUTION
==================
${policyDistributionData.map(item => `${item.name}: ${item.value} policies`).join('\n')}

FINANCIAL METRICS
================
Average Claim Amount: LKR ${(totalClaimAmount / totalClaims).toLocaleString()}
Average Premium: LKR ${(totalPremiums / totalPolicies).toLocaleString()}
Revenue Generated: LKR ${totalPremiums.toLocaleString()}
Claims Paid: LKR ${totalClaimAmount.toLocaleString()}
Net Profit: LKR ${(totalPremiums - totalClaimAmount).toLocaleString()}

---
Report generated by Insurance Management System
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance-analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Key metrics data
  const keyMetrics = [
    {
      title: 'Total Claims',
      value: totalClaims,
      trend: '+12%',
      trendPositive: true,
      icon: <FileText size={24} />,
      colorClass: 'metric-blue'
    },
    {
      title: 'Approval Rate',
      value: `${approvalRate}%`,
      trend: '+5%',
      trendPositive: true,
      icon: <Target size={24} />,
      colorClass: 'metric-green'
    },
    {
      title: 'Loss Ratio',
      value: `${lossRatio}%`,
      trend: '-3%',
      trendPositive: true,
      icon: <TrendingUp size={24} />,
      colorClass: 'metric-yellow'
    },
    {
      title: 'Total Premiums',
      value: `${(totalPremiums / 1000000).toFixed(1)}M`,
      trend: '+8%',
      trendPositive: true,
      icon: <DollarSign size={24} />,
      colorClass: 'metric-purple'
    },
    {
      title: 'Claim Payouts',
      value: `${(totalClaimAmount / 1000000).toFixed(1)}M`,
      trend: '+15%',
      trendPositive: false,
      icon: <Activity size={24} />,
      colorClass: 'metric-red'
    },
    {
      title: 'Active Policies',
      value: PolicyDetailsTestData.filter(p => p.status === 'Active').length,
      trend: '+7%',
      trendPositive: true,
      icon: <Shield size={24} />,
      colorClass: 'metric-cyan'
    }
  ];

  // Claims trend data (monthly aggregation)
  const claimsTrendData = () => {
    const monthlyData = {};
    filteredClaims.forEach(claim => {
      const month = new Date(claim.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, claims: 0, amount: 0 };
      }
      monthlyData[month].claims += 1;
      monthlyData[month].amount += claim.amount;
    });
    return Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const trendData = claimsTrendData();

  // Top claims table data
  const topClaims = [...filteredClaims]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const getStatusColor = (status) => {
    const colors = {
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Pending': 'status-pending',
      'Investigating': 'status-investigating',
      'Processing-Period-01': 'status-processing',
      'Processing-Period-02': 'status-processing',
      'Processing-Period-03': 'status-processing'
    };
    return colors[status] || 'status-default';
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics & Reports</h1>
        <p className="analytics-subtitle">
          Comprehensive insights into claims, policies, and financial performance
        </p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="form-select"
            >
              <option value="all">All Reports</option>
              <option value="claims">Claims Only</option>
              <option value="policies">Policies Only</option>
              <option value="financial">Financial Only</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Primary Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="form-select"
            >
              <option value="claims">Claims Focus</option>
              <option value="revenue">Revenue Focus</option>
              <option value="performance">Performance Focus</option>
            </select>
          </div>
          <button className="download-button" onClick={generatePDFReport}>
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className={`metric-icon ${metric.colorClass}`}>
              {metric.icon}
            </div>
            <h3 className="metric-value">{metric.value}</h3>
            <p className="metric-label">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Claims Status Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">
            <PieChart size={20} />
            Claims Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={claimStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => setActivePieIndex(index)}
              >
                {claimStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Claims by Type */}
        <div className="chart-card">
          <h3 className="chart-title">
            <BarChart3 size={20} />
            Claims by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Claims Trend */}
        <div className="chart-card">
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Monthly Claims Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="claims" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Premium vs Claims Comparison */}
        <div className="chart-card">
          <h3 className="chart-title">
            <DollarSign size={20} />
            Premium vs Claims by Policy Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={premiumClaimsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="premiums" fill="#10b981" radius={[4, 4, 0, 0]} name="Premiums" />
              <Bar dataKey="claims" fill="#ef4444" radius={[4, 4, 0, 0]} name="Claims" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Claims Table */}
      <div className="table-card">
        <h3 className="chart-title">
          <AlertTriangle size={20} />
          Top Claims by Amount
        </h3>
        <div className="table-wrapper">
          <table className="analytics-table">
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
              {topClaims.map((claim, index) => (
                <tr key={claim.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{claim.id}</td>
                  <td>{claim.customer}</td>
                  <td>{claim.vehicle}</td>
                  <td>{claim.type}</td>
                  <td>{claim.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{claim.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3 className="summary-title">
            <DollarSign size={20} />
            Financial Summary
          </h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Revenue:</span>
              <span className="summary-value revenue">LKR {totalPremiums.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Payouts:</span>
              <span className="summary-value expense">LKR {totalClaimAmount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Net Profit:</span>
              <span className={`summary-value ${totalPremiums - totalClaimAmount > 0 ? 'revenue' : 'expense'}`}>
                LKR {(totalPremiums - totalClaimAmount).toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average Claim:</span>
              <span className="summary-value neutral">
                LKR {totalClaims > 0 ? (totalClaimAmount / totalClaims).toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">
            <Activity size={20} />
            Performance Indicators
          </h3>
          <div className="summary-content">
            <div className="performance-item">
              <span className="summary-label">Claim Processing Efficiency:</span>
              <div className="performance-bar-container">
                <div className="performance-bar">
                  <div className="performance-progress" style={{ width: `${approvalRate}%` }}></div>
                </div>
                <span className="performance-value positive">{approvalRate}%</span>
              </div>
            </div>
            <div className="performance-item">
              <span className="summary-label">Loss Ratio:</span>
              <div className="performance-bar-container">
                <div className="performance-bar">
                  <div 
                    className={`performance-progress ${parseFloat(lossRatio) > 60 ? 'progress-danger' : 'progress-warning'}`}
                    style={{ width: `${Math.min(parseFloat(lossRatio), 100)}%` }}
                  ></div>
                </div>
                <span className={`performance-value ${parseFloat(lossRatio) > 60 ? 'negative' : 'warning'}`}>
                  {lossRatio}%
                </span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-label">Active Policies:</span>
              <span className="summary-value positive">
                {PolicyDetailsTestData.filter(p => p.status === 'Active').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Fraud Detection Rate:</span>
              <span className="summary-value negative">
                {((rejectedClaims / totalClaims) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">
            <Users size={20} />
            Customer Insights
          </h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Total Customers:</span>
              <span className="summary-value neutral">
                {new Set(PolicyDetailsTestData.map(p => p.customerName)).size}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Repeat Claimants:</span>
              <span className="summary-value warning">
                {(() => {
                  const claimCounts = {};
                  filteredClaims.forEach(claim => {
                    claimCounts[claim.customer] = (claimCounts[claim.customer] || 0) + 1;
                  });
                  return Object.values(claimCounts).filter(count => count > 1).length;
                })()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">High-Risk Customers:</span>
              <span className="summary-value negative">
                {filteredClaims.filter(c => c.priority === 'urgent' || c.priority === 'high').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Customer Retention:</span>
              <span className="summary-value positive">94.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis Section */}
      <div className="risk-analysis-card">
        <h3 className="chart-title">
          <AlertTriangle size={20} />
          Risk Analysis & Recommendations
        </h3>
        <div className="risk-grid">
          <div className="risk-alert warning">
            <h4 className="risk-title">High-Value Claims Alert</h4>
            <p className="risk-description">
              {filteredClaims.filter(c => c.amount > 200000).length} claims exceed LKR 200,000. 
              Monitor for potential fraud patterns.
            </p>
          </div>
          <div className="risk-alert danger">
            <h4 className="risk-title">Loss Ratio Concern</h4>
            <p className="risk-description">
              Current loss ratio of {lossRatio}% {parseFloat(lossRatio) > 60 ? 'exceeds' : 'is within'} industry benchmark of 60%.
              {parseFloat(lossRatio) > 60 ? ' Consider premium adjustments.' : ' Continue monitoring.'}
            </p>
          </div>
          <div className="risk-alert success">
            <h4 className="risk-title">Performance Strength</h4>
            <p className="risk-description">
              {approvalRate}% approval rate indicates efficient claim processing. 
              Customer satisfaction likely remains high.
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h3 className="export-title">Export Options</h3>
        <div className="export-buttons">
          <button className="export-button green" onClick={generatePDFReport}>
            <Download size={16} />
            Comprehensive Report
          </button>
          <button 
            className="export-button purple"
            onClick={() => {
              const csvContent = [
                ['Claim ID', 'Customer', 'Vehicle', 'Type', 'Amount', 'Status', 'Date'],
                ...filteredClaims.map(claim => [
                  claim.id, claim.customer, claim.vehicle, claim.type, 
                  claim.amount, claim.status, claim.date
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `claims-data-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <FileText size={16} />
            Claims CSV
          </button>
          <button 
            className="export-button cyan"
            onClick={() => {
              const csvContent = [
                ['Policy Number', 'Customer', 'Vehicle Type', 'Premium', 'Status'],
                ...PolicyDetailsTestData.map(policy => [
                  policy.policyNumber, policy.customerName, policy.vehicleType, 
                  policy.premium, policy.status
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `policies-data-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Shield size={16} />
            Policies CSV
          </button>
          <button 
            className="export-button yellow"
            onClick={() => window.print()}
          >
            <Eye size={16} />
            Print Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReportsPage;