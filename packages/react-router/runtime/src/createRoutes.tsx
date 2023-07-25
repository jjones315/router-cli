// let depth = 0;
// function navigateTree(items: RouteItem[], parent: RouteItem | undefined) {
//     depth += 2;
//     const bracesIndent = getIndent(depth);
//     const indent = getIndent(depth + 1);

import { RouteObject } from "react-router-dom";
import { Route } from "./public/routes";

type Routes = Record<string, () => Promise<Route<any, any, any>>>;
type AppRoutes = {
    app: React.ComponentType<any>;
    notFound: React.ComponentType<any>;
};

type RouteEntry = {
    fullPath: string;
    relativePath: string;
    id: string;
    index: boolean;
    route: () => Promise<Route<any, any, any>>;
    children: RouteEntry[];
}

const createTree = (routes: { layoutImports: Routes, pageImports: Routes }) => {
    // Sort layouts by the number of segments, then alphabetically, helps ensure the output matches so we don't trigger additional writes if watching.
    const pageKeys = Object.keys(routes.pageImports).sort((a, b) => b.split("/").length - a.split("/").length || a.localeCompare(b));

    // Sort layouts by the number of segments.
    const layoutKeys = Object.keys(routes.layoutImports).sort((a, b) => b.split("/").length - a.split("/").length);

    const result = new Map<string, RouteEntry>(pageKeys.map((key) => {
        const path = key.replaceAll("/$", "/:");
        return [key, {
            children: [],
            fullPath: path,
            relativePath: path,
            index: false,
            id: key,
            route: routes.pageImports[key],
        }];
    }));

    const layouts = new Map<string, RouteEntry>(layoutKeys.map((key) => {
        const path = key.replaceAll("/$", "/:");
        return [key, {
            children: [],
            fullPath: path,
            relativePath: path,
            index: false,
            id: key + "/layout",
            route: routes.layoutImports[key],
        }];
    }));

    for (const [layout, layoutRoute] of layouts) {
        const data = layouts.get(layout);
        if (!data) continue;

        for (const [routeKey, route] of result) {
            const layoutRoutePrefix = layout + "/";
            const isChild = routeKey.startsWith(layoutRoutePrefix);
            const isIndex = routeKey === layout
            if (isChild || isIndex) {
                // Remove route from map, we are going to move it to a child of this layout.
                result.delete(routeKey);

                // alter the path to be relative to the layout and remove any empty segments if the layout is also a endpoint.
                route.relativePath = (route.relativePath
                    .substring(layoutRoutePrefix.length, route.relativePath.length)
                    .split("/")
                    .filter(Boolean)
                    .join("/")
                ) || "/";

                route.index = isIndex;

                layoutRoute.children.push(route);
            }
        }
        result.set(layout, layoutRoute);
    }

    return Array.from(result.values());
}
export const createRoutes = ({ appRoutes, ...otherRoutes }: { layoutImports: Routes, pageImports: Routes, appRoutes: AppRoutes }, options?: { defaultErrorComponent: React.ComponentType<any> }): RouteObject[] => {
    const tree = createTree(otherRoutes);

    const mapRoute = (node: RouteEntry): RouteObject => ({
        id: node.id,
        lazy: () => node.route().then(x => x.lazy(options)),
        ...(node.relativePath == "/" ? {
            index: true,
        } : {
            path: node.relativePath,
            children: node.children?.map(mapRoute) || undefined,
        })
    });

    return [
        {
            element: <appRoutes.app />,
            children: [
                ...tree.map(mapRoute),
                {
                    path: '*',
                    element: <appRoutes.notFound />,
                }
            ]
        }
    ]
} 