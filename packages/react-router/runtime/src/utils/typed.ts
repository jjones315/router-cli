import { Path, generatePath } from "react-router-dom";
import { AnyRouteData, TypedTo, TypedToOrPath } from "../types";
import searchParamUtilities from "./searchParams";

export const getBasicPath = <
    TRoutes extends Record<string, AnyRouteData>,
    TPath extends keyof TRoutes & string,
    TRoute extends TRoutes[TPath] = TRoutes[TPath]
>(toOrPath: TypedToOrPath<TPath, TRoute>): Partial<Path> => {
    if (typeof toOrPath === "object") {
        const { to } = toOrPath as TypedTo<TPath, TRoute>;
        const search = "search" in toOrPath && toOrPath.search ? "?" + searchParamUtilities.stringify(toOrPath.search) : undefined;
        const params = "params" in toOrPath && toOrPath.params ? toOrPath.params : undefined;
        const hash = toOrPath.hash ? `#${toOrPath.hash}` : undefined;

        return {
            pathname: params ? generateTypedPath(to, params) : to,
            hash,
            search
        };
    }
    return { pathname: toOrPath };
}

const generateTypedPath = (path: string, params: { [x: string]: any; }) => {
    for (const param in params) {
        params[param] = params[param].toString();
    }
    return generatePath(path.replaceAll("/$", "/:"), params)
}