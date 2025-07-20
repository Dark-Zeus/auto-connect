import React, { useState } from "react";
import { Search, Filter, Mail, Calendar, User, MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, Eye, Reply } from "lucide-react";

const contactRequests = [
  {
    id: 1,
    name: "Nimal Perera",
    email: "nimal@example.com",
    subject: "Account Issue",
    message: "I'm unable to verify my email. I've tried multiple times but the verification link doesn't seem to work. Could you please help me resolve this issue?",
    date: "2025-07-18",
    priority: "high",
    status: "unread",
    category: "account"
  },
  {
    id: 2,
    name: "Tharushi Jayasinghe",
    email: "tharushi@example.com",
    subject: "Payment Problem",
    message: "My payment didn't go through, please check. The transaction shows as pending on my bank account but I haven't received confirmation from your system.",
    date: "2025-07-17",
    priority: "urgent",
    status: "in-progress",
    category: "payment"
  },
  {
    id: 3,
    name: "Kasun Fernando",
    email: "kasun@example.com",
    subject: "Service Center Inquiry",
    message: "I want to register my service center with your platform. Could you please provide me with the necessary documentation and requirements?",
    date: "2025-07-16",
    priority: "medium",
    status: "resolved",
    category: "service"
  },
  {
    id: 4,
    name: "Amara Silva",
    email: "amara@example.com",
    subject: "Technical Support",
    message: "The mobile app keeps crashing when I try to upload documents. This has been happening for the past week.",
    date: "2025-07-15",
    priority: "high",
    status: "unread",
    category: "technical"
  },
  {
    id: 5,
    name: "Rajesh Gunaratne",
    email: "rajesh@example.com",
    subject: "Feature Request",
    message: "Would it be possible to add dark mode to the application? It would be really helpful for users who work late hours.",
    date: "2025-07-14",
    priority: "low",
    status: "in-progress",
    category: "feature"
  }
];

export default function UserContacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = contactRequests
    .filter(req => 
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(req => selectedCategory === "all" || req.category === selectedCategory)
    .filter(req => selectedStatus === "all" || req.status === selectedStatus)
    .filter(req => selectedPriority === "all" || req.priority === selectedPriority)
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "priority") {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.name.localeCompare(b.name);
    });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "tw:bg-red-100 tw:text-red-800 tw:border-red-200";
      case "high": return "tw:bg-orange-100 tw:text-orange-800 tw:border-orange-200";
      case "medium": return "tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200";
      case "low": return "tw:bg-green-100 tw:text-green-800 tw:border-green-200";
      default: return "tw:bg-gray-100 tw:text-gray-800 tw:border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "unread": return <Mail className="tw:w-4 tw:h-4 tw:text-blue-600" />;
      case "in-progress": return <Clock className="tw:w-4 tw:h-4 tw:text-orange-600" />;
      case "resolved": return <CheckCircle className="tw:w-4 tw:h-4 tw:text-green-600" />;
      default: return <AlertCircle className="tw:w-4 tw:h-4 tw:text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "unread": return "tw:bg-blue-50 tw:text-blue-700 tw:border tw:border-blue-200";
      case "in-progress": return "tw:bg-orange-50 tw:text-orange-700 tw:border tw:border-orange-200";
      case "resolved": return "tw:bg-green-50 tw:text-green-700 tw:border tw:border-green-200";
      default: return "tw:bg-gray-50 tw:text-gray-700 tw:border tw:border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "account": return <User className="tw:w-4 tw:h-4" />;
      case "payment": return <div className="tw:w-4 tw:h-4 tw:rounded-full tw:bg-green-500" />;
      case "service": return <MessageSquare className="tw:w-4 tw:h-4" />;
      case "technical": return <AlertCircle className="tw:w-4 tw:h-4" />;
      case "feature": return <div className="tw:w-4 tw:h-4 tw:bg-purple-500 tw:rounded" />;
      default: return <MessageSquare className="tw:w-4 tw:h-4" />;
    }
  };

  const stats = {
    total: contactRequests.length,
    unread: contactRequests.filter(r => r.status === "unread").length,
    inProgress: contactRequests.filter(r => r.status === "in-progress").length,
    resolved: contactRequests.filter(r => r.status === "resolved").length,
    urgent: contactRequests.filter(r => r.priority === "urgent").length
  };

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-slate-50 tw:via-blue-50 tw:to-indigo-100">
      <div className="tw:container tw:mx-auto tw:px-4 tw:py-8">
        {/* Header */}
        <div className="tw:mb-8">
          <h1 className="tw:text-4xl tw:font-bold tw:text-gray-800 tw:mb-2">
            Contact Requests Dashboard
          </h1>
          <p className="tw:text-gray-600 tw:text-lg">
            Manage and respond to customer inquiries efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="tw:grid tw:grid-cols-5 md:tw:grid-cols-5 tw:gap-4 tw:mb-8">
          <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-gray-100">
            <div className="tw:text-2xl tw:font-bold tw:text-gray-800">{stats.total}</div>
            <div className="tw:text-sm tw:text-gray-600">Total Requests</div>
          </div>
          <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-gray-100">
            <div className="tw:text-2xl tw:font-bold tw:text-blue-600">{stats.unread}</div>
            <div className="tw:text-sm tw:text-gray-600">Unread</div>
          </div>
          <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-gray-100">
            <div className="tw:text-2xl tw:font-bold tw:text-orange-600">{stats.inProgress}</div>
            <div className="tw:text-sm tw:text-gray-600">In Progress</div>
          </div>
          <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-gray-100">
            <div className="tw:text-2xl tw:font-bold tw:text-green-600">{stats.resolved}</div>
            <div className="tw:text-sm tw:text-gray-600">Resolved</div>
          </div>
          <div className="tw:bg-white tw:rounded-xl tw:p-4 tw:shadow-sm tw:border tw:border-gray-100">
            <div className="tw:text-2xl tw:font-bold tw:text-red-600">{stats.urgent}</div>
            <div className="tw:text-sm tw:text-gray-600">Urgent</div>
          </div>
        </div>

        {/* Controls */}
        <div className="tw:bg-white tw:rounded-xl tw:shadow-sm tw:border tw:border-gray-100 tw:p-6 tw:mb-8">
          <div className="tw:flex tw:flex-col lg:tw:flex-row tw:gap-4 tw:items-center tw:justify-between">
            {/* Search */}
            <div className="tw:relative tw:w-full lg:tw:w-96">
              <Search className="tw:absolute tw:left-3 tw:top-1/2 tw:transform tw:-translate-y-1/2 tw:text-gray-400 tw:w-5 tw:h-5" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tw:w-full tw:pl-10 tw:pr-4 tw:py-3 tw:border tw:border-gray-200 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-blue-500 tw:transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="tw:flex tw:flex-wrap tw:gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="tw:px-4 tw:py-2 tw:border tw:border-gray-200 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="account">Account</option>
                <option value="payment">Payment</option>
                <option value="service">Service</option>
                <option value="technical">Technical</option>
                <option value="feature">Feature</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="tw:px-4 tw:py-2 tw:border tw:border-gray-200 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="tw:px-4 tw:py-2 tw:border tw:border-gray-200 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="tw:px-4 tw:py-2 tw:border tw:border-gray-200 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="tw:mb-6">
          <p className="tw:text-gray-600">
            Showing {filteredRequests.length} of {contactRequests.length} requests
          </p>
        </div>

        {/* Contact Requests Grid */}
        <div className="tw:grid tw:grid-cols-1 lg:tw:grid-cols-2 xl:tw:grid-cols-3 tw:gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="tw:bg-white tw:rounded-xl tw:shadow-sm tw:border tw:border-gray-100 tw:overflow-hidden tw:hover:shadow-md tw:transition-all tw:duration-300 tw:transform tw:hover:-translate-y-1"
            >
              {/* Header */}
              <div className="tw:p-5 tw:pb-4">
                <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                  <div className="tw:flex tw:items-center tw:gap-2">
                    {getCategoryIcon(req.category)}
                    <span className="tw:font-semibold tw:text-gray-800 tw:text-lg">
                      {req.subject}
                    </span>
                  </div>
                  <div className={`tw:px-2 tw:py-1 tw:rounded-full tw:text-xs tw:font-medium tw:border ${getPriorityColor(req.priority)}`}>
                    {req.priority.toUpperCase()}
                  </div>
                </div>

                {/* Status and Date */}
                <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
                  <div className={`tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:rounded-full tw:text-sm tw:font-medium ${getStatusColor(req.status)}`}>
                    {getStatusIcon(req.status)}
                    {req.status.replace("-", " ").toUpperCase()}
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-gray-500">
                    <Calendar className="tw:w-4 tw:h-4" />
                    {req.date}
                  </div>
                </div>

                {/* Message Preview */}
                <p className="tw:text-gray-600 tw:text-sm tw:leading-relaxed tw:mb-4 tw:line-clamp-3">
                  {req.message}
                </p>

                {/* Contact Info */}
                <div className="tw:border-t tw:pt-4 tw:space-y-2">
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <User className="tw:w-4 tw:h-4 tw:text-gray-400" />
                    <span className="tw:font-medium tw:text-gray-700">{req.name}</span>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <Mail className="tw:w-4 tw:h-4 tw:text-gray-400" />
                    <span className="tw:text-blue-600 tw:text-sm">{req.email}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="tw:bg-gray-50 tw:px-5 tw:py-3 tw:flex tw:justify-between tw:items-center">
                <button 
                  onClick={() => setSelectedRequest(req)}
                  className="tw:flex tw:items-center tw:gap-1 tw:text-blue-600 tw:hover:text-blue-700 tw:text-sm tw:font-medium tw:transition-colors"
                >
                  <Eye className="tw:w-4 tw:h-4" />
                  View Details
                </button>
                <div className="tw:flex tw:gap-2">
                  <button className="tw:p-2 tw:text-green-600 tw:hover:bg-green-50 tw:rounded-lg tw:transition-colors">
                    <Reply className="tw:w-4 tw:h-4" />
                  </button>
                  <button className="tw:p-2 tw:text-red-600 tw:hover:bg-red-50 tw:rounded-lg tw:transition-colors">
                    <Trash2 className="tw:w-4 tw:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="tw:text-center tw:py-12">
            <MessageSquare className="tw:w-16 tw:h-16 tw:text-gray-300 tw:mx-auto tw:mb-4" />
            <h3 className="tw:text-xl tw:font-semibold tw:text-gray-600 tw:mb-2">
              No contact requests found
            </h3>
            <p className="tw:text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRequest && (
          <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:bg-opacity-50 tw:flex tw:items-center tw:justify-center tw:p-4 tw:z-50">
            <div className="tw:bg-white tw:rounded-xl tw:shadow-xl tw:max-w-2xl tw:w-full tw:max-h-[90vh] tw:overflow-auto">
              <div className="tw:p-6">
                <div className="tw:flex tw:justify-between tw:items-start tw:mb-6">
                  <div>
                    <h2 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">
                      {selectedRequest.subject}
                    </h2>
                    <div className="tw:flex tw:items-center tw:gap-4 tw:text-sm tw:text-gray-600">
                      <span>ID: #{selectedRequest.id}</span>
                      <span>{selectedRequest.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="tw:text-gray-400 tw:hover:text-gray-600 tw:text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="tw:space-y-4">
                  <div className="tw:bg-gray-50 tw:rounded-lg tw:p-4">
                    <h3 className="tw:font-semibold tw:text-gray-800 tw:mb-2">From:</h3>
                    <p className="tw:text-gray-700">{selectedRequest.name}</p>
                    <p className="tw:text-blue-600">{selectedRequest.email}</p>
                  </div>

                  <div className="tw:bg-gray-50 tw:rounded-lg tw:p-4">
                    <h3 className="tw:font-semibold tw:text-gray-800 tw:mb-2">Message:</h3>
                    <p className="tw:text-gray-700 tw:leading-relaxed">{selectedRequest.message}</p>
                  </div>

                  <div className="tw:flex tw:gap-4 tw:pt-4">
                    <button className="tw:flex-1 tw:bg-blue-600 tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-medium tw:hover:bg-blue-700 tw:transition-colors">
                      Reply
                    </button>
                    <button className="tw:px-6 tw:py-3 tw:border tw:border-gray-300 tw:rounded-lg tw:font-medium tw:text-gray-700 tw:hover:bg-gray-50 tw:transition-colors">
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}