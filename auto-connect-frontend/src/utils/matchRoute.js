

export function matchRoute(routePattern, currentPath) {
    const routeParts = routePattern.split("/").filter(part => part);
    const pathParts = currentPath.split("/").filter(part => part);

    if (routeParts.length !== pathParts.length) {
        return null;
    }

    const params = {};
    const matches = routeParts.every((routePart, index) => {
        if (routePart.startsWith(":")) {
            const paramName = routePart.slice(1);
            params[paramName] = pathParts[index];
            return true;
        }
        return routePart === pathParts[index];
    });

    return matches ? params : null;
};

