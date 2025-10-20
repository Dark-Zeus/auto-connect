import { useState } from "react";
import { CheckCheck, ChevronLeft, ChevronRight, Bell, Filter, CalendarDays, User, Building2, Users } from "lucide-react";
import SendNotificationBox from "./SendNotificationBox";
import SendNotificationTable from "./SentNotificationTable";

const sources = ["Insurance Company", "System", "User", "Service Center"];

const sourceIcons = {
  "Insurance Company": <Building2 className="tw:w-4 tw:h-4 tw:text-blue-700" />,
  "System": <Bell className="tw:w-4 tw:h-4 tw:text-purple-700" />,
  "User": <User className="tw:w-4 tw:h-4 tw:text-green-700" />,
  "Service Center": <Users className="tw:w-4 tw:h-4 tw:text-orange-700" />,
};

const messages = [
  "New service center registration request received.",
  "A user submitted a new support ticket.",
  "Payment report from July has been generated.",
  "New insurance company application submitted.",
  "A service center updated their business profile.",
  "A user has reported an issue with a booking.",
  "Monthly analytics summary is now available.",
  "Subscription payment received from Kasun Jayasuriya.",
  "New user complaint logged in the system.",
  "Rashmika Dilmin submitted a plan change request.",
  "A service provider requested account verification.",
  "You received a message from Super Wheels Service Center.",
  "New contact request received via the help center.",
  "System backup completed successfully.",
  "A new route proposal was submitted by City Auto.",
];

const initialNotifications = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  message: messages[i % messages.length],
  read: i % 3 === 0,
  date: `2025-07-${(i % 30 + 1).toString().padStart(2, "0")}`,
  time: `${(9 + (i % 9)).toString().padStart(2, "0")}:00 AM`,
  source: sources[i % sources.length],
}));

const ITEMS_PER_PAGE = 10;

function NotificationTable() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sentNotifications, setSentNotifications] = useState([]); // <-- start empty

  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("All");
  const [filterSource, setFilterSource] = useState("All");


  const handleSendNotification = (message) => {
    const newNotification = {
      id: sentNotifications.length + 1,
      message,
      source: "System",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setSentNotifications((prev) => [newNotification, ...prev]);
  };

  const applyFilters = () => {
    const today = new Date("2025-07-10");
    return notifications.filter((n) => {
      const notifDate = new Date(n.date);
      const isToday = notifDate.toDateString() === today.toDateString();
      const isYesterday =
        notifDate.toDateString() ===
        new Date(today.setDate(today.getDate() - 1)).toDateString();
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
  const currentNotifications = filteredNotifications.slice(
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

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setExpandedId(null);
    }
  };

  return (
    <div className="tw:min-h-screen tw:px-10 tw:pt-10 tw:pb-20 tw:bg-gradient-to-br tw:bg-[var(--primary-light)] tw:to-blue-50">
      <div className="tw:grid tw:grid-cols-3 tw:gap-10">
        <div className="tw:col-span-2">
          {/* Received Notifications Box */}
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-6 tw:border tw:border-blue-100">
            <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
              <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 flex tw:items-center gap-2">
                <Bell className="tw:w-6 tw:h-6 tw:text-blue-700" />
                Received Notifications
              </h2>
              <button
                onClick={markAllAsRead}
                className="tw:flex tw:items-center tw:gap-2 tw:bg-green-600 tw:text-white tw:font-semibold tw:text-lg tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-green-700 tw:transition-all"
              >
                <CheckCheck className="tw:w-5 tw:h-5" />
                <span>Mark All as Read</span>
              </button>
            </div>

            {/* Received notifications list */}
            <div className="tw:grid tw:grid-cols-1 tw:gap-6">
              {currentNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => toggleExpand(n.id)}
                  className={`tw:cursor-pointer tw:rounded-xl tw:p-5 tw:shadow-md tw:transition-all tw:duration-300 hover:tw:shadow-lg tw:border tw:border-gray-300 ${
                    n.read ? "tw:bg-gray-100 tw:text-gray-700" : "tw:bg-blue-100 tw:text-blue-900"
                  }`}
                >
                  <div className="tw:flex tw:items-center tw:gap-3 tw:mb-2">
                    {sourceIcons[n.source] || <Bell className="tw:w-4 tw:h-4 tw:text-blue-400" />}
                    <span className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-blue-700">{n.source}</span>
                    <span className="tw:text-xs tw:text-gray-400">|</span>
                    <CalendarDays className="tw:w-4 tw:h-4 tw:text-blue-400" />
                    <span className="tw:text-xs tw:text-gray-600">{n.date}</span>
                    <span className="tw:text-xs tw:text-gray-400">|</span>
                    <span className="tw:text-xs tw:text-gray-600">{n.time}</span>
                  </div>
                  <h3 className="tw:text-lg tw:font-semibold tw:mb-2">
                    {n.message.length > 100 && expandedId !== n.id
                      ? `${n.message.slice(0, 200)}...`
                      : n.message}
                  </h3>

                  {n.message.length > 100 && (
                    <p className="tw:text-sm tw:text-blue-700 tw:mb-2">
                      {expandedId === n.id ? "Click to show less" : "Click to read more"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right-side: Send notification box + sent table */}
        <div className="tw:col-span-1 tw:space-y-8">
          <SendNotificationBox onSend={handleSendNotification} onClose={() => {}} />
          <SendNotificationTable sentNotifications={sentNotifications} />
        </div>
      </div>
    </div>
  );
}

export default NotificationTable;
