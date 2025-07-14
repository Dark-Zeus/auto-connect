import HouseIcon from "@mui/icons-material/House";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import BarChartIcon from "@mui/icons-material/BarChart";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import LogoutIcon from "@mui/icons-material/Logout";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    {
      icon: <HouseIcon className="tw:text-black" />,
      label: <span className="tw:text-black">Dashboard</span>,
      path: "/",
    },
    {
      icon: <DocumentScannerIcon className="tw:text-black" />,
      label: <span className="tw:text-black">Insurance Claims</span>,
      path: "/insurance-claims",
    },
    {
      icon: <CarRepairIcon className="tw:text-black" />,
      label: <span className="tw:text-black">Repair Request</span>,
      path: "/repair-request",
    },
    {
      icon: <BarChartIcon className="tw:text-black" />,
      label: <span className="tw:text-black">Repair Status</span>,
      path: "/repair-status",
    },
  ];

  return (
    <aside
      className={`tw:fixed tw:top-0 tw:left-0 tw:z-50 tw:h-screen tw:bg-[#B9E5E8] tw:shadow-lg tw:transition-all tw:duration-300 tw:flex tw:flex-col ${
        isOpen ? "tw:w-80" : "tw:w-20"
      }`}
    >
      <div className="tw:flex tw:justify-end tw:p-2">
        <button
          onClick={toggleSidebar}
          className="tw:text-gray-600 tw:hover:text-blue-500"
        >
          {isOpen ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
        </button>
      </div>

      {isOpen && (
        <h2 className="tw:pb-13 tw:text-3xl tw:font-bold tw:text-center">
          Auto Connect
        </h2>
      )}

      <nav className="tw:flex-1 tw:space-y-2">
        {navItems.map((item, idx) => (
          <Link to={item.path.trim()} key={idx}>
            <div
              className={`tw:flex tw:items-center tw:gap-6 tw:p-4 tw:px-4 tw:rounded tw:cursor-pointer tw:hover:bg-[#7AB2D3] ${
                location.pathname === item.path.trim() ? "tw:bg-[#7AB2D3]" : ""
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      <div
        className={`tw:p-4 ${
          isOpen
            ? "tw:flex tw:items-center tw:justify-between"
            : "tw:flex tw:flex-col tw:items-center tw:space-y-4"
        }`}
      >
        <div
          className={`tw:flex tw:items-center ${
            isOpen ? "tw:gap-3" : "tw:flex-col"
          }`}
        >
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="tw:object-cover tw:w-10 tw:h-10 tw:border-2 tw:border-black tw:rounded-full"
          />
          {isOpen && (
            <div>
              <p className="tw:text-sm tw:font-medium tw:text-gray-800">
                Allianz Insurance
              </p>
            </div>
          )}
        </div>
        <div
          className={`tw:flex tw:items-center tw:text-red-600 tw:rounded tw:cursor-pointer tw:hover:bg-red-100 tw:p-2 ${
            isOpen ? "tw:gap-2" : "tw:flex-col"
          }`}
        >
          <LogoutIcon />
          {isOpen}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
