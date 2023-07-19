import { RouteExports } from "../definitions/types";

export const getRouteExports = (content: string): RouteExports => ({
    routeComponent: /^export\s+default\s/gm.test(content),
    pendingComponent: /^export\s+(const|function|async function|let)\s+PendingComponent\W/gm.test(content),
    errorComponent: /^export\s+(const|function|async function|let)\s+ErrorComponent\W/gm.test(content),
    routeConfig: /^export\s+(const|let|var)\s+routeConfig\W/gm.test(content),
});

export const getRouteCharacteristics = (src: string) => ({
    isEndpoint: /(\.page|\.layout\.page)\.tsx$/g.test(src),
    isLayout: /(\.layout|\.layout\.page)\.tsx$/g.test(src),
    isConfig: /\.page\.config\.tsx?$/g.test(src),
});

export const transformRoute = (src: string) => src
    .replace(/(\.page\.tsx|\.layout\.tsx|\.layout\.page\.tsx|\.page\.config\.tsx?)$/g, '')
    .replace(/\/pages\//g, '/')
    .replace(/\/$catchAll\//g, '/*/')
    .replace(/\/?index|\./g, '/')
    .replace(/(\w)\/$/g, '$1');
