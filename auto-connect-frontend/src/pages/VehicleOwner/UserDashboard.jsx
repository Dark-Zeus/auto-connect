import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Store,
  FileText,
  Shield,
  Star,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Eye,
  Plus,
  Search,
  History,
  ChevronRight,
  Bell,
  Settings,
  User,
} from 'lucide-react';

// (Use Heroicons if you don't have lucide-react)

const StatCard = ({ title, value, subtitle, icon, trend, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${color} mb-4`}>
          {icon}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {trend && (
        <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  </div>
);

const QuickActionCard = ({ title, icon, color, action }) => (
  <button
    className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
    onClick={() => console.log(`Action: ${action}`)}
  >
    <div className="flex items-center space-x-3">
      <div className={`${color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-gray-700 font-medium text-left">{title}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" />
    </div>
  </button>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`w-2 h-2 rounded-full mt-2 ${
      activity.status === 'completed' ? 'bg-green-400' :
      activity.status === 'new' ? 'bg-blue-400' :
      activity.status === 'updated' ? 'bg-yellow-400' : 'bg-gray-400'
    }`}></div>
    <div className="flex-1">
      <p className="text-sm text-gray-800">{activity.message}</p>
      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
    </div>
  </div>
);

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for dashboard
  const dashboardStats = {
    vehicles: 3,
    activeListings: 2,
    totalAppointments: 8,
    completedAppointments: 5,
    upcomingAppointments: 2,
    pendingAppointments: 1,
    insuranceClaims: 1,
    totalEarnings: 45000,
    avgRating: 4.8,
  };

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'Service appointment completed for Honda Civic', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'listing', message: 'New inquiry for your Outlander listing', time: '5 hours ago', status: 'new' },
    { id: 3, type: 'valuation', message: 'Vehicle valuation updated for Premio', time: '1 day ago', status: 'updated' },
    { id: 4, type: 'insurance', message: 'Insurance claim processed successfully', time: '2 days ago', status: 'completed' },
  ];

  const quickActions = [
    { title: 'Add New Vehicle', icon: <Plus className="w-5 h-5" />, action: 'add-vehicle', color: 'bg-blue-500' },
    { title: 'Find Service Providers', icon: <Search className="w-5 h-5" />, action: 'find-providers', color: 'bg-green-500' },
    { title: 'Book Appointment', icon: <Calendar className="w-5 h-5" />, action: 'book-appointment', color: 'bg-purple-500' },
    { title: 'List Vehicle for Sale', icon: <Store className="w-5 h-5" />, action: 'list-vehicle', color: 'bg-orange-500' },
    { title: 'Request Valuation', icon: <TrendingUp className="w-5 h-5" />, action: 'request-valuation', color: 'bg-indigo-500' },
    { title: 'Claim Insurance', icon: <Shield className="w-5 h-5" />, action: 'claim-insurance', color: 'bg-red-500' },
    { title: 'Vehicle History Report', icon: <FileText className="w-5 h-5" />, action: 'history-report', color: 'bg-teal-500' },
    { title: 'Rate Service Provider', icon: <Star className="w-5 h-5" />, action: 'rate-provider', color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
      {/* Header start */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-1">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, manage your automotive needs</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 shadow-sm">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="mx-2 text-left">
                  <p className="text-sm font-medium text-gray-900 leading-4">John Doe</p>
                  <p className="text-xs text-gray-500 leading-4">Vehicle Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Header end */}

      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="My Vehicles"
            value={dashboardStats.vehicles}
            subtitle="Active vehicles"
            icon={<Car className="w-8 h-8 text-white" />}
            color="bg-blue-500"
            trend={12}
          />
          <StatCard
            title="Active Listings"
            value={dashboardStats.activeListings}
            subtitle={`${dashboardStats.totalEarnings.toLocaleString()} LKR potential`}
            icon={<Store className="w-8 h-8 text-white" />}
            color="bg-green-500"
            trend={8}
          />
          <StatCard
            title="Appointments"
            value={dashboardStats.upcomingAppointments}
            subtitle={`${dashboardStats.completedAppointments} completed this month`}
            icon={<Calendar className="w-8 h-8 text-white" />}
            color="bg-purple-500"
            trend={-5}
          />
          <StatCard
            title="Service Rating"
            value={dashboardStats.avgRating}
            subtitle="Average rating received"
            icon={<Star className="w-8 h-8 text-white" />}
            color="bg-yellow-500"
            trend={15}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions and Appointments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <span className="text-sm text-gray-500">Choose an action to get started</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} {...action} />
                ))}
              </div>
            </div>

            {/* Appointment Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appointment Overview</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.completedAppointments}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.upcomingAppointments}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingAppointments}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities & Aside */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <History className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                View All Activities
              </button>
            </div>

            {/* Insurance Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Insurance Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Active Claims</p>
                      <p className="text-sm text-gray-600">1 in progress</p>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-3 px-4 font-medium transition-all duration-200 transform hover:scale-105">
                  File New Claim
                </button>
                <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl py-3 px-4 font-medium transition-colors">
                  View Claim History
                </button>
              </div>
            </div>

            {/* Vehicle Valuations Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Vehicle Values</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Outlander</span>
                  <span className="text-green-600 font-bold">3.2M LKR</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Civic</span>
                  <span className="text-green-600 font-bold">2.8M LKR</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Premio</span>
                  <span className="text-green-600 font-bold">2.5M LKR</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl py-3 font-medium transition-all duration-200 transform hover:scale-105">
                Update Valuations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
