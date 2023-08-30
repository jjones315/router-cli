export type ModuleImport = {
    default?: string;
    named?: Array<string | { source: string, alias: string }>;
    source: string;
}

export type AppRoutes = { 
    app?: string, 
    notFound?: string,
    error?: string,
    pending?: string,
 };

export type RouteItem = {
    fullRoute: string; // full Route.
    typedRoute: string; // typed Route.
    importSource: string;
};

export type RouteExports = {
    default: boolean;
}

export type RouteType = "page" | "layout";
export type RouteMap = Map<string, RouteItem>;

export type RouterType = "createBrowserRouter" | "createMemoryRouter" | "createHashRouter";

export type AppRouteComponents = {
    app: boolean;
    notFound: boolean;
    error: boolean;
    pending: boolean;
};