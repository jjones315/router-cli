import { routeExportNames } from "../definitions/constants";
import { RouteData, RouteNaming, RouteItem, ModuleImport } from "../definitions/types";

const toFriendlyName = (str: string) => {
    const joined = str
        .replace(/\/$\//g, "/$catchAll/")
        .replace(/[^\w|$]/g, " ")
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');
    return toCamelName(joined);
};

const toCamelName = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
const toPascalName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const toVariableName = (str: string) => toFriendlyName(str) || "index";

export const getRouteNaming = ({ route, data }: { route: string, data: RouteData }): RouteNaming => {
    const baseName = toVariableName(route);
    const routeName = baseName + (data.isLayout ? "Layout" : "") + "Route";
    const componentName = toPascalName(baseName) + (data.isLayout ? "Layout" : "");
    return {
        id: getRouteId({ route, data }),
        component: componentName,
        errorComponent: componentName + "ErrorComponent",
        pendingComponent: componentName + "PendingComponent",
        route: routeName,
        routeConfig: baseName + "Config",
        configureRouteFunc: "configure" + componentName + "Route",
        routeGenerated: baseName + "Generated",
    };
}

export const getRouteImports = (item: RouteItem) => {
    const { data } = item;
    const imports: ModuleImport[] = [];

    // if we have a config and its from another source than the components.
    if (data.config !== undefined && data.config?.appSource !== data.components.appSource) {
        imports.push({
            source: trimExt(data.config.appSource),
            named: [
                {
                    alias: item.naming.routeConfig,
                    source: routeExportNames.routeConfig
                }
            ]
        });
    }

    const mainImport: ModuleImport = {
        source: trimExt(data.components.appSource),
        named: []
    }

    if (data.config?.appSource === data.components.appSource) {
        mainImport.named?.push({
            alias: item.naming.routeConfig,
            source: routeExportNames.routeConfig
        });
    }

    if (!data.isLazy) {
        if (data.exports.routeComponent) {
            mainImport.default = item.naming.component;
        }

        if (data.exports.errorComponent) {
            mainImport.named?.push({
                alias: item.naming.errorComponent,
                source: routeExportNames.errorComponent
            });
        }

        if (data.exports.pendingComponent) {
            mainImport.named?.push({
                alias: item.naming.pendingComponent,
                source: routeExportNames.pendingComponent
            });
        }
    }


    if (mainImport.default || (mainImport.named && mainImport.named.length > 0)) {
        imports.push(mainImport);
    }
    return imports.map(createImportStatement);
}

export const getRouteId = ({ data, route }: { route: string, data: RouteData }) => {
    const name = route.split("/")
        .filter(Boolean)
        .join("-");

    return (name || "index") + (data.isLayout ? "-layout" : "");
}


export const createImportStatement = ({ source, default: defaultImport, named }: ModuleImport): string => {
    const parts: string[] = [];
    if (defaultImport) {
        parts.push(defaultImport);
    }

    if (named && named.length > 0) {
        parts.push(`{ ${named.map(name => typeof name === "string" ? name : `${name.source} as ${name.alias}`).join(", ")} }`);
    }
    return `import ${parts.join(", ")} from "${source}"`;
}

export const trimExt = (src: string) => {
    return src.split('.').slice(0, -1).join('.');
}

export const getIndent = (depth: number, spacesInTab: number = 4) => {
    return " ".repeat(depth * spacesInTab);
}