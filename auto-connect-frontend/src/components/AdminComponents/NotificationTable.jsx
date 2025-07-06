import { useState } from "react";
import { Send, ExpandMore, ExpandLess, DoneAll } from "@mui/icons-material";

const initialNotifications = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  message: `Notification message number ${i + 1}. Lorem ipsum dolor sit amet.`,
  read: i % 3 === 0,
}));

const ITEMS_PER_PAGE = 15;

function NotificationTable() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = notifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Keep this only once here
  function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setExpandedId(null);
    }
  }

  return (
    <div className="tw:min-h-screen tw:px-10 tw:pt-10 tw:pb-20 tw:bg-gradient-to-br tw:from-white tw:to-blue-50">
      {/* Header */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-10">
        <h2 className="tw:text-4xl tw:font-bold tw:text-blue-800">Notifications</h2>
        <div className="tw:flex tw:gap-4">
          <button
            onClick={markAllAsRead}
            className="tw:flex tw:items-center tw:gap-2 tw:bg-green-500 tw:text-white tw:font-semibold tw:text-lg tw:px-5 tw:py-2 tw:rounded-xl hover:tw:bg-green-600 tw:transition-all"
          >
            <DoneAll fontSize="small" />
            <span>Mark All as Read</span>
          </button>
          <button className="tw:flex tw:items-center tw:gap-2 tw:bg-blue-600 tw:text-white tw:font-semibold tw:text-lg tw:px-5 tw:py-2 tw:rounded-xl hover:tw:bg-blue-700 tw:transition-all">
            <Send fontSize="small" />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="tw:overflow-x-auto">
        <table className="tw:min-w-full tw:bg-white tw:shadow-xl tw:rounded-2xl tw:overflow-hidden tw:border tw:border-gray-300">
          <thead className="tw:bg-blue-100">
            <tr>
              <th className="tw:text-left tw:px-6 tw:py-5 tw:text-blue-800 tw:text-xl tw:font-semibold">No.</th>
              <th className="tw:text-left tw:px-6 tw:py-5 tw:text-blue-800 tw:text-xl tw:font-semibold">Message</th>
              <th className="tw:text-left tw:px-6 tw:py-5 tw:text-blue-800 tw:text-xl tw:font-semibold">Status</th>
              <th className="tw:text-right tw:px-6 tw:py-5 tw:text-blue-800 tw:text-xl tw:font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentNotifications.map((n, index) => (
              <tr
                key={n.id}
                className={`tw:group tw:border-b tw:transition-all tw:duration-200 ${
                  n.read
                    ? "tw:bg-gray-100 tw:text-gray-700"
                    : "tw:bg-blue-50 tw:text-blue-900"
                }`}
              >
                <td className="tw:px-6 tw:py-5 tw:text-xl">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="tw:px-6 tw:py-5 tw:text-xl">
                  <span
                    className={`tw:inline-block tw:px-4 tw:py-2 tw:rounded-full tw:text-base ${
                      n.read
                        ? "tw:bg-gray-300 tw:text-gray-800"
                        : "tw:bg-blue-300 tw:text-blue-900"
                    }`}
                  >
                    {n.message.length > 50
                      ? n.message.substring(0, 50) + "..."
                      : n.message}
                  </span>

                  {expandedId === n.id && (
                    <div className="tw:mt-3 tw:text-base tw:text-gray-700 tw:font-normal tw:p-4 tw:rounded-xl tw:bg-white tw:shadow-inner tw:border tw:border-gray-300">
                      {n.message}
                    </div>
                  )}
                </td>
                <td className="tw:px-6 tw:py-5">
                  {n.read ? (
                    <span className="tw:text-base tw:bg-gray-300 tw:px-3 tw:py-1 tw:rounded-full tw:text-gray-800">
                      Read
                    </span>
                  ) : (
                    <span className="tw:text-base tw:bg-blue-500 tw:px-3 tw:py-1 tw:rounded-full tw:text-white">
                      Unread
                    </span>
                  )}
                </td>
                <td className="tw:px-6 tw:py-5 tw:text-right">
                  <button
                    onClick={() => toggleExpand(n.id)}
                    className="tw:p-2 tw:rounded-full tw:text-blue-700 hover:tw:bg-blue-100"
                    aria-label="Toggle expand notification"
                  >
                    {expandedId === n.id ? <ExpandLess /> : <ExpandMore />}
                  </button>
                </td>
              </tr>
            ))}
            {currentNotifications.length === 0 && (
              <tr>
                <td colSpan="4" className="tw:px-6 tw:py-10 tw:text-center tw:text-gray-400 tw:text-lg">
                  No notifications available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="tw:flex tw:justify-center tw:items-center tw:gap-4 tw:mt-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="tw:px-4 tw:py-2 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`tw:px-4 tw:py-2 tw:rounded-xl tw:font-bold ${
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
          className="tw:px-4 tw:py-2 tw:bg-blue-200 tw:rounded-xl tw:font-semibold tw:text-blue-800 hover:tw:bg-blue-300 disabled:tw:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default NotificationTable;
