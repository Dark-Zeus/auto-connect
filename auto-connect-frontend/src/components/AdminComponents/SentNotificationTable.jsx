import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Send, Clock, User, Building2, Users } from "lucide-react";

const sourceIcons = {
  "Insurance Company": <Building2 className="tw:w-4 tw:h-4 tw:text-blue-700" />,
  "System": <Send className="tw:w-4 tw:h-4 tw:text-purple-700" />,
  "User": <User className="tw:w-4 tw:h-4 tw:text-green-700" />,
  "Service Center": <Users className="tw:w-4 tw:h-4 tw:text-orange-700" />,
};

function SentNotificationTable({ sentNotifications }) {
  const ITEMS_PER_PAGE = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState([]);

  const totalPages = Math.ceil(sentNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = sentNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setExpandedIds([]); // Collapse all expanded rows on page change
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(expandedId => expandedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isExpanded = (id) => {
    return expandedIds.includes(id);
  };

  if (sentNotifications.length === 0) {
    return (
      <p className="tw:text-center tw:p-4 tw:text-gray-600 tw:bg-white tw:rounded-xl tw:shadow-md tw:max-w-lg tw:mx-auto">
        No sent notifications yet.
      </p>
    );
  }

  return (
    <div className="tw:max-w-lg tw:w-full tw:bg-white tw:rounded-xl tw:shadow-md tw:p-6 tw:overflow-x-auto">
      <h2 className="tw:text-xl tw:font-semibold tw:mb-4 tw:text-blue-800 tw:flex tw:items-center tw:gap-2">
        <Send className="tw:w-5 tw:h-5 tw:text-blue-700" />
        Sent Notifications
      </h2>
      <table className="tw:w-full tw:text-left tw:border-collapse">
        <thead>
          <tr>
            <th className="tw:text-blue-800 tw:border-b tw:border-gray-300 tw:px-4 tw:py-2">
              Message
            </th>
            <th className="tw:text-blue-800 tw:border-b tw:border-gray-300 tw:px-4 tw:py-2">
              Date Sent
            </th>
          </tr>
        </thead>
        <tbody>
          {currentNotifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <tr
                onClick={() => toggleExpand(notif.id)}
                className="tw:border-b tw:border-gray-200 hover:tw:bg-blue-50 tw:cursor-pointer"
              >
                <td className="tw:text-sm tw:px-4 tw:py-2 tw:break-words">
                  {notif.message}
                </td>
                <td className="tw:text-sm tw:px-4 tw:py-2">{notif.date}</td>
              </tr>
              {isExpanded(notif.id) && (
                <tr className="tw:bg-blue-50">
                  <td colSpan={2} className="tw:px-4 tw:py-2 tw:text-sm tw:text-blue-900">
                    <div className="tw:flex tw:items-center tw:gap-4 tw:flex-wrap">
                      <span className="tw:flex tw:items-center tw:gap-1">
                        <Clock className="tw:w-4 tw:h-4 tw:text-blue-500" />
                        <strong>Time:</strong> {notif.time}
                      </span>
                      <span className="tw:flex tw:items-center tw:gap-1">
                        {sourceIcons[notif.source] || <Send className="tw:w-4 tw:h-4 tw:text-gray-400" />}
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

      {/* Pagination controls */}
      <div className="tw:flex tw:justify-center tw:items-center tw:gap-4 tw:mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="tw:px-3 tw:py-1 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50 tw-flex tw:items-center tw:gap-1"
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
          className="tw:px-3 tw:py-1 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50 tw-flex tw:items-center tw:gap-1"
        >
          Next
          <ChevronRight className="tw:w-4 tw:h-4" />
        </button>
      </div>
    </div>
  );
}

export default SentNotificationTable;