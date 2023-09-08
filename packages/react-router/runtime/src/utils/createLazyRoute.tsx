import React from "react";
import { LoaderFunction, useLoaderData, useLocation, useSearchParams, useParams, LazyRouteFunction, RouteObject } from "react-router-dom";
import { guardLoader, useGuards } from "../public/guards";
import { useTypedParams, useTypedSearch } from "../public/hooks";
import { ContentProps, RouteComponent } from "../types";
import { parseQuery, parseParams } from "./requestParser";

export type LazyRouteData = Awaited<ReturnType<LazyRouteFunction<RouteObject>>>;



export function createLazyRoute<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown
>(route: RouteComponent<TParams, TSearchParams, TLoader>, options?: { defaultErrorComponent?: React.ComponentType<any> }): LazyRouteData {
    const { paramsSchema, searchSchema } = route;

    let loader: undefined | LoaderFunction = undefined;

    if (typeof route.loader === "function") {
        loader = ({ params, request }) => {
            var guard = route.guard ? guardLoader(route.guard) : null;
            if (guard !== null) {
                return guard;
            }

            const url = new URL(request.url);
            return route.loader?.({
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

    const { Error, Pending } = route;
    const Content = route;

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
            useGuards(route.guard);
            const useParams = () => useTypedParams<TParams>(paramsSchema!);
            const useSearch = () => useTypedSearch(searchSchema!);
            return <ContentComponent 
                useLoader={useLoaderData as () => TLoader} 
                useParams={useParams} 
                useSearch={useSearch as any} 
            />
        })
    };
}