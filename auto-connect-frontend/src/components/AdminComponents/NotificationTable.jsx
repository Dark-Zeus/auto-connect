import { useState } from "react";
import { DoneAll } from "@mui/icons-material";
import SendNotificationBox from "./SendNotificationBox";
import SendNotificationTable from "./SentNotificationTable";

const sources = ["Insurance Company", "System", "User", "Service Center"];

const initialNotifications = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  message: `Notification message number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  read: i % 3 === 0,
  date: `2025-07-${(i % 30) + 1}`,
  time: `${(9 + (i % 9)).toString().padStart(2, "0")}:00 AM`,
  source: sources[i % sources.length],
}));

const ITEMS_PER_PAGE = 8;

function NotificationTable() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sentNotifications, setSentNotifications] = useState([
      {
        id: 101,
        message: "Reminder: Service Center meeting at 4 PM.",
        date: "2025-07-09",
        time: "09:30 AM",
        source: "System",
      },
      {
        id: 102,
        message: "Monthly policy updates have been published.",
        date: "2025-07-08",
        time: "11:00 AM",
        source: "Insurance Company",
      },
      {
        id: 103,
        message: "New user registration completed successfully.",
        date: "2025-07-10",
        time: "02:15 PM",
        source: "User",
      },
      {
        id: 104,
        message: "Service Center will be closed on July 15th for maintenance.",
        date: "2025-07-07",
        time: "08:00 AM",
        source: "Service Center",
      },
      {
        id: 105,
        message: "System backup completed without errors.",
        date: "2025-07-06",
        time: "12:00 AM",
        source: "System",
      },
      {
        id: 106,
        message: "Insurance claim #12345 has been approved.",
        date: "2025-07-05",
        time: "04:45 PM",
        source: "Insurance Company",
      },
      {
        id: 107,
        message: "User password reset request processed.",
        date: "2025-07-04",
        time: "03:30 PM",
        source: "User",
      },
      {
        id: 108,
        message: "Service Center received new equipment for diagnostics.",
        date: "2025-07-03",
        time: "10:20 AM",
        source: "Service Center",
      },
      {
        id: 109,
        message: "System alert: Unusual login attempt detected.",
        date: "2025-07-02",
        time: "09:00 PM",
        source: "System",
      },
      {
        id: 110,
        message: "Monthly newsletter is now available.",
        date: "2025-07-01",
        time: "08:30 AM",
        source: "Insurance Company",
      },
  ]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("All");
  const [filterSource, setFilterSource] = useState("All");

  const handleSendNotification = (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      read: false,
      date: "2025-07-10",
      time: "10:00 AM",
      source: "System",
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setSentNotifications((prev) => [newNotification, ...prev]);
  };

  const applyFilters = () => {
    const today = new Date("2025-07-10");
    return notifications.filter((n) => {
      const notifDate = new Date(n.date);
      const isToday = notifDate.toDateString() === today.toDateString();
      const isYesterday = notifDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString();
      const isLastWeek = notifDate >= new Date("2025-07-03") && notifDate <= new Date("2025-07-09");
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
      <div className="tw:grid tw:grid-cols-3 tw:gap-10">
        <div className="tw:col-span-2">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
            <button
              onClick={markAllAsRead}
              className="tw:flex tw:items-center tw:gap-2 tw:bg-green-600 tw:text-white tw:font-semibold tw:text-lg tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-green-700 tw:transition-all"
            >
              <DoneAll fontSize="small" />
              <span>Mark All as Read</span>
            </button>

            <div className="tw:flex tw:gap-6 tw:w-full tw:max-w-lg">
              <div className="tw:w-1/2">
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
              <div className="tw:w-1/2">
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
          </div>

          <div className="tw:grid tw:grid-cols-2 tw:gap-6">
            {currentNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => toggleExpand(n.id)}
                className={`tw:cursor-pointer tw:rounded-xl tw:p-5 tw:shadow-md tw:transition-all tw:duration-300 hover:tw:shadow-lg tw:border tw:border-gray-300 ${
                  n.read ? "tw:bg-gray-100 tw:text-gray-700" : "tw:bg-blue-100 tw:text-blue-900"
                }`}
              >
                <h3 className="tw:text-lg tw:font-semibold tw:mb-2">
                  {n.message.length > 100 && expandedId !== n.id
                    ? `${n.message.slice(0, 100)}...`
                    : n.message}
                </h3>

                {n.message.length > 100 && (
                  <p className="tw:text-sm tw:text-blue-700 tw:mb-2">
                    {expandedId === n.id ? "Click to show less" : "Click to read more"}
                  </p>
                )}

                <div className="tw:mt-6 tw:text-sm tw:text-gray-600">
                  <p>Date: {n.date}</p>
                  <p>Time: {n.time}</p>
                  <p>Source: {n.source}</p>
                </div>
              </div>
            ))}
          </div>

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

        <div className="tw:col-span-1 tw:space-y-8">
          <SendNotificationBox onSend={handleSendNotification} onClose={() => {}} />
          <SendNotificationTable sentNotifications={sentNotifications} />
        </div>
      </div>
    </div>
  );
}

export default NotificationTable;