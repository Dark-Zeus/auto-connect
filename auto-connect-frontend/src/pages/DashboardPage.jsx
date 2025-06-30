import { useContext } from "react";
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
} from "@mui/icons-material";

function DashboardPage() {
  let { userContext } = useContext(UserContext);
  userContext = { role: "admin" };

  return (
    <div className="w-screen h-screen flex bg-gray-100 text-gray-800 text-base">
      {/* Sidebar */}
      <aside className="w-[280px] h-full bg-white shadow-lg p-6">
        <h2 className="text-4xl font-bold mb-10 text-blue-600">Auto Connect</h2>
        <nav>
          <ul className="space-y-8 text-2xl font-semibold">
            <li className="flex items-center gap-3">
              <Dashboard style={{ fontSize: 36 }} />
              <Link to="." className="hover:text-blue-600">Dashboard</Link>
            </li>
            <li className="flex items-center gap-3">
              <Garage style={{ fontSize: 36 }} />
              <Link to="/services" className="hover:text-blue-600">Service Centers</Link>
            </li>
            <li className="flex items-center gap-3">
              <People style={{ fontSize: 36 }} />
              <Link to="/users" className="hover:text-blue-600">User Management</Link>
            </li>
            <li className="flex items-center gap-3">
              <Notifications style={{ fontSize: 36 }} />
              <Link to="/notifications" className="hover:text-blue-600">Notifications</Link>
            </li>
            <li className="flex items-center gap-3">
              <PaymentsOutlined style={{ fontSize: 36 }} />
              <Link to="/transactions" className="hover:text-blue-600">Transactions</Link>
            </li>
            <li className="flex items-center gap-3">
              <Update style={{ fontSize: 36 }} />
              <Link to="/updates" className="hover:text-blue-600">Updates</Link>
            </li>
            <li className="flex items-center gap-3">
              <BarIcon style={{ fontSize: 36 }} />
              <Link to="/analytics" className="hover:text-blue-600">Analytics</Link>
            </li>
            <li className="flex items-center gap-3">
              <Logout style={{ fontSize: 36 }} />
              <Link to="/auth" className="hover:text-blue-600">Logout</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-auto">
        {/* Top Navbar */}
        <header className="bg-white shadow p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
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

        {/* Nested page content renders here */}
        <main className="p-8 flex-1 overflow-auto">
            <Outlet />
            <div className="text-2xl font-semibold text-center text-green-600 mt-10">
                This is the Dashboard layout — sidebar and navbar work!
            </div>
            
            </main>

      </div>
    </div>
  );
}

export default DashboardPage;
