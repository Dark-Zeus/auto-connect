import { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "@contexts/UserContext";
import NotificationPopup from "../../components/AdminComponents/NotificationPopupBox";
import ProfilePopupBox from "../../components/AdminComponents/ProfilePopupBox";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BusinessIcon from "@mui/icons-material/Business";
//import ContactPageIcon from "@mui/icons-material/ContactPage";

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
  Subscriptions,
  WorkspacePremium,
  Money,
  MoneyOffSharp,
  MoneyOutlined,
  TransgenderSharp,
  TranscribeSharp,
  CreditCard,
} from "@mui/icons-material";

function DashboardPage() {
  let { userContext } = useContext(UserContext);
  userContext = { role: "admin" };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/subscription": "Subscriptions Plans",
    "/users": "User Management",
        "/users/vehicleowners": "Vehicle Owners",
        "/users/insurancecompanies": "Insurance Companies",
        "/users/services": "Service & Repair Centers",
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
        tw:bg-gradient-to-b tw:from-blue-100 tw:to-blue-50
        tw:shadow-2xl
        tw:overflow-hidden
        tw:transition-all tw:duration-500 tw:ease-in-out
        tw:flex tw:flex-col
        tw:rounded-r-xl
      `}
    >
      {sidebarOpen && (
        <>
          <h2 className="tw:text-3xl tw:font-extrabold tw:mb-8 tw:!text-blue-800 tw:tracking-wider tw:select-none tw:border-b tw:border-blue-300 tw:pb-10">
            Auto Connect
          </h2>

          <nav className="tw:flex-1">
            <ul className="tw:space-y-3 tw:text-lg tw:font-medium tw:text-gray-800">
              <SidebarItem
                to="/"
                icon={<Dashboard style={{ fontSize: 30 }} className="tw:text-black" />}
                text="Dashboard"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
              <SidebarItem
                to="/subscription"
                icon={<WorkspacePremium style={{ fontSize: 30 }} className="tw:text-black" />}
                text="Sunscriptions Plans"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
              <SidebarDropdown
                icon={<People style={{ fontSize: 30 }} className="tw:text-black" />}
                text="User Management"
                basePath="/users"
                items={[
                  {
                    to: "/users/vehicleowners",
                    label: "Vehicle Owners",
                    icon: <DirectionsCarIcon className="tw:text-gray-500" fontSize="small" />,
                  },
                  {
                    to: "/users/insurancecompanies",
                    label: "Insurance Companies",
                    icon: <BusinessIcon className="tw:text-gray-500" fontSize="small" />,
                  },
                  {
                    to: "/users/services",
                    label: "Service & Repair Centers",
                    icon: <Garage className="tw:text-gray-500" fontSize="small" />,
                  },
                ]}
              />
              <SidebarItem
                to="/notifications"
                icon={<Notifications style={{ fontSize: 30 }} className="tw:text-black" />}
                text="Notifications"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
              <SidebarItem
                to="/transactions"
                icon={<CreditCard style={{ fontSize: 30 }} className="tw:text-black" />}
                text="Transactions"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
              <SidebarItem
                to="/updates"
                icon={<Update style={{ fontSize: 30 }} className="tw:text-black" />}
                text="Updates"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
              <SidebarItem
                to="/analytics"
                icon={<BarIcon style={{ fontSize: 30 }} className="tw:text-black" />}
                text="Analytics"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
              <SidebarItem
                to="/systemdata"
                icon={<SystemSecurityUpdateSharp style={{ fontSize: 30 }} className="tw:text-black" />}
                text="System Data"
                className="tw:!text-black hover:tw:text-blue-800 hover:tw:bg-blue-200 hover:tw:shadow-inner"
              />
            </ul>
          </nav>

          <footer className="tw:mt-auto tw:pt-6 tw:text-sm tw:text-gray-600 tw:border-t tw:border-gray-300 tw:select-none tw:text-center">
            <ul className="tw:mb-2">
              <SidebarItem
                to="/auth"
                icon={<Logout style={{ fontSize: 30 }} className="tw:text-red-600" />}
                text="Logout"
                className="tw:!text-red-600 tw:text-lg hover:tw:text-red-800 hover:tw:bg-red-800 hover:tw:shadow-inner"
              />
            </ul>
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
                className="tw:py-2 tw:pl-14 tw:pr-4 tw:rounded-lg tw:border tw:border-gray-300 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
                aria-label="Search"
              />
              <Search className="tw:absolute tw:top-[-10px] tw:left-[5px] tw:translate-y-1/2 tw:text-gray-400" fontSize="large" />
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
          tw:flex tw:items-center tw:gap-6 tw:px-3 tw:py-2 tw:rounded-xl
          tw:transition-all tw:duration-200
          ${isActive ? "tw:bg-blue-300 tw:text-blue-900" : "tw:text-gray-800"}
          ${className}
          focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-blue-500
          active:tw:bg-blue-300 active:tw:text-blue-900
        `}
      >
        {icon}
        <span className="tw:text-2lg">{text}</span>
      </Link>
    </li>
  );
}

function SidebarDropdown({ icon, text, basePath, items }) {
  const location = useLocation();
  const isParentActive = location.pathname.startsWith(basePath);
  const [open, setOpen] = useState(isParentActive);

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className={`
          tw:flex tw:items-center tw:gap-6 tw:px-3 tw:py-2 tw:rounded-xl
          tw:w-full tw:text-left
          ${isParentActive ? "tw:bg-blue-300 tw:text-blue-900" : "tw:text-gray-800"}
          hover:tw:bg-blue-200 hover:tw:text-blue-800 hover:tw:shadow-inner
          focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-blue-500
        `}
      >
        {icon}
        <span className="tw:text-2lg">{text}</span>
      </button>
      {open && (
        <ul className="tw:pl-14 tw:pt-2 tw:space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`
                  tw:flex tw:items-center tw:gap-3 tw:px-2 tw:py-1 tw:rounded tw:transition-colors
                  ${isActive ? "tw:!text-blue-900 tw:!font-semibold tw:!bg-blue-200" : "tw:!text-gray-800"}
                  hover:tw:!text-blue-800 hover:tw:!bg-blue-50
                `}
              >
                {/* Render the icon if present */}
                {item.icon && <span className="tw:w-4">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        </ul>
      )}
    </li>
  );
}

export default DashboardPage;
