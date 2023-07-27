import React from "react";
import { LoaderFunction, useLoaderData, useLocation, useSearchParams, useParams, LazyRouteFunction, RouteObject } from "react-router-dom";
import { guardLoader, useGuards } from "../public/guards";
import { useTypedParams, useTypedSearch } from "../public/hooks";
import { ContentProps } from "../types";
import { parseQuery, parseParams } from "./requestParser";
import { Route } from "../public/routes";

export type LazyRouteData = Awaited<ReturnType<LazyRouteFunction<RouteObject>>>;



export function createLazyRoute<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown
>(route: Route<TParams, TSearchParams, TLoader>, options?: { defaultErrorComponent: React.ComponentType<any> }): LazyRouteData {
    const { paramsSchema, searchSchema } = route.data;

    let loader: undefined | LoaderFunction = undefined;

    if (typeof route.data.loader === "function") {
        loader = ({ params, request }) => {
            var guard = route.data.guard ? guardLoader(route.data.guard) : null;
            if (guard !== null) {
                return guard;
            }

            const url = new URL(request.url);
            return route.data.loader?.({
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

    const { Error, Content, Pending } = route.data;

    const ErrorComponent = Error ?? options?.defaultErrorComponent ?? undefined;

    const ContentComponent = React.memo((props: ContentProps<TParams, TSearchParams, TLoader>) => {
        if (Pending) {
            return (
                <React.Suspense fallback={<Pending />}>
                    <Content {...props as any} />
                </React.Suspense>
            );
        }

        return <Content {...props as any} />;
    })

    return {
        loader: loader,
        errorElement: ErrorComponent ? <ErrorComponent /> : undefined,
        Component: React.memo(() => {
            useGuards(route.data.guard);
            return <ContentComponent 
                useLoader={useLoaderData as () => TLoader} 
                useParams={route.useParams} 
                useSearch={route.useSearch as any} 
            />
        })
    };
}