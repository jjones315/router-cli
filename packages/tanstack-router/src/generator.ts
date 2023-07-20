import * as fs from 'fs'
import glob from "fast-glob";
import { template } from './template';
import { AppRoutes, RouteData, RouteItem, RouteItemMap, RouteMap, RouteSource } from './definitions/types';
import { getMapKeys, getRouteExports, getRouteNaming, trimCharEnd, trimExt, getIndent, getRouteCharacteristics, transformRoute, sortByDepth, getRouteImports, printRouteTree, verboseLog } from './utils';
import { RouterCliConfig } from './definitions/schema';
import { routeExportNames } from './definitions/constants';


const getRoutes = async (options: RouterCliConfig, verbose: boolean) => {
    options.source = options.source.replace(/^\/$/g, '');
    const routes = await glob([
        options.source + '/**/[\\w[-]*.page.tsx', // Pages
        options.source + '/**/[\\w[-]*.layout.tsx', //Layouts
        options.source + '/**/[\\w[-]*.layout.page.tsx', //Layouts
        options.source + '/_app.tsx', //root
        options.source + '/_not-found.tsx', //not found
    ], { onlyFiles: true });

    routes.sort();

    const configs = await glob([
        options.source + '/**/[\\w[-]*.page.config.tsx', // Page config
        options.source + '/**/[\\w[-]*.page.config.ts', // Page config
    ], { onlyFiles: true });

    if (verbose) {
        verboseLog(`scanned files`, () => {
            routes.forEach((layout) => {
                console.log(layout);
            })
        });
    }

    const getConfigSource = (pageSrc: string): RouteSource | undefined => {
        const config = configs.find(x => x.startsWith(pageSrc.replace(".page.tsx", ".page.config.ts")))
        if (config === undefined) {
            return undefined;
        }
        var relativeSrc = config.slice(options.source.length, config.length);
        var appSource = (options.sourceAlias || options.source) + relativeSrc;
        return {
            appSource,
            filePath: relativeSrc,
        };
    }

    const layouts: RouteMap = new Map();
    const pages: RouteMap = new Map();
    const appRoutes: AppRoutes = {};


    routes.forEach((src) => {
        var relativeSrc = src.slice(options.source.length, src.length);
        var appSource = (options.sourceAlias || options.source) + relativeSrc;

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

        const { isEndpoint, isLayout } = getRouteCharacteristics(relativeSrc);
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
                components: source,
            };

        if (exports.routeConfig) {
            page.config = source;
        }
        else {
            page.config = getConfigSource(src);
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
    const imports: string[] = [];

    const routeDefinitions: string[] = [];
    let routes: string[] = [];

    if (appRoutes.app) {
        imports.push(`import App from "${trimExt(appRoutes.app)}"`);
        routeDefinitions.push("export const rootRoute = new RootRoute({ component: App });");
    }
    else {
        imports.push(`import Outlet from ""@tanstack/router""`);
        routeDefinitions.push("export const rootRoute = new RootRoute({component: Outlet});");
    }


    let depth = 0;
    function navigateTree(items: RouteItem[], parent: RouteItem | undefined) {
        depth++;
        const indent = getIndent(depth);
        items.forEach(item => {
            imports.push(...getRouteImports(item));
            const { route } = generateRouteCode(item, parent);
            routeDefinitions.push(route);
            
            if (item.children.length > 0) {
                routes.push(indent + `${item.naming.route}.addChildren([`);
                navigateTree(item.children, item);
                routes.push(indent + `]),`);
            }
            else {
                routes.push(indent + `${item.naming.route},`);
            }
        });
        if (items.length > 0 && routes.length > 0) {
            routes[routes.length - 1] = trimCharEnd(routes[routes.length - 1]!, ",");
        }
        depth--;
    }
    navigateTree(routeTree, undefined);

    if (appRoutes.notFound) {
        imports.push(`import NotFound from "${trimExt(appRoutes.notFound)}"`);
        routeDefinitions.push(
            `export const notFoundRoute = new Route({ 
    getParentRoute: () => rootRoute, 
    path: "*", 
    component: NotFound 
});`);
        if (routes.length > 1) {
            routes[routes.length - 1] = routes[routes.length - 1] + ",";
        }
        routes.push(`    notFoundRoute`);
    }

    const output = `
${routeDefinitions.join("\n")}

export const routeTree = rootRoute.addChildren([
${routes.join("\n")}
]);
`;



    return template
        .replace("/* {{imports}} */", imports.join("\n"))
        .replace("/* {{outlet}} */", output);
}

export const generate = async (config: RouterCliConfig, verbose: boolean) => {
    let currentOutput = fs.existsSync(config.output) ? fs.readFileSync(config.output, 'utf-8') : "";

    const { pages, appRoutes, layouts } = await getRoutes(config, verbose);

    if (verbose) {
        verboseLog(`layouts`, () => {
            layouts.forEach((layout, route) => {
                console.log(`${route} - ${layout.components.appSource}.`);
            })
        });

        verboseLog(`pages`, () => {
            pages.forEach((page, route) => {
                console.log(`${route} - ${page.components.appSource}.`);
            })
        });

        verboseLog(`app files`, () => {
            console.log(`_app - ${appRoutes.app ? appRoutes.app : "none"}.`);
            console.log(`_not-found - ${appRoutes.notFound ? appRoutes.notFound : "none"}.`);
        });
    }


    const routeTree = createTree({ pages, layouts });
    if (verbose) {
        verboseLog(`created tree`, () => {
            for (let i = 0; i < routeTree.length; i++) {
                printRouteTree(routeTree[i], i === routeTree.length - 1);
            }
        });
    }

    const latestOutput = await generateCode({ appRoutes, routeTree })

    if (currentOutput !== latestOutput) {
        fs.writeFileSync(config.output, latestOutput)
        currentOutput = latestOutput;
    }
}

function generateRouteCode(item: RouteItem, parent: RouteItem | undefined) {
    const definition = generateRouteDefinition(item, parent);

    let route: string;

    if (item.data.config) {
        route = `export const ${item.naming.route} = new Route(createRouteOptions(${definition}, ${item.naming.routeConfig}));\n`;
    }
    else {
        route = `export const ${item.naming.route} = new Route(${definition});\n`;
    }

    return {
        route,
    }
}

function generateRouteDefinition(item: RouteItem, parent: RouteItem | undefined) {
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

    return `{
${getIndent(1) + options.join("\n" + getIndent(1))}
}`
}