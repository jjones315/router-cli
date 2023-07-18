export type ModuleImport = {
    default?: string;
    named?: Array<string | { source: string, alias: string }>;
    source: string;
}

export type RouteSource = {
    filePath: string;
    appSource: string;
};

export type RouteData = {
    components: RouteSource;
    config?: RouteSource;
    exports: RouteExports;
    isLazy: boolean;
    isEndpoint: boolean;
    isLayout: boolean;
};

export type RouteNaming = {
    route: string;
    id: string;
    component: string;
    errorComponent: string;
    pendingComponent: string;
    routeConfig: string;
};

export type RouteMap = Map<string, RouteData>;
export type AppRoutes = { app?: string, notFound?: string };

export type RouteItem = {
    fullRoute: string; // full Route.
    relativeRoute: string; // Route relative to parent.
    data: RouteData;
    naming: RouteNaming;
    children: RouteItem[]
};

export type RouteExports = {
    routeComponent: boolean;
    pendingComponent: boolean;
    errorComponent: boolean;
    routeConfig: boolean;
}

export type RouteItemMap = Map<string, RouteItem>;
