import { Outlet, RouteObject } from "react-router-dom";
import React, { Fragment } from "react";
import "./utils/createLazyRoute";
import { createLazyRoute } from "./utils/createLazyRoute";
import { suspendedPromiseCache } from "./hooks/useSuspendedPromise";
import { AnyRouteComponent, RouteComponent } from "./types";

type Routes = Record<string, () => Promise<AnyRouteComponent>>;
type AppRoutes = {
    app: React.ComponentType<any> | undefined;
    notFound: React.ComponentType<any> | undefined;
    error: React.ComponentType<any> | undefined;
    pending: React.ComponentType<any> | undefined;
};

type RouteEntry = {
    fullPath: string;
    relativePath: string;
    id: string;
    index: boolean;
    route: () => Promise<AnyRouteComponent>;
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

    const layoutSuffixLength = "/layout".length;
    const layouts = new Map<string, RouteEntry>(layoutKeys.map((key) => {
        const path = key.replaceAll("/$", "/:").slice(0, -1 * layoutSuffixLength);
        return [key, {
            children: [],
            fullPath: path,
            relativePath: path,
            index: false,
            id: key,
            route: routes.layoutImports[key],
        }];
    }));

    for (const layoutRoute of layouts.values()) {
        if (!layoutRoute) continue;

        for (const route of result.values()) {
            const layoutPathPrefix = layoutRoute.fullPath + "/";
            const isChild = route.fullPath.startsWith(layoutPathPrefix);
            const isIndex = route.fullPath === layoutRoute.fullPath
            if (isChild || isIndex) {
                // Remove route from map, we are going to move it to a child of this layout.
                result.delete(route.id);

                // alter the path to be relative to the layout and remove any empty segments if the layout is also a endpoint.
                route.relativePath = (route.relativePath
                    .substring(layoutPathPrefix.length, route.relativePath.length)
                    .split("/")
                    .filter(Boolean)
                    .join("/")
                ) || "/";

                route.index = isIndex;

                layoutRoute.children.push(route);
            }
        }
        result.set(layoutRoute.id, layoutRoute);
    }

    return Array.from(result.values());
}
export const createRoutes = ({ appRoutes, ...otherRoutes }: { layoutImports: Routes, pageImports: Routes, appRoutes: AppRoutes }): RouteObject[] => {
    const tree = createTree(otherRoutes);

    const mapRoute = (node: RouteEntry): RouteObject => ({
        id: node.id,
        lazy: () => node.route().then(x => {
            // load the route into the module cache to be used in hooks.
            suspendedPromiseCache.preloadValue(x, node.id);
            const lazyData = createLazyRoute(x, { defaultErrorComponent: appRoutes.error });
            return lazyData;
        }),
        ...(node.relativePath == "/" ? {
            index: true,
        } : {
            path: node.relativePath,
            children: node.children?.map(mapRoute) || undefined,
        })
    });

    return [
        {
            element: React.createElement(appRoutes.app || Outlet),
            children: [
                ...tree.map(mapRoute),
                {
                    path: '*',
                    element: React.createElement(appRoutes.notFound || Fragment),
                }
            ]
        }
    ]
} 