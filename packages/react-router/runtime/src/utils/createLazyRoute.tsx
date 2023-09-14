import React from "react";
import { LoaderFunction, LazyRouteFunction, RouteObject } from "react-router-dom";
import { RouteComponent } from "../types";
import { parseQuery, parseParams } from "./requestParser";

export type LazyRouteData = Awaited<ReturnType<LazyRouteFunction<RouteObject>>>;

export function createLazyRoute<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown
>(route: RouteComponent<TParams, TSearchParams, TLoader>, options?: { defaultErrorComponent?: React.ComponentType<any>, defaultPendingComponent?: React.ComponentType<any> }): LazyRouteData {
    const { paramsSchema, searchSchema } = route.routeData;

    let loader: undefined | LoaderFunction = undefined;

    if (typeof route.routeData.loader === "function") {
        loader = ({ params, request }) => {
            // var guard = route.routeData.guard ? guardLoader(route.routeData.guard) : null;
            // if (guard !== null) {
            //     return guard;
            // }

            const url = new URL(request.url);
            return route.routeData.loader?.({
                hash: url.hash,
                pathname: url.pathname,
                search() {
                    if (searchSchema) {
                        return parseQuery(url.searchParams, searchSchema);
                    }
                    return url.searchParams as any;
                },
                params() {
                    if (paramsSchema) {
                        return parseParams(params, paramsSchema);
                    }
                    return params as any;
                },
            }) || null;
        };
    }

    const { Error, Pending, disableDefaultErrorComponent, disableDefaultPendingComponent } = route.routeData;
    const Content = route;

    const ErrorComponent = Error ?? (disableDefaultErrorComponent ? undefined : options?.defaultErrorComponent) ?? undefined;
    const PendingComponent = Pending ?? (disableDefaultPendingComponent ? undefined : options?.defaultPendingComponent) ?? undefined;

    const ContentComponent = React.memo(() => {
        if (PendingComponent) {
            return (
                <React.Suspense fallback={<PendingComponent />}>
                    <Content />
                </React.Suspense>
            );
        }

        return <Content  />;
    })

    return {
        loader: loader,
        errorElement: ErrorComponent ? <ErrorComponent /> : undefined,
        Component: React.memo(() => {
            return <ContentComponent />
        })
    };
}