import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import { toast } from "react-toastify";

import { UserContext } from "contexts/UserContext";
import { getNavLinks } from "data/navLinks";
import { matchRoute } from "utils/matchRoute";

import NavBar from "components/NavBar";
import BreadcrumbNavigator from "components/atoms/BreadcrumbNavigator";
import Header from "components/atoms/Header";
import SubNavBar from "components/SubNavBar";

function Dashboard({ children }) {
    const location = useLocation();
    let { userContext } = useContext(UserContext);

    userContext = {
        role: ""
    }
    const navLinks = getNavLinks(userContext);

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

        return { matchedRoute, subNav };
    }

    const { matchedRoute, subNav } = getMatchedRouteAndSubNav();

    return (
        <>
            <NavBar navLinks={navLinks} />
            <div className="main-container">
                <Header route={matchedRoute} />
                {subNav.length > 0 ?
                    (<div className="two-col-container __min-max">
                        <SubNavBar subNavLinks={subNav} />
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <BreadcrumbNavigator navLinks={allRoutes} />
                            <div className="scrollable">
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
                            <div className="scrollable">
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

export default Dashboard;