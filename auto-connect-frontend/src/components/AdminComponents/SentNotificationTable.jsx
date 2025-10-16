import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Clock,
  User,
  Building2,
  Users,
} from "lucide-react";
import { notificationAPI } from "@/services/notificationApiService";

const sourceIcons = {
  "Insurance Company": <Building2 className="tw:w-4 tw:h-4 tw:text-blue-700" />,
  System: <Send className="tw:w-4 tw:h-4 tw:text-purple-700" />,
  User: <User className="tw:w-4 tw:h-4 tw:text-green-700" />,
  "Service Center": <Users className="tw:w-4 tw:h-4 tw:text-orange-700" />,
};

function SentNotificationTable() {
  const ITEMS_PER_PAGE = 10;
  const [sentNotifications, setSentNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await notificationAPI.getAllSentNotifications();

        if (result.success) {
          const formatted = result.data.map((n) => ({
            id: n._id,
            message: n.message || "(No message)",
            date: new Date(n.createdAt).toLocaleDateString(),
            time: new Date(n.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            source: n.receiverGroup || n.type || "System",
          }));

          setSentNotifications(formatted);
        } else {
          console.error("Failed to fetch notifications:", result.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const totalPages = Math.ceil(sentNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = sentNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedIds([]);
    }
  };

  if (loading) {
    return (
      <div className="tw:bg-white tw:p-6 tw:rounded-xl tw:shadow-md tw:text-center tw:text-gray-500">
        Loading notifications...
      </div>
    );
  }

  if (sentNotifications.length === 0) {
    return (
      <div className="tw:bg-white tw:p-6 tw:rounded-xl tw:shadow-md tw:text-center tw:text-gray-500">
        No sent notifications yet.
      </div>
    );
  }

  return (
    <div className="tw:bg-white tw:rounded-xl tw:shadow-lg tw:p-6">
      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-4 flex tw:items-center tw:gap-2">
        <Send className="tw:w-5 tw:h-5 tw:text-blue-700" />
        Sent Notifications
      </h2>

      <table className="tw:w-full tw:text-left tw:border-collapse">
        <thead>
          <tr>
            <th className="tw:border-b tw:border-gray-300 tw:pt-2 tw:pb-3 tw:px-3 tw:text-blue-700">
              Message
            </th>
            <th className="tw:border-b tw:border-gray-300 tw:pt-2 tw:pb-3 tw:px-3 tw:text-blue-700">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((notif) => (
            <React.Fragment key={notif.id}>
              <tr
                onClick={() => toggleExpand(notif.id)}
                className="hover:tw:bg-blue-50 tw:cursor-pointer tw:border-b tw:border-gray-200"
              >
                <td className="tw:py-2 tw:px-3 tw:text-sm tw:font-medium tw:text-gray-800">
                  {notif.message}
                </td>
                <td className="tw:py-2 tw:px-3 tw:text-sm tw:text-gray-600">
                  {notif.date}
                </td>
              </tr>

              {expandedIds.includes(notif.id) && (
                <tr className="tw:bg-blue-50 tw:text-blue-900">
                  <td colSpan={2} className="tw:py-2 tw:px-3">
                    <div className="tw:flex tw:items-center tw:gap-4 tw:flex-wrap">
                      <span className="tw:flex tw:items-center tw:gap-1">
                        <Clock className="tw:w-4 tw:h-4 tw:text-blue-500" />
                        <strong>Time:</strong> {notif.time}
                      </span>
                      <span className="tw:flex tw:items-center tw:gap-1">
                        {sourceIcons[notif.source] || (
                          <Send className="tw:w-4 tw:h-4 tw:text-gray-400" />
                        )}
                        <strong>Source:</strong> {notif.source}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="tw:flex tw:justify-center tw:items-center tw:gap-3 tw:mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="tw:bg-blue-200 tw:px-3 tw:py-1 tw:rounded-xl tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50 tw:flex tw:items-center tw:gap-1"
        >
          <ChevronLeft className="tw:w-4 tw:h-4" />
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`tw:px-3 tw:py-1 tw:rounded-xl tw:font-bold ${
              currentPage === i + 1
                ? "tw:bg-blue-600 tw:text-white"
                : "tw:bg-gray-200 tw:text-gray-700 hover:tw:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="tw:bg-blue-200 tw:px-3 tw:py-1 tw:rounded-xl tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50 tw:flex tw:items-center tw:gap-1"
        >
          Next
          <ChevronRight className="tw:w-4 tw:h-4" />
        </button>
      </div>
    </div>
  );
}

export default SentNotificationTable;
