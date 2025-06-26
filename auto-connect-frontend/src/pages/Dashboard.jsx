import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import { toast } from "react-toastify";

import { UserContext } from "@contexts/UserContext";
import { getNavLinks } from "@data/navLinks";
import { matchRoute } from "@utils/matchRoute";

import NavBar from "@components/NavBar";
import BreadcrumbNavigator from "@components/atoms/BreadcrumbNavigator";
import Header from "@components/atoms/Header";
import SubNavBar from "@components/SubNavBar";

// function Dashboard({ children }) {
//   const location = useLocation();
//   let { userContext } = useContext(UserContext);

//   userContext = {
//     role: "admin",
//   }
//   const navLinks = getNavLinks(userContext);

//   const allRoutes = [
//     ...navLinks.map(link => ({ ...link, isSub: false })),
//     ...navLinks.flatMap(link => link.subNav?.map(sub => ({ ...sub, isSubNav: true })) || []),
//     ...navLinks.flatMap(link => link.sub?.map(sub => ({ ...sub, isSub: true })) || []),
//     ...navLinks.flatMap(link => link.sub?.flatMap(subItem => subItem.subNav?.map(subSub => ({ ...subSub, isSub: true, isSubNav: true })) || []) || []),
//   ];

//   const getMatchedRouteAndSubNav = () => {
//     let matchedRoute = null;
//     let subNav = [];

//     for (const route of allRoutes) {
//       if (route.path) {
//         for (const pattern of route.path) {
//           const match = matchRoute(pattern, location.pathname);
//           if (match) {
//             matchedRoute = route;
//             break;
//           }
//         }
//         if (matchedRoute) break;
//       }
//     }

//     for (const topLevelRoute of navLinks) {
//       if (topLevelRoute.sub) {
//         for (const subRoute of topLevelRoute.sub) {
//           if (subRoute.path) {
//             const isOnSubRoute = subRoute.path.some(pattern =>
//               matchRoute(pattern, location.pathname)
//             );

//             if (isOnSubRoute && subRoute.subNav) {
//               subNav = subRoute.subNav;
//               return { matchedRoute, subNav };
//             }
//           }

//           if (subRoute.subNav) {
//             const isOnSubNavRoute = subRoute.subNav.some(subNavItem =>
//               subNavItem.path && subNavItem.path.some(pattern =>
//                 matchRoute(pattern, location.pathname)
//               )
//             );

//             if (isOnSubNavRoute) {
//               subNav = subRoute.subNav;
//               return { matchedRoute, subNav };
//             }
//           }
//         }
//       }
//     }

//     if (matchedRoute) {
//       if (matchedRoute.subNav) {
//         subNav = matchedRoute.subNav;
//       } else if (matchedRoute.sub) {
//         subNav = matchedRoute.sub;
//       }
//     }

//     return { matchedRoute, subNav };
//   }

//   const { matchedRoute, subNav } = getMatchedRouteAndSubNav();

  function Dashboard() {
  return (
    <div className="bg-green-50 min-h-screen p-6 text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-2">📊 System Health</h3>
          {[
            ['Database Performance', 'Excellent'],
            ['API Response Time', '125ms'],
            ['Server Load', 'Moderate'],
            ['Storage Usage', '68%'],
            ['Payment Gateway', 'Online'],
          ].map(([key, val], i) => (
            <p key={i} className="flex justify-between text-sm mb-1">
              <span>{key}</span>
              <span className="text-green-600 font-medium">{val}</span>
            </p>
          ))}
        </div>

        {/* Reports & Analytics */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-2">📈 Reports & Analytics</h3>
          {[
            ['Monthly User Report', 'Generate'],
            ['Transaction Analytics', 'View'],
            ['Service Provider Performance', 'Generate'],
            ['Platform Usage Statistics', 'View'],
            ['Security Audit Log', 'Export'],
          ].map(([label, action], i) => (
            <div
              key={i}
              className="flex justify-between items-center text-sm mb-2"
            >
              <span>{label}</span>
              <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">
                {action}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-2">⚙️ Quick Actions</h3>
          {[
            ['Broadcast Notification', 'Send'],
            ['System Maintenance', 'Schedule'],
            ['Backup Database', 'Execute'],
            ['Update Platform', 'Deploy'],
            ['Security Scan', 'Run'],
          ].map(([action, label], i) => (
            <div
              key={i}
              className="flex justify-between items-center text-sm mb-2"
            >
              <span>{action}</span>
              <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;