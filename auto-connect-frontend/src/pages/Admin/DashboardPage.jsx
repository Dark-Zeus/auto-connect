import { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "@contexts/UserContext";
import NotificationPopup from "../../components/Admin_Components/NotificationPopupBox";
import ProfilePopupBox from "../../components/Admin_Components/ProfilePopupBox";

import {
  Dashboard,
  People,
  Garage,
  Notifications,
  PaymentsOutlined,
  Update,
  BarChart as BarIcon,
  Logout,
  Search,
  SystemSecurityUpdateSharp,
  Menu,
} from "@mui/icons-material";

function DashboardPage() {
  let { userContext } = useContext(UserContext);
  userContext = { role: "admin" };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/services": "Service Centers",
    "/users": "User Management",
    "/notifications": "Notifications",
    "/transactions": "Transactions",
    "/updates": "Updates",
    "/analytics": "Analytics",
    "/systemdata": "System Data",
    "/auth": "Logout",
  };

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="tw:w-screen tw:h-screen tw:flex tw:bg-gray-100 tw:text-gray-800 tw:text-base">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "tw:w-80 tw:p-6" : "tw:w-0 tw:p-0"}
          tw:h-full
          tw:bg-gradient-to-b tw:from-blue-100 tw:to-white
          tw:shadow-xl
          tw:overflow-hidden
          tw:transition-all tw:duration-500 tw:ease-in-out
          tw:flex tw:flex-col
        `}
      >
        {sidebarOpen && (
          <>
            <h2 className="tw:text-3xl tw:font-bold tw:mb-10 tw:text-blue-700 tw:tracking-wide tw:select-none">
              Auto Connect
            </h2>
            <nav className="tw:flex-1">
              <ul className="tw:space-y-4 tw:text-2xl tw:font-semibold">
                <SidebarItem to="/" className="!tw:text-black" icon={<Dashboard style={{ fontSize: 35 }} />} text="Dashboard" />
                <SidebarItem to="/services" className="!tw:text-black" icon={<Garage style={{ fontSize: 35 }} />} text="Service Centers" />
                <SidebarItem to="/users" className="!tw:text-black" icon={<People style={{ fontSize: 35 }} />} text="User Management" />
                <SidebarItem to="/notifications" className="!tw:text-black" icon={<Notifications style={{ fontSize: 35 }} />} text="Notifications" />
                <SidebarItem to="/transactions" className="!tw:text-black" icon={<PaymentsOutlined style={{ fontSize: 35 }} />} text="Transactions" />
                <SidebarItem to="/updates" className="!tw:text-black" icon={<Update style={{ fontSize: 35 }} />} text="Updates" />
                <SidebarItem to="/analytics" className="!tw:text-black" icon={<BarIcon style={{ fontSize: 35 }} />} text="Analytics" />
                <SidebarItem to="/systemdata" className="!tw:text-black" icon={<SystemSecurityUpdateSharp style={{ fontSize: 35 }} />} text="System Data" />
                <SidebarItem to="/auth" className="!tw:text-black" icon={<Logout style={{ fontSize: 35 }} />} text="Logout" />
              </ul>
            </nav>
            <footer className="tw:mt-auto tw:pt-6 tw:text-sm tw:text-gray-500 tw:border-t tw:border-gray-300 tw:select-none">
              © 2025 Auto Connect
            </footer>
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="tw:flex-1 tw:flex tw:flex-col tw:h-full tw:overflow-auto">
        {/* Top Navbar */}
        <header className="tw:bg-gray-50 tw:shadow tw:p-6 tw:flex tw:justify-between tw:items-center">
          <div className="tw:flex tw:items-center tw:gap-4">
            <button
              onClick={toggleSidebar}
              className="tw:p-2 tw:rounded hover:tw:bg-gray-200 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
              aria-label="Toggle Sidebar"
            >
              <Menu fontSize="large" />
            </button>
            <h1 className="tw:text-3xl tw:font-bold tw:select-none">{currentTitle}</h1>
          </div>
          <div className="tw:flex tw:items-center tw:gap-6">
            <div className="tw:relative tw:text-gray-600 focus-within:tw:text-gray-900">
              <input
                type="search"
                name="search"
                placeholder="Search..."
                className="tw:py-2 tw:pl-10 tw:pr-4 tw:rounded-lg tw:border tw:border-gray-300 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
                aria-label="Search"
              />
              <Search className="tw:absolute tw:left-3 tw:top-1/2 -tw:translate-y-1/2 tw:text-gray-400" fontSize="small" />
            </div>
            <NotificationPopup />
            <ProfilePopupBox />
          </div>
        </header>

        {/* Nested Content */}
        <main className="tw:p-8 tw:flex-1 tw:overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, text, className = "" }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`
          tw:flex tw:items-center tw:gap-3 tw:px-4 tw:py-2 tw:rounded-lg tw:transition-all tw:duration-300
          ${isActive ? "tw:bg-blue-500 tw:text-white" : "hover:tw:bg-blue-400 hover:tw:text-white"}
          tw:select-none
          ${className}
        `}
      >
        <span className="tw:text-xl">{icon}</span>
        <span className="tw:text-lg tw:font-medium">{text}</span>
      </Link>
    </li>
  );
}

export default DashboardPage;
