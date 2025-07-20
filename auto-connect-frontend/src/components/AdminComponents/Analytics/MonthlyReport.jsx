import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  People as Users, 
  AttachMoney as DollarSign, 
  Settings, 
  Business as Building, 
  Security as Shield, 
  DirectionsCar as Car, 
  Campaign as Megaphone, 
  Description as FileText 
} from "@mui/icons-material";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Dummy function to simulate fetching data for a given month/year
async function fetchMonthlyData(monthIndex, year) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentData = {
        totalNewUsers: Math.floor(Math.random() * 100) + 50,
        totalRevenue: (Math.random() * 1000000 + 5000).toFixed(2),
        totalUpdations: Math.floor(Math.random() * 50) + 20,
        totalServiceCenters: Math.floor(Math.random() * 10) + 5,
        totalInsuranceCompanies: Math.floor(Math.random() * 8) + 3,
        totalVehicleSellings: Math.floor(Math.random() * 120) + 60,
        totalAdvertisements: Math.floor(Math.random() * 20) + 10,
        totalReportsSales: Math.floor(Math.random() * 30) + 15,
      };
      
      // Simulate previous month data for growth calculation
      const previousData = {
        totalNewUsers: Math.floor(Math.random() * 100) + 30,
        totalRevenue: (Math.random() * 800000 + 3000).toFixed(2),
        totalUpdations: Math.floor(Math.random() * 40) + 15,
        totalServiceCenters: Math.floor(Math.random() * 8) + 3,
        totalInsuranceCompanies: Math.floor(Math.random() * 6) + 2,
        totalVehicleSellings: Math.floor(Math.random() * 100) + 40,
        totalAdvertisements: Math.floor(Math.random() * 15) + 8,
        totalReportsSales: Math.floor(Math.random() * 25) + 10,
      };
      
      resolve({ currentData, previousData });
    }, 800);
  });
}

// Calculate growth percentage
function calculateGrowth(current, previous) {
  if (previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
}

// Helper to convert data to CSV string
function convertToCSV(data, month, year) {
  const headers = ["Metric", "Current Month", "Previous Month", "Growth %"];
  const metrics = [
    ["Total New Users", data.currentData.totalNewUsers, data.previousData.totalNewUsers],
    ["Total Revenue", data.currentData.totalRevenue, data.previousData.totalRevenue],
    ["Service Updates", data.currentData.totalUpdations, data.previousData.totalUpdations],
    ["Service Centers", data.currentData.totalServiceCenters, data.previousData.totalServiceCenters],
    ["Insurance Companies", data.currentData.totalInsuranceCompanies, data.previousData.totalInsuranceCompanies],
    ["Vehicle Sellings", data.currentData.totalVehicleSellings, data.previousData.totalVehicleSellings],
    ["Advertisements", data.currentData.totalAdvertisements, data.previousData.totalAdvertisements],
    ["Reports Sales", data.currentData.totalReportsSales, data.previousData.totalReportsSales],
  ];
  
  let csv = headers.join(",") + "\n";
  metrics.forEach(([metric, current, previous]) => {
    const growth = calculateGrowth(current, previous);
    csv += `${metric},${current},${previous},${growth}%\n`;
  });
  
  return csv;
}

// Download CSV file
function downloadCSV(data, filename, month, year) {
  const csv = convertToCSV(data, month, year);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  link.click();
}

// Generate PDF content
function generatePDFContent(data, month, year) {
  const metrics = [
    { key: 'totalNewUsers', title: 'New Users', format: 'number' },
    { key: 'totalRevenue', title: 'Revenue', format: 'currency' },
    { key: 'totalUpdations', title: 'Service Updates', format: 'number' },
    { key: 'totalServiceCenters', title: 'Service Centers', format: 'number' },
    { key: 'totalInsuranceCompanies', title: 'Insurance Companies', format: 'number' },
    { key: 'totalVehicleSellings', title: 'Vehicle Sales', format: 'number' },
    { key: 'totalAdvertisements', title: 'Advertisements', format: 'number' },
    { key: 'totalReportsSales', title: 'Reports Sales', format: 'number' },
  ];

  const formatValue = (value, format) => {
    if (format === 'currency') return `LKR ${parseFloat(value).toLocaleString()}`;
    return parseInt(value).toLocaleString();
  };

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Monthly Analysis Report - ${month} ${year}</title>
      <style>
        body { 
          font-family: 'Inter', sans-serif; 
          margin: 40px; 
          color: #333; 
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #3b82f6; 
          padding-bottom: 20px;
        }
        .header h1 { 
          color: #1e40af; 
          margin: 0; 
          font-size: 2.5rem;
        }
        .header p { 
          color: #6b7280; 
          margin: 10px 0 0 0; 
          font-size: 1.1rem;
        }
        .summary { 
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
          padding: 25px; 
          border-radius: 12px; 
          margin-bottom: 30px;
          border-left: 5px solid #3b82f6;
        }
        .summary h2 { 
          color: #1e40af; 
          margin-top: 0; 
          font-size: 1.8rem;
        }
        .metrics-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 20px; 
          margin: 30px 0;
        }
        .metric-card { 
          background: white; 
          border: 1px solid #e5e7eb; 
          border-radius: 12px; 
          padding: 20px; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #3b82f6;
        }
        .metric-card h3 { 
          color: #1f2937; 
          margin: 0 0 15px 0; 
          font-size: 1.2rem;
        }
        .metric-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin: 10px 0;
        }
        .metric-label { 
          color: #6b7280; 
          font-size: 0.9rem;
        }
        .metric-value { 
          font-weight: bold; 
          color: #1f2937;
        }
        .current-value { 
          font-size: 1.4rem; 
          color: #1e40af;
        }
        .growth-positive { 
          color: #059669; 
          font-weight: bold;
        }
        .growth-negative { 
          color: #dc2626; 
          font-weight: bold;
        }
        .growth-badge { 
          padding: 4px 8px; 
          border-radius: 20px; 
          font-size: 0.8rem; 
          font-weight: bold;
        }
        .growth-badge.positive { 
          background: #d1fae5; 
          color: #059669;
        }
        .growth-badge.negative { 
          background: #fee2e2; 
          color: #dc2626;
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          color: #6b7280;
        }
        @media print {
          body { margin: 20px; }
          .metric-card { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Monthly Analysis Report</h1>
        <p>Business Performance Overview for ${month} ${year}</p>
      </div>
      
      <div class="summary">
        <h2>Executive Summary</h2>
        <p>This report provides a comprehensive analysis of key business metrics for ${month} ${year}, including month-over-month growth comparisons and performance indicators across all major business areas.</p>
      </div>
      
      <div class="metrics-grid">
  `;

  metrics.forEach(metric => {
    const current = data.currentData[metric.key];
    const previous = data.previousData[metric.key];
    const growth = calculateGrowth(current, previous);
    const isPositive = growth >= 0;
    
    htmlContent += `
      <div class="metric-card">
        <h3>${metric.title}</h3>
        <div class="metric-row">
          <span class="metric-label">Current Month:</span>
          <span class="metric-value current-value">${formatValue(current, metric.format)}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Previous Month:</span>
          <span class="metric-value">${formatValue(previous, metric.format)}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Growth:</span>
          <span class="growth-badge ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : ''}${growth}%
          </span>
        </div>
      </div>
    `;
  });

  htmlContent += `
      </div>
      
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} | Monthly Analysis Dashboard</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
}

// Download PDF file
function downloadPDF(data, month, year) {
  const htmlContent = generatePDFContent(data, month, year);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create a new window to print
  const printWindow = window.open(url, '_blank');
  printWindow.onload = function() {
    printWindow.print();
    // Close the window after printing
    setTimeout(() => {
      printWindow.close();
      URL.revokeObjectURL(url);
    }, 1000);
  };
}

// Metric Card Component
function MetricCard({ title, current, previous, icon: Icon, format = "number" }) {
  const growth = calculateGrowth(current, previous);
  const isPositive = growth >= 0;
  
  const formatValue = (value) => {
    if (format === "currency") return `LKR ${parseFloat(value).toLocaleString()}`;
    return parseInt(value).toLocaleString();
  };
  
  return (
    <div className="tw:bg-white tw:rounded-xl tw:shadow-lg tw:p-6 tw:border-l-4 tw:border-blue-500 tw:hover:shadow-xl tw:transition-shadow tw:duration-300">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <div className="tw:flex tw:items-center tw:space-x-3">
          <div className="tw:p-3 tw:bg-blue-100 tw:rounded-lg">
            <Icon className="tw:h-6 tw:w-6 tw:text-blue-600" />
          </div>
          <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800">{title}</h3>
        </div>
        <div className={`tw:flex tw:items-center tw:space-x-1 tw:px-3 tw:py-1 tw:rounded-full tw:text-sm tw:font-medium ${
          isPositive ? 'tw:bg-green-100 tw:text-green-800' : 'tw:bg-red-100 tw:text-red-800'
        }`}>
          {isPositive ? <TrendingUp className="tw:h-4 tw:w-4" /> : <TrendingDown className="tw:h-4 tw:w-4" />}
          <span>{Math.abs(growth)}%</span>
        </div>
      </div>
      
      <div className="tw:space-y-2">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-sm tw:text-gray-600">Current Month</span>
          <span className="tw:text-2xl tw:font-bold tw:text-gray-900">{formatValue(current)}</span>
        </div>
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-sm tw:text-gray-500">Previous Month</span>
          <span className="tw:text-lg tw:text-gray-600">{formatValue(previous)}</span>
        </div>
      </div>
      
      <div className="tw:mt-4 tw:bg-gray-50 tw:rounded-lg tw:p-3">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-sm tw:font-medium tw:text-gray-700">Monthly Growth</span>
          <span className={`tw:text-sm tw:font-bold ${isPositive ? 'tw:text-green-600' : 'tw:text-red-600'}`}>
            {isPositive ? '+' : ''}{growth}%
          </span>
        </div>
      </div>
    </div>
  );
}

function MonthlyAnalysisDashboard() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMonthlyData(selectedMonth, selectedYear).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [selectedMonth, selectedYear]);

  const handleDownload = () => {
    if (!data) return;
    const filename = `monthly_growth_report_${selectedYear}_${selectedMonth + 1}.csv`;
    downloadCSV(data, filename, monthNames[selectedMonth], selectedYear);
  };

  const handlePDFDownload = () => {
    if (!data) return;
    downloadPDF(data, monthNames[selectedMonth], selectedYear);
  };

  const metrics = [
    { key: 'totalNewUsers', title: 'New Users', icon: Users, format: 'number' },
    { key: 'totalRevenue', title: 'Revenue', icon: DollarSign, format: 'currency' },
    { key: 'totalUpdations', title: 'Service Updates', icon: Settings, format: 'number' },
    { key: 'totalServiceCenters', title: 'Service Centers', icon: Building, format: 'number' },
    { key: 'totalInsuranceCompanies', title: 'Insurance Companies', icon: Shield, format: 'number' },
    { key: 'totalVehicleSellings', title: 'Vehicle Sales', icon: Car, format: 'number' },
    { key: 'totalAdvertisements', title: 'Advertisements', icon: Megaphone, format: 'number' },
    { key: 'totalReportsSales', title: 'Reports Sales', icon: FileText, format: 'number' },
  ];

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-100 tw:p-6">
      <div className="tw:max-w-7xl tw:mx-auto">
        {/* Header */}
        <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-8 tw:mb-8">
          <div className="tw:flex tw:flex-col md:tw:flex-row md:tw:items-center md:tw:justify-between">
            <div className="tw:mb-6 md:tw:mb-0">
              <h1 className="tw:text-4xl tw:font-bold tw:text-gray-900 tw:mb-2">Monthly Analysis Dashboard</h1>
              <p className="tw:text-lg tw:text-gray-600">Track your business metrics and growth trends</p>
            </div>
            
            <div className="tw:flex tw:flex-col sm:tw:flex-row tw:items-stretch sm:tw:items-center tw:gap-4">
              <div className="tw:flex tw:items-center tw:gap-4">
                <select
                  className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:bg-white tw:shadow-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  aria-label="Select month"
                >
                  {monthNames.map((month, i) => (
                    <option key={month} value={i}>{month}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="2000"
                  max={today.getFullYear()}
                  className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:bg-white tw:shadow-sm tw:w-24"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  aria-label="Select year"
                />
              </div>

              <div className="tw:flex tw:flex-row sm:tw:flex-row tw:gap-3">
                <button
                  onClick={handleDownload}
                  disabled={loading || !data}
                  className="tw:bg-gradient-to-r tw:from-blue-600 tw:to-indigo-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg hover:tw:from-blue-700 hover:tw:to-indigo-700 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:space-x-2 tw:shadow-lg tw:transition-all tw:duration-200 hover:tw:shadow-xl"
                >
                  <Download className="tw:h-5 tw:w-5" />
                  <span>CSV Report</span>
                </button>
                
                <button
                  onClick={handlePDFDownload}
                  disabled={loading || !data}
                  className="tw:bg-gradient-to-r tw:from-emerald-600 tw:to-teal-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg hover:tw:from-emerald-700 hover:tw:to-teal-700 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:space-x-2 tw:shadow-lg tw:transition-all tw:duration-200 hover:tw:shadow-xl"
                >
                  <FileText className="tw:h-5 tw:w-5" />
                  <span>PDF Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-12 tw:text-center">
            <div className="tw:animate-spin tw:rounded-full tw:h-12 tw:w-12 tw:border-b-2 tw:border-blue-600 tw:mx-auto tw:mb-4"></div>
            <p className="tw:text-lg tw:text-gray-600">Loading analytics data...</p>
          </div>
        )}

        {/* Metrics Grid */}
        {data && (
          <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-2 tw:gap-6">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.key}
                title={metric.title}
                current={data.currentData[metric.key]}
                previous={data.previousData[metric.key]}
                icon={metric.icon}
                format={metric.format}
              />
            ))}
          </div>
        )}

        {/* Summary Section */}
        {data && (
          <div className="tw:mt-8 tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-8">
            <h2 className="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mb-6">Growth Summary</h2>
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-6">
              <div className="tw:bg-gradient-to-r tw:from-green-50 tw:to-emerald-50 tw:rounded-lg tw:p-6 tw:border tw:border-green-200">
                <h3 className="tw:text-lg tw:font-semibold tw:text-green-800 tw:mb-2">Top Performer</h3>
                <p className="tw:text-green-700">Revenue showed the strongest growth this month</p>
              </div>
              <div className="tw:bg-gradient-to-r tw:from-blue-50 tw:to-cyan-50 tw:rounded-lg tw:p-6 tw:border tw:border-blue-200">
                <h3 className="tw:text-lg tw:font-semibold tw:text-blue-800 tw:mb-2">Period</h3>
                <p className="tw:text-blue-700">{monthNames[selectedMonth]} {selectedYear}</p>
              </div>
              <div className="tw:bg-gradient-to-r tw:from-purple-50 tw:to-indigo-50 tw:rounded-lg tw:p-6 tw:border tw:border-purple-200">
                <h3 className="tw:text-lg tw:font-semibold tw:text-purple-800 tw:mb-2">Data Points</h3>
                <p className="tw:text-purple-700">{metrics.length} key metrics tracked</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyAnalysisDashboard;