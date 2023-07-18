import * as fs from 'fs'
import glob from "fast-glob";
import { template } from './template';
import { AppRoutes, RouteData, RouteItem, RouteItemMap, RouteMap, RouterCliOptions } from './types';
import { getRouteExports, getRouteNaming, trimCharEnd, trimExt, getIndent, getRouteCharacteristics, transformRoute, sortByDepth, getRouteImports, routeExportNames } from './utils';

const getMapKeys = <T>(src: Map<T, any>): T[] => {
    const keys: T[] = [];
    for (const key of src.keys()) {
        keys.push(key);
    }
    return keys;
}

const getRoutes = async (options: RouterCliOptions) => {
    options.source = options.source.replace(/^\/$/g, '');
    const routes = await glob([
        options.source + '/**/[\\w[-]*.page.tsx', // Pages
        options.source + '/**/[\\w[-]*.page.config.tsx', // Page config
        options.source + '/**/[\\w[-]*.page.config.ts', // Page config
        options.source + '/**/[\\w[-]*.layout.tsx', //Layouts
        options.source + '/**/[\\w[-]*.layout.page.tsx', //Layouts
        options.source + '/_app.tsx', //root
        options.source + '/_not-found.tsx', //not found
    ], { onlyFiles: true });

    const layouts: RouteMap = new Map();
    const pages: RouteMap = new Map();
    const appRoutes: AppRoutes = {};

    routes.forEach((src) => {
        var relativeSrc = src.slice(options.source.length, src.length);
        var appSource = options.sourceAlias + relativeSrc;

        // is this the app root.
        if (relativeSrc === "/_app.tsx") {
            appRoutes.app = appSource;
            return;
        }

        // is this the 404 route.
        if (relativeSrc === "/_not-found.tsx") {
            appRoutes.notFound = appSource;
            return;
        }

        const { isConfig, isEndpoint, isLayout } = getRouteCharacteristics(relativeSrc);
        const route = transformRoute(relativeSrc);
        const content = fs.readFileSync(src, 'utf-8');
        const exports = getRouteExports(content);

        const source = {
            appSource,
            filePath: relativeSrc,
        };


        if (isLayout) {
            const layout: RouteData = {
                isEndpoint,
                isLayout,
                exports,
                isLazy: false,
                components: source
            };

            if (exports.routeConfig) {
                layout.config = source;
            }

            layouts.set(route, layout);
            return;
        }

        const page: RouteData | undefined =
            pages.get(route)
            ?? {
                isEndpoint,
                isLayout,
                exports,
                isLazy: true,
                components: undefined as any,
            };

        if (isConfig || exports.routeConfig) {
            page.config = source;
        }

        if (isEndpoint && exports.routeComponent) {
            page.components = source;
        }

        pages.set(route, page);
    })

    return { pages, appRoutes, layouts };
}

const createTree = ({ layouts, pages }: { layouts: RouteMap, pages: RouteMap }) => {
    const sortedLayouts = getMapKeys(layouts);
    sortByDepth(sortedLayouts);

    // Build map of all page routes.
    const routeMap: RouteItemMap = new Map();
    for (const [route, data] of pages.entries()) {
        routeMap.set(route, {
            fullRoute: route,
            relativeRoute: route,
            data,
            naming: getRouteNaming({ route, data }),
            children: []
        });
    }
    for (const layout of sortedLayouts) {
        const data = layouts.get(layout);
        if (!data) continue;

        const layoutRoute: RouteItem = {
            fullRoute: layout,
            relativeRoute: layout,
            data,
            naming: getRouteNaming({ route: layout, data }),
            children: []
        };
        for (const [routeKey, routeItem] of routeMap.entries()) {
            const layoutRoutePrefix = layout + "/";

            const isChild = routeKey.startsWith(layoutRoutePrefix);
            const isIndex = routeKey === layout

            if (isChild || isIndex) {
                // Remove route from map, we are going to move it to a child of this layout.
                routeMap.delete(routeKey);

                // alter the path to be relative to the layout and remove any empty segments if the layout is also a endpoint.
                routeItem.relativeRoute = (
                    layoutRoute.data.isEndpoint
                        ? routeItem.relativeRoute
                            .substring(layoutRoutePrefix.length, routeItem.relativeRoute.length)
                            .split("/")
                            .filter(Boolean)
                            .join("/")
                        : routeItem.relativeRoute
                ) || "/";

                layoutRoute.children.push(routeItem);
            }
        }
        routeMap.set(layout, layoutRoute);
    }
    const values: RouteItem[] = [];
    for (const value of routeMap.values()) {
        values.push(value);
    }
    return values;
}

const generateCode = async ({ appRoutes, routeTree }: { appRoutes: AppRoutes, routeTree: RouteItem[] }) => {

    function createRouteDefinition(item: RouteItem, parent: RouteItem | undefined) {
        const options: string[] = [];
        options.push(`getParentRoute: () => ${parent?.naming?.route ?? "rootRoute"},`);

        if (item.data.isEndpoint) {
            options.push(`path: "${item.relativeRoute}",`);
        }
        else {
            options.push(`id: "${item.naming.id}",`);
        }

        if (item.data.exports.errorComponent) {
            options.push(`errorComponent: ${item.data.isLazy ? `lazy(() => import("${trimExt(item.data.components.appSource)}").then(mod => ({ "default": mod.${routeExportNames.errorComponent} })))` : item.naming.errorComponent},`);
        }

        if (item.data.exports.pendingComponent) {
            options.push(`pendingComponent: ${item.data.isLazy ? `lazy(() => import("${trimExt(item.data.components.appSource)}").then(mod => ({ "default": mod.${routeExportNames.pendingComponent} })))` : item.naming.pendingComponent},`);
        }

        if (item.data.exports.routeComponent) {
            options.push(`component: ${item.data.isLazy ? `lazy(() => import("${trimExt(item.data.components.appSource)}").then(mod => ({ "default": mod.${routeExportNames.routeComponent} })))` : item.naming.component},`);
        }

        return `export const ${item.naming.route}ConfigBuilder = createRouteConfig({
${getIndent(1) + options.join("\n" + getIndent(1))}   
});

export const ${item.naming.route} = new Route(${item.data.config ? item.naming.routeConfig : `${item.naming.route}ConfigBuilder.generated`});
`;
    }

    const imports: string[] = [];
    const variables: string[] = [];

    if (appRoutes.app) {
        imports.push(`import App from "${trimExt(appRoutes.app)}"`);
        variables.push("export const rootRoute = new RootRoute({ component: App });");
    }
    else {
        imports.push(`import Outlet from ""@tanstack/router""`);
        variables.push("export const rootRoute = new RootRoute({component: Outlet});");
    }

    let result: string[] = ["export const routeTree = rootRoute.addChildren(["];

    let depth = 0;
    function navigateTree(items: RouteItem[], parent: RouteItem | undefined) {
        depth++;
        const indent = getIndent(depth);
        items.forEach(item => {
            imports.push(...getRouteImports(item));
            variables.push(createRouteDefinition(item, parent));

            if (item.children.length > 0) {
                result.push(indent + `${item.naming.route}.addChildren([`);
                navigateTree(item.children, item);
                result.push(indent + `]),`);
            }
            else {
                result.push(indent + `${item.naming.route},`);
            }
        });
        if (items.length > 0 && result.length > 0) {
            result[result.length - 1] = trimCharEnd(result[result.length - 1]!, ",");
        }
        depth--;
    }
    navigateTree(routeTree, undefined);

    if (appRoutes.notFound) {
        imports.push(`import NotFound from "${trimExt(appRoutes.notFound)}"`);
        variables.push(
            `export const notFoundRoute = new Route({ 
    getParentRoute: () => rootRoute, 
    path: "*", 
    component: NotFound 
});`);
        if (result.length > 1) {
            result[result.length - 1] = result[result.length - 1] + ",";
        }
        result.push(`    notFoundRoute`);
    }

    result.push("]);")

    return template
        .replace("/* {{imports}} */", imports.join("\n"))
        .replace("/* {{routes}} */", variables.join("\n\n"))
        .replace("/* {{tree}} */", result.join("\n"));
}

export const generate = async (config: RouterCliOptions) => {
    let currentOutput = fs.existsSync(config.output) ? fs.readFileSync(config.output, 'utf-8') : "";

    const { pages, appRoutes, layouts } = await getRoutes(config);
    const routeTree = createTree({ pages, layouts });
    const latestOutput = await generateCode({ appRoutes, routeTree })

    if (currentOutput !== latestOutput) {
        fs.writeFileSync(config.output, latestOutput)
        currentOutput = latestOutput;
    }
}