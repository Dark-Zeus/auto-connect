import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { matchRoute } from "../../utils/matchRoute";

import DropdownMenu from "./DropdownMenu";

import "./BreadcrumbNavigator.css";

function BreadcrumbNavigator({ navLinks }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [fetchingParams, setFetchingParams] = useState(new Set());

    const buildBreadcrumbHierarchy = useCallback(async () => {
        const breadcrumbs = [];
        const currentPath = location.pathname;
        const pathParts = currentPath.split("/").filter(part => part);

        breadcrumbs.push({
            path: "/",
            title: "Home",
            icon: "home",
            isHome: true
        });

        let accumulatedParams = {};
        const newDropdownOptions = {};

        for (let i = 1; i <= pathParts.length; i++) {
            const partialPath = "/" + pathParts.slice(0, i).join("/");

            let matchedRoute = null;
            let matchedParams = {};

            let originalPattern = null;

            for (const route of navLinks) {
                if (route.path) {
                    for (const pattern of route.path) {
                        const match = matchRoute(pattern, partialPath);
                        if (match) {
                            matchedRoute = route;
                            matchedParams = match;
                            originalPattern = pattern
                            break;
                        }
                    }
                    if (matchedRoute) break;
                }
            }

            if (matchedRoute) {
                const paramKeys = Object.keys(matchedParams);

                // Process parameters in order
                for (const param of paramKeys) {
                    accumulatedParams[param] = matchedParams[param];

                    if (matchedRoute.paramResolvers && matchedRoute.paramResolvers[param]) {
                        const resolver = matchedRoute.paramResolvers[param];
                        const result = resolver(state, dispatch, accumulatedParams);

                        if (result.shouldFetch && typeof result.fetchThunk === "function") {
                            const paramKey = `${param}-${JSON.stringify(accumulatedParams)}`;
                            
                            if (!fetchingParams.has(paramKey)) {
                                setFetchingParams(prev => new Set([...prev, paramKey]));
                                
                                try {
                                    await dispatch(result.fetchThunk());
                                } catch (error) {
                                    console.error(`Failed to fetch data for param ${param}:`, error);
                                } finally {
                                    setFetchingParams(prev => {
                                        const newSet = new Set(prev);
                                        newSet.delete(paramKey);
                                        return newSet;
                                    });
                                }
                                
                                // Don't continue building breadcrumbs, let the state change trigger a rebuild
                                return;
                            }
                        }

                        // Set dropdown options
                        newDropdownOptions[param] = (result.options || []).map(opt => ({
                            value: String(opt.value || ''),
                            label: String(opt.label || opt.value || '')
                        }));
                    }
                }

                breadcrumbs.push({
                    path: partialPath,
                    originalPattern: originalPattern,
                    title: matchedRoute.title,
                    icon: matchedRoute.icon,
                    params: Object.entries(matchedParams)
                        .filter(([k, v]) => v === pathParts[i - 1])
                        .map(([k, v]) => ({ key: k, value: v }))
                });
            } else {
                breadcrumbs.push({
                    path: partialPath,
                    originalPattern: originalPattern,
                    title: pathParts[i - 1].charAt(0).toUpperCase() + pathParts[i - 1].slice(1),
                    icon: "folder"
                });
            }
        }

        setDropdownOptions(newDropdownOptions);
        return breadcrumbs;
    }, [location, navLinks, state, dispatch, fetchingParams]);

    useEffect(() => {
        let isCancelled = false;
        
        (async () => {
            try {
                const newBreadcrumbs = await buildBreadcrumbHierarchy();
                if (!isCancelled && newBreadcrumbs) {
                    setBreadcrumbs(newBreadcrumbs);
                }
            } catch (error) {
                console.error("Error building breadcrumb hierarchy:", error);
                if (!isCancelled) {
                    // Set breadcrumbs to at least show the basic structure
                    setBreadcrumbs([{
                        path: "/",
                        title: "Home",
                        icon: "home",
                        isHome: true
                    }]);
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, [buildBreadcrumbHierarchy]);

    const navigateOnParamsChange = (breadcrumb, paramKey, paramValue) => {
        const newPath = breadcrumb.originalPattern.replace(new RegExp(`:${paramKey}($|/)`), `${paramValue}$1`);
        if (newPath !== location.pathname) {
            navigate(newPath);
        }
    };

    const renderBreadcrumbItem = (breadcrumb, index, isLast) => {
        const shouldBeLink = !isLast && breadcrumb.path;
        const hasParams = breadcrumb.params && breadcrumb.params.length > 0;

        const ContainerType = hasParams ? "span" : (shouldBeLink ? Link : "span");
        const containerProps = shouldBeLink ? { to: breadcrumb.path } : {};

        const content = (
            <ContainerType
                {...containerProps}
                key={index}
                className="path-part"
                style={{ paddingRight: hasParams ? "0px" : "10px" }}
                title={breadcrumb.title}
            >
                <span className="horizontal-container">
                    <span className="material-symbols-outlined path-part--icon">
                        {breadcrumb.icon}
                    </span>
                    <span className="path-part--text">
                        {!hasParams && breadcrumb.title}
                    </span>
                    {hasParams && breadcrumb.params.map(({ key, value }) => (
                        <DropdownMenu
                            key={key}
                            pl={"6px"}
                            value={value}
                            options={dropdownOptions[key] || []}
                            height={"30px"}
                            onChange={e => navigateOnParamsChange(breadcrumb, key, e.target.value)}
                        />
                    ))}
                </span>
            </ContainerType>
        );

        if (isLast) {
            return content;
        }

        return (
            <div key={index} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {content}
                <span className="path-part--divider material-symbols-outlined">
                    keyboard_arrow_right
                </span>
            </div>
        );
    };

    return (
        <div className="breadcrumb-container">
            <div className="breadcrumb">
                {breadcrumbs.map((breadcrumb, index) =>
                    renderBreadcrumbItem(breadcrumb, index, index === breadcrumbs.length - 1)
                )}
            </div>
        </div>
    );
}

export default BreadcrumbNavigator;