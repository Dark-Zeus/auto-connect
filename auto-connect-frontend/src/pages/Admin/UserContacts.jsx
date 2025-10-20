import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Mail,
  Calendar,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Reply,
} from "lucide-react";
import { contactAPI } from "../../services/contactRequestApiService"; // ✅ Using your fetch-based service
import { toast } from "react-toastify";

function UserContacts() {
  const [contactRequests, setContactRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyTarget, setReplyTarget] = useState(null); // currently replying to this contact

  // ✅ Fetch all contacts from backend
  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const res = await contactAPI.getAllContacts();
      setContactRequests(res.data);
    } catch (error) {
      toast.error("Failed to fetch contact requests.");
      console.error(error);
    }
  }

  // ✅ Handle reply sending
  const handleSendReply = async () => {
    if (!replyTarget || !replyMessage.trim()) {
      toast.warning("Reply message cannot be empty.");
      return;
    }

    try {
      await contactAPI.replyToContact(replyTarget._id, replyMessage);
      toast.success("Reply sent successfully!");
      setReplyMessage("");
      setReplyTarget(null);
      await loadContacts();
    } catch (error) {
      console.error("Reply failed:", error);
      toast.error("Failed to send reply.");
    }
  };

  // ✅ Filters and sorting
  const filteredRequests = contactRequests
    .filter(
      (req) =>
        req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (req) => selectedCategory === "all" || req.category === selectedCategory
    )
    .filter((req) => selectedStatus === "all" || req.status === selectedStatus)
    .filter(
      (req) => selectedPriority === "all" || req.priority === selectedPriority
    )
    .sort((a, b) => {
      if (sortBy === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "priority") {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      }
      return a.name?.localeCompare(b.name || "");
    });

  // ✅ Utility functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "tw:bg-red-100 tw:text-red-800 tw:border-red-200";
      case "high":
        return "tw:bg-orange-100 tw:text-orange-800 tw:border-orange-200";
      case "medium":
        return "tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200";
      case "low":
        return "tw:bg-green-100 tw:text-green-800 tw:border-green-200";
      default:
        return "tw:bg-gray-100 tw:text-gray-800 tw:border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "account":
        return <User className="tw:w-4 tw:h-4 tw:text-blue-500" />;
      case "payment":
        return <div className="tw:w-4 tw:h-4 tw:rounded-full tw:bg-green-500" />;
      case "service":
        return <MessageSquare className="tw:w-4 tw:h-4 tw:text-indigo-500" />;
      case "technical":
        return <AlertCircle className="tw:w-4 tw:h-4 tw:text-red-500" />;
      case "feature":
        return <div className="tw:w-4 tw:h-4 tw:bg-purple-500 tw:rounded" />;
      default:
        return <MessageSquare className="tw:w-4 tw:h-4 tw:text-gray-400" />;
    }
  };

  const stats = {
    total: contactRequests.length,
    unread: contactRequests.filter((r) => r.status === "unread").length,
    inProgress: contactRequests.filter((r) => r.status === "in-progress").length,
    resolved: contactRequests.filter((r) => r.status === "resolved").length,
    urgent: contactRequests.filter((r) => r.priority === "urgent").length,
  };

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-slate-50 tw:via-blue-50 tw:to-indigo-100">
      <div className="tw:container tw:mx-auto tw:px-4 tw:py-8">
        {/* Header */}
        <div className="tw:mb-8">
          <h1 className="tw:text-4xl tw:font-extrabold tw:text-blue-900 tw:mb-2 tw:flex tw:items-center tw:gap-3">
            <MessageSquare className="tw:w-8 tw:h-8 tw:text-blue-500" />
            Contact Requests Dashboard
          </h1>
          <p className="tw:text-gray-600 tw:text-lg">
            Manage and respond to customer inquiries efficiently
          </p>
        </div>

        {/* Stats */}
        <div className="tw:grid tw:grid-cols-5 sm:tw:grid-cols-3 md:tw:grid-cols-5 tw:gap-4 tw:mb-8">
          <div className="tw:bg-blue-50 tw:rounded-xl tw:p-5 tw:shadow-md tw:flex tw:flex-col tw:items-center">
            <MessageSquare className="tw:w-6 tw:h-6 tw:text-blue-400 tw:mb-1" />
            <span className="tw:text-2xl tw:font-bold">{stats.total}</span>
            <span className="tw:text-sm tw:text-gray-600">Total</span>
          </div>
          <div className="tw:bg-blue-100 tw:rounded-xl tw:p-5 tw:shadow-md tw:flex tw:flex-col tw:items-center">
            <Mail className="tw:w-6 tw:h-6 tw:text-blue-500 tw:mb-1" />
            <span className="tw:text-2xl tw:font-bold">{stats.unread}</span>
            <span className="tw:text-sm tw:text-gray-600">Unread</span>
          </div>
          <div className="tw:bg-orange-50 tw:rounded-xl tw:p-5 tw:shadow-md tw:flex tw:flex-col tw:items-center">
            <Clock className="tw:w-6 tw:h-6 tw:text-orange-500 tw:mb-1" />
            <span className="tw:text-2xl tw:font-bold">{stats.inProgress}</span>
            <span className="tw:text-sm tw:text-gray-600">In Progress</span>
          </div>
          <div className="tw:bg-green-50 tw:rounded-xl tw:p-5 tw:shadow-md tw:flex tw:flex-col tw:items-center">
            <CheckCircle className="tw:w-6 tw:h-6 tw:text-green-500 tw:mb-1" />
            <span className="tw:text-2xl tw:font-bold">{stats.resolved}</span>
            <span className="tw:text-sm tw:text-gray-600">Resolved</span>
          </div>
          <div className="tw:bg-red-50 tw:rounded-xl tw:p-5 tw:shadow-md tw:flex tw:flex-col tw:items-center">
            <AlertCircle className="tw:w-6 tw:h-6 tw:text-red-500 tw:mb-1" />
            <span className="tw:text-2xl tw:font-bold">{stats.urgent}</span>
            <span className="tw:text-sm tw:text-gray-600">Urgent</span>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="tw:grid tw:grid-cols-1 lg:tw:grid-cols-2 xl:tw:grid-cols-3 tw:gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:rounded-2xl tw:shadow-lg tw:border tw:border-blue-100 tw:p-6"
            >
              <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                <div className="tw:flex tw:items-center tw:gap-2">
                  {getCategoryIcon(req.category)}
                  <span className="tw:font-semibold tw:text-blue-900 tw:text-lg">
                    {req.subject}
                  </span>
                </div>
                <div
                  className={`tw:px-3 tw:py-1 tw:rounded-full tw:text-xs tw:font-bold tw:border ${getPriorityColor(
                    req.priority
                  )}`}
                >
                  {req.priority?.toUpperCase()}
                </div>
              </div>

              <p className="tw:text-gray-700 tw:text-base tw:leading-relaxed tw:mb-4">
                {req.message}
              </p>

              {req.reply ? (
                <div className="tw:bg-green-50 tw:p-3 tw:rounded-lg tw:text-green-700 tw:text-sm tw:mb-2">
                  <b>Reply:</b> {req.reply}
                </div>
              ) : (
                <button
                  onClick={() => setReplyTarget(req)}
                  className="tw:flex tw:items-center tw:gap-1 tw:text-blue-600 tw:hover:underline tw:text-sm"
                >
                  <Reply className="tw:w-4 tw:h-4" /> Reply
                </button>
              )}

              <div className="tw:text-sm tw:text-gray-500 tw:flex tw:justify-between tw:items-center tw:mt-3">
                <span className="tw:flex tw:items-center tw:gap-1">
                  <User className="tw:w-4 tw:h-4" /> {req.name}
                </span>
                <span className="tw:flex tw:items-center tw:gap-1">
                  <Calendar className="tw:w-4 tw:h-4" />{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="tw:text-center tw:py-12">
            <MessageSquare className="tw:w-16 tw:h-16 tw:text-blue-200 tw:mx-auto tw:mb-4" />
            <h3 className="tw:text-xl tw:font-semibold tw:text-blue-700 tw:mb-2">
              No contact requests found
            </h3>
            <p className="tw:text-blue-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* ✅ Reply Popup */}
      {replyTarget && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50">
          <div className="tw:bg-white tw:rounded-2xl tw:w-[60%] md:tw:w-[300px] tw:p-4 tw:shadow-2xl tw:relative tw:animate-slideIn">
            {/* Header */}
            <div className="tw:bg-gradient-to-r tw:bg-blue-600 tw:text-white tw:font-bold tw:text-lg tw:rounded-t-xl tw:py-2 tw:px-4 tw:mb-4">
              Reply to {replyTarget.name}
            </div>

            {/* Subject */}
            <p className="tw:text-sm tw:text-gray-600 tw:mb-2">
              Subject: <span className="tw:font-medium">{replyTarget.subject}</span>
            </p>

            {/* Original Message */}
            <div className="tw:bg-gray-100 tw:border tw:border-gray-300 tw:rounded-lg tw:p-3 tw:mb-4 tw:text-gray-800 tw:text-sm tw:shadow-inner">
              <b>Message:</b> {replyTarget.message}
            </div>

            {/* Reply Textarea */}
            <textarea
              className="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:p-3 tw:min-h-[120px] tw:resize-none tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400 tw:mb-4"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply message..."
            />

            {/* Buttons */}
            <div className="tw:flex tw:justify-end tw:gap-3">
              <button
                className="tw:px-4 tw:py-2 tw:rounded-lg tw:bg-gray-200 hover:tw:bg-gray-300 tw:font-medium"
                onClick={() => setReplyTarget(null)}
              >
                Cancel
              </button>
              <button
                className="tw:px-4 tw:py-2 tw:rounded-lg tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 tw:font-medium tw:shadow-md hover:tw:shadow-lg"
                onClick={handleSendReply}
              >
                Send Reply
              </button>
            </div>

            {/* Close Button (optional top-right) */}
            <button
              className="tw:absolute tw:top-3 tw:right-3 tw:text-gray-400 hover:tw:text-gray-600"
              onClick={() => setReplyTarget(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

export default UserContacts;
