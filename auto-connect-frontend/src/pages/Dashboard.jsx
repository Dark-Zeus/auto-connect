import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import { toast } from "react-toastify";

import { getNavLinks } from "@data/navLinks";
import { matchRoute } from "@utils/matchRoute";

import NavBar from "@components/NavBar";
import BreadcrumbNavigator from "@components/atoms/BreadcrumbNavigator";
import Header from "@components/atoms/Header";
import SubNavBar from "@components/SubNavBar";
import { useSelector } from "react-redux";

import "@components/TwoColContainer.css";
import { UserContext } from "@contexts/UserContext";

function Dashboard({ children }) {
    const location = useLocation();
    
    // Use the context
    const { userContext, setUserContext } = useContext(UserContext);
    
    // DEV MODE: Initialize with default user if not set
    const [isDevMode] = useState(true); // You can control this with an environment variable
    
    // In production, uncomment this line and remove dev logic:
    // const { user } = useSelector((state) => state.auth);
    
    // Initialize dev user if not set
    if (isDevMode && !userContext) {
        setUserContext({
            userName: "sunera",
            role: "service_center"
        });
    }

    const user = userContext; // For compatibility with existing code

    if (!user) {
        toast.error("You must be logged in to access the dashboard.");
        return null; // or redirect to login page
    }
    
    const navLinks = getNavLinks(user);

    const allRoutes = [
        ...navLinks.map(link => ({ ...link, isSub: false })),
        ...navLinks.flatMap(link => link.subNav?.map(sub => ({ ...sub, isSubNav: true })) || []),
        ...navLinks.flatMap(link => link.sub?.map(sub => ({ ...sub, isSub: true })) || []),
        ...navLinks.flatMap(link => link.sub?.flatMap(subItem => subItem.subNav?.map(subSub => ({ ...subSub, isSub: true, isSubNav: true })) || []) || []),
    ];

    const getMatchedRouteAndSubNav = () => {
        let matchedRoute = null;
        let subNav = [];

        // First pass: Find the exact route match
        for (const route of allRoutes) {
            if (route.path) {
                for (const pattern of route.path) {
                    const match = matchRoute(pattern, location.pathname);
                    if (match) {
                        matchedRoute = route;
                        break;
                    }
                }
                if (matchedRoute) break;
            }
        }

        // Second pass: Determine subNav based on current location
        // Check if we're on a route that should show subNav
        for (const topLevelRoute of navLinks) {
            if (topLevelRoute.sub) {
                for (const subRoute of topLevelRoute.sub) {
                    // Check if current path matches this sub route
                    if (subRoute.path) {
                        const isOnSubRoute = subRoute.path.some(pattern =>
                            matchRoute(pattern, location.pathname)
                        );

                        if (isOnSubRoute && subRoute.subNav) {
                            // We're on a route that has subNav - show the subNav
                            subNav = subRoute.subNav;
                            return { matchedRoute, subNav };
                        }
                    }

                    // Check if we're on a subNav route of this sub route
                    if (subRoute.subNav) {
                        const isOnSubNavRoute = subRoute.subNav.some(subNavItem =>
                            subNavItem.path && subNavItem.path.some(pattern =>
                                matchRoute(pattern, location.pathname)
                            )
                        );

                        if (isOnSubNavRoute) {
                            // We're on a subNav route - show the subNav
                            subNav = subRoute.subNav;
                            return { matchedRoute, subNav };
                        }
                    }
                }
            }
        }

        // If no subNav found, check if the matched route itself has sub or subNav
        if (matchedRoute) {
            if (matchedRoute.subNav) {
                subNav = matchedRoute.subNav;
            } else if (matchedRoute.sub) {
                subNav = matchedRoute.sub;
            }
        }

        console.log(subNav);

        return { matchedRoute, subNav };
    }

    const { matchedRoute, subNav } = getMatchedRouteAndSubNav();

    return (
        <>
            {isDevMode && <DevUserSwitcher currentUser={user} onUserChange={setUserContext} />}
            <NavBar navLinks={navLinks} />
            <div className="main-container">
                <Header route={matchedRoute} />
                {subNav.length > 0 ?
                    (<div className="two-col-container __min-max">
                        <SubNavBar subNavLinks={subNav} />
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <BreadcrumbNavigator navLinks={allRoutes} />
                            <div className="scrollable padded">
                                <Routes>
                                    {allRoutes.map((route, index) => (
                                        route.path?.map((path, i) => (
                                            <Route key={`${path}-${i}`} path={path} element={route.page} />
                                        ))
                                    ))}
                                </Routes>
                                <br />
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>) :
                    (
                        <>
                            <BreadcrumbNavigator navLinks={allRoutes} />
                            <div className="scrollable padded">
                                <Routes>
                                    {allRoutes.map((route, index) => (
                                        route.path?.map((path, i) => (
                                            <Route key={`${path}-${i}`} path={path} element={route.page} />
                                        ))
                                    ))}
                                </Routes>
                                <br />
                                <br />
                                <br />
                            </div>
                        </>
                    )
                }
            </div >
        </>
    )
}

//TODO: Remove this component in production
const DevUserSwitcher = ({ currentUser, onUserChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const userRoles = [
        { role: "vehicle_owner", userName: "john_doe", label: "Vehicle Owner", icon: "🚗" },
        { role: "service_center", userName: "sunera", label: "Service Center", icon: "🔧" },
        { role: "repair_center", userName: "mike_repair", label: "Repair Center", icon: "🛠️" },
        { role: "insurance_agent", userName: "sarah_insurance", label: "Insurance Agent", icon: "🛡️" },
        { role: "system_admin", userName: "admin_user", label: "System Admin", icon: "⚙️" }
    ];

    const handleRoleChange = (newRole, newUserName) => {
        const newUser = { userName: newUserName, role: newRole };
        onUserChange(newUser); // This now directly calls setUserContext
        setIsOpen(false);
        
        // Log the change for development
        console.log(`🔄 Dev Mode: Switched to ${newRole} (${newUserName})`);
    };

    const currentRoleData = userRoles.find(r => r.role === currentUser.role);

    return (
        <div style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 50000,
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            minWidth: '200px'
        }}>
            <div style={{
                fontSize: '12px',
                color: '#92400e',
                fontWeight: 'bold',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                <span>🚧</span>
                <span>DEV MODE</span>
            </div>
            
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        width: '100%',
                        minWidth: '180px'
                    }}
                >
                    <span style={{ fontSize: '16px' }}>{currentRoleData?.icon}</span>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontWeight: 'medium' }}>{currentRoleData?.label}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{currentUser.userName}</div>
                    </div>
                    <span style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }}>
                        ▼
                    </span>
                </button>

                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        maxHeight: '240px',
                        overflowY: 'auto',
                        zIndex: 10
                    }}>
                        {userRoles.map((roleData) => (
                            <button
                                key={roleData.role}
                                onClick={() => handleRoleChange(roleData.role, roleData.userName)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    backgroundColor: currentUser.role === roleData.role ? '#dbeafe' : 'white',
                                    color: currentUser.role === roleData.role ? '#1d4ed8' : '#374151',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentUser.role !== roleData.role) {
                                        e.target.style.backgroundColor = '#f9fafb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentUser.role !== roleData.role) {
                                        e.target.style.backgroundColor = 'white';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{roleData.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'medium' }}>{roleData.label}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{roleData.userName}</div>
                                </div>
                                {currentUser.role === roleData.role && (
                                    <span style={{ color: '#3b82f6' }}>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '8px', fontSize: '12px', color: '#4b5563' }}>
                <div><strong>Current User:</strong> {currentUser.userName}</div>
                <div><strong>Current Role:</strong> {currentUser.role}</div>
            </div>
        </div>
    );
};

export default Dashboard;