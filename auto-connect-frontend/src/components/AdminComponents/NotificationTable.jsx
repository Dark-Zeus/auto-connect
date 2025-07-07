import { useState } from "react";
import {
  Send,
  DoneAll,
} from "@mui/icons-material";
import SendNotificationBox from "./SendNotificationBox";

const sources = ["Insurance Company", "System", "User", "Service Center"];

const initialNotifications = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  message: `Notification message number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  read: i % 3 === 0,
  date: `2025-07-${(i % 30) + 1}`,
  time: `${(9 + (i % 9)).toString().padStart(2, "0")}:00 AM`,
  source: sources[i % sources.length],
}));

const ITEMS_PER_PAGE = 15;

function NotificationTable() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [showSendBox, setShowSendBox] = useState(false);

  const handleSendNotification = (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      read: false,
      date: "2025-07-07", // or use new Date().toISOString().split("T")[0]
      time: "10:00 AM",
      source: "System",
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const applyFilters = () => {
    const today = new Date("2025-07-07");
    return notifications.filter((n) => {
      const notifDate = new Date(n.date);
      const isToday = notifDate.toDateString() === today.toDateString();
      const isYesterday = notifDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString();
      const isLastWeek = notifDate >= new Date("2025-06-30") && notifDate <= new Date("2025-07-06");
      const isLastMonth = notifDate.getMonth() === 5;

      const dateMatch =
        filterDate === "All" ||
        (filterDate === "Today" && isToday) ||
        (filterDate === "Yesterday" && isYesterday) ||
        (filterDate === "Last Week" && isLastWeek) ||
        (filterDate === "Last Month" && isLastMonth);

      const sourceMatch = filterSource === "All" || n.source === filterSource;

      return dateMatch && sourceMatch;
    });
  };

  const filteredNotifications = applyFilters();
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setExpandedId(null);
    }
  };

  return (
    <div className="tw:min-h-screen tw:px-10 tw:pt-10 tw:pb-20 tw:bg-gradient-to-br tw:from-white tw:to-blue-50">
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-10">
        <button
          onClick={() => setShowSendBox(true)}
          className="tw:flex tw:items-center tw:gap-2 tw:bg-blue-500 tw:text-white tw:font-semibold tw:text-lg tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-all"
        >
          <Send fontSize="small" />
          <span>Send Notification</span>
        </button>

        <button
          onClick={markAllAsRead}
          className="tw:flex tw:items-center tw:gap-2 tw:bg-green-600 tw:text-white tw:font-semibold tw:text-lg tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-green-700 tw:transition-all"
        >
          <DoneAll fontSize="small" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filters */}
      <div className="tw:mb-8 tw:p-6 tw:bg-white tw:border tw:border-gray-300 tw:rounded-2xl tw:shadow-md tw:grid tw:grid-cols-2 tw:gap-6">
        <div>
          <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">Filter by Date</label>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
          >
            <option>All</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last Week</option>
            <option>Last Month</option>
          </select>
        </div>
        <div>
          <label className="tw:block tw:mb-2 tw:text-blue-800 tw:font-semibold">Filter by Source</label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
          >
            <option>All</option>
            {sources.map((src) => (
              <option key={src}>{src}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification Cards */}
      <div className="tw:grid tw:grid-cols-2 tw:gap-6">
        {currentNotifications.map((n) => (
          <div
            key={n.id}
            onClick={() => toggleExpand(n.id)}
            className={`tw:cursor-pointer tw:rounded-xl tw:p-5 tw:shadow-md tw:transition-all tw:duration-300 hover:tw:shadow-lg tw:border tw:border-gray-300 ${
              n.read ? "tw:bg-gray-100 tw:text-gray-700" : "tw:bg-blue-100 tw:text-blue-900"
            }`}
          >
            <h3 className="tw:text-lg tw:font-semibold">
              {expandedId === n.id ? n.message : `${n.message.slice(0, 100)}...`}
            </h3>
            <div className="tw:mt-8 tw:text-sm tw:text-gray-600">
              <p>Date: {n.date}</p>
              <p>Time: {n.time}</p>
              <p>Source: {n.source}</p>
            </div>
          </div>
        ))}
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

      {/* Send Notification Box */}
      {showSendBox && (
        <SendNotificationBox
          onClose={() => setShowSendBox(false)}
          onSend={handleSendNotification}
        />
      )}
    </div>
  );
}

export default NotificationTable;
