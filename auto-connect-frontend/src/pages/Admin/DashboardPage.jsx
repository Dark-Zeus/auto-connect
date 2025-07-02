import { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "@contexts/UserContext";
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

  return (
    <div className="w-screen h-screen flex bg-gray-100 text-gray-800 text-base">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "w-80 p-6" : "w-0 p-0"}
          h-full 
          bg-gradient-to-b from-blue-100 to-white 
          shadow-xl 
          overflow-hidden 
          transition-all duration-500 ease-in-out
          flex flex-col
        `}
      >
        {sidebarOpen && (
          <>
            <h2 className="text-3xl font-bold mb-10 text-blue-700 tracking-wide select-none">
              Auto Connect
            </h2>
            <nav className="flex-1">
              <ul className="space-y-4 text-2xl font-semibold">
                <SidebarItem to="/" className="!text-black" icon={<Dashboard style={{ fontSize: 35 }} />} text="Dashboard" />
                <SidebarItem to="/services" className="!text-black" icon={<Garage style={{ fontSize: 35 }} />} text="Service Centers" />
                <SidebarItem to="/users" className="!text-black" icon={<People style={{ fontSize: 35 }} />} text="User Management" />
                <SidebarItem to="/notifications" className="!text-black" icon={<Notifications style={{ fontSize: 35 }} />} text="Notifications" />
                <SidebarItem to="/transactions" className="!text-black" icon={<PaymentsOutlined style={{ fontSize: 35 }} />} text="Transactions" />
                <SidebarItem to="/updates" className="!text-black" icon={<Update style={{ fontSize: 35 }} />} text="Updates" />
                <SidebarItem to="/analytics" className="!text-black" icon={<BarIcon style={{ fontSize: 35 }} />} text="Analytics" />
                <SidebarItem to="/systemdata" className="!text-black" icon={<SystemSecurityUpdateSharp style={{ fontSize: 35 }} />} text="System Data" />
                <SidebarItem to="/auth" className="!text-black" icon={<Logout style={{ fontSize: 35 }} />} text="Logout" />
              </ul>
            </nav>
            <footer className="mt-auto pt-6 text-sm text-gray-500 border-t border-gray-300 select-none">
              © 2025 Auto Connect
            </footer>
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-auto">
        {/* Top Navbar */}
        <header className="bg-gray-50 shadow p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Sidebar"
            >
              <Menu fontSize="large" />
            </button>
            <h1 className="text-3xl font-bold select-none">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative text-gray-600 focus-within:text-gray-900">
              <input
                type="search"
                name="search"
                placeholder="Search..."
                className="py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-200" aria-label="Notifications">
              <Notifications fontSize="large" />
              <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold">
                3
              </span>
            </button>
            <span className="text-lg text-gray-700 select-none">Rashmika Dilmin</span>
            <img
              src="https://i.pravatar.cc/60?img=12"
              alt="Admin"
              className="w-14 h-14 rounded-full border"
              loading="lazy"
            />
          </div>
        </header>

        {/* Nested Content */}
        <main className="p-8 flex-1 overflow-auto">
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
          flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 
          ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-400 hover:text-white"}
          select-none
          ${className}
        `}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-lg font-medium">{text}</span>
      </Link>
    </li>
  );
}


export default DashboardPage;
