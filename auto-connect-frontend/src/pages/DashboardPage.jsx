import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
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
        className={`${
          sidebarOpen ? "w-96 p-6" : "w-0 p-0"
        } h-full bg-white shadow-lg overflow-hidden transition-all duration-300`}
      >
        {sidebarOpen && (
          <div className="flex flex-col">
            <h2 className="text-4xl font-bold mb-10 text-blue-600">
              Auto Connect
            </h2>
            <nav>
              <ul className="space-y-8 text-2xl font-semibold">
                <SidebarItem to="/" icon={<Dashboard style={{ fontSize: 36 }} />} text="Dashboard" />
                <SidebarItem to="/services" icon={<Garage style={{ fontSize: 36 }} />} text="Service Centers" />
                <SidebarItem to="/users" icon={<People style={{ fontSize: 36 }} />} text="User Management" />
                <SidebarItem to="/notifications" icon={<Notifications style={{ fontSize: 36 }} />} text="Notifications" />
                <SidebarItem to="/transactions" icon={<PaymentsOutlined style={{ fontSize: 36 }} />} text="Transactions" />
                <SidebarItem to="/updates" icon={<Update style={{ fontSize: 36 }} />} text="Updates" />
                <SidebarItem to="/analytics" icon={<BarIcon style={{ fontSize: 36 }} />} text="Analytics" />
                <SidebarItem to="/systemdata" icon={<SystemSecurityUpdateSharp style={{ fontSize: 36 }} />} text="System Data" />
                <SidebarItem to="/auth" icon={<Logout style={{ fontSize: 36 }} />} text="Logout" />
              </ul>
            </nav>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-auto">
        {/* Top Navbar */}
        <header className="bg-gray-50 shadow p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-200">
              <Menu fontSize="large" />
            </button>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative text-gray-600 focus-within:text-gray-900">
              <input
                type="search"
                name="search"
                placeholder="Search..."
                className="py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-200">
              <Notifications fontSize="large" />
              <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold">
                3
              </span>
            </button>
            <span className="text-lg text-gray-700">Rashmika Dilmin</span>
            <img
              src="https://i.pravatar.cc/60?img=12"
              alt="Admin"
              className="w-14 h-14 rounded-full border"
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

function SidebarItem({ to, icon, text }) {
  return (
    <li className="flex items-center gap-3">
      {icon}
      <Link to={to} className="hover:text-blue-600 !text-black">
        {text}
      </Link>
    </li>
  );
}

export default DashboardPage;
