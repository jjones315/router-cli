import { LazyRouteFunction, LoaderFunction, RouteObject, useLoaderData, useLocation, useParams, useSearchParams } from "react-router-dom";
import { ChildRouteOptions, ContentProps, MergeTypeFromParent, RouteData, RouteOptions } from "../types";
import { guardLoader, useGuards } from "./guards";
import { parseParams, parseQuery } from "../utils/requestParser";
import { Suspense, memo, useCallback } from "react";
import { parseSchema } from "../utils/schemaParser";
import { ParamSchema } from "../types";
import { getTypedSearchParamsResult } from "./hooks";

export type LazyRouteData = Awaited<ReturnType<LazyRouteFunction<RouteObject>>>;

export class Route<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown
> {
    data: RouteData<TParams, TSearchParams, TLoader>;

    constructor(options: RouteOptions<TParams, TSearchParams, TLoader>) {
        this.data = options as RouteData<TParams, TSearchParams, TLoader>;
    }

    lazy(options?: { defaultErrorComponent: React.ComponentType<any> }): LazyRouteData {
        const { paramsSchema, searchSchema } = this.data;

        let loader: undefined | LoaderFunction = undefined;

        if (typeof this.data.loader === "function") {
            loader = ({ params, request }) => {
                var guard = this.data.guard ? guardLoader(this.data.guard) : null;
                if (guard !== null) {
                    return guard;
                }
                const url = new URL(request.url);
                return this.data.loader?.({
                    hash: url.hash,
                    path: url.pathname,
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

        const { Error, Content, Pending } = this.data;

        const ErrorComponent = Error ?? options?.defaultErrorComponent ?? undefined;

        const ContentComponent = memo((props: ContentProps) => {
            if (Pending) {
                return (
                    <Suspense fallback={<Pending />}>
                        <Content {...props as any} />
                    </Suspense>
                );
            }

            return <Content {...props as any} />;
        })

        return {
            loader: loader,
            errorElement: ErrorComponent ? <ErrorComponent /> : undefined,
            Component: memo(() => {
                useGuards(this.data.guard);
                const useParams = useTypedParams(paramsSchema);
                const useSearch = useTypedSearch(searchSchema);
                return <ContentComponent useLoader={useLoaderData} useLocation={useTypedLocation} useParams={useParams as any} useSearch={useSearch as any} />
            })
        };
    }

    route<
        TChildParams extends {} = {},
        TChildSearchParams extends {} = {},
        TChildLoader = unknown
    >(options: Omit<ChildRouteOptions<
        this["data"],
        TChildParams,
        TChildSearchParams,
        TChildLoader,
        TParams,
        TSearchParams,
        MergeTypeFromParent<TParams, TChildParams>,
        MergeTypeFromParent<TSearchParams, TChildSearchParams>
    >,
        "__types" | "parent"
    >) {

        const parent = this.data;
        return new ChildRoute<
            this["data"],
            TChildParams,
            TChildSearchParams,
            TChildLoader,
            TParams,
            TSearchParams,
            MergeTypeFromParent<TParams, TChildParams>,
            MergeTypeFromParent<TSearchParams, TChildSearchParams>
        >({
            Content: options.Content as any,
            loader: options.loader as any,
            Error: options.Error,
            Pending: options.Pending,
            guard: options.guard,
            paramsSchema(src) {
                return {
                    ...(parent.paramsSchema ? parseSchema(src, parent.paramsSchema) : {}),
                    ...(options.paramsSchema ? parseSchema(src, options.paramsSchema) : {}),
                } as any;
            },
            searchSchema(src) {
                return {
                    ...(parent.searchSchema ? parseSchema(src, parent.searchSchema) : {}),
                    ...(options.searchSchema ? parseSchema(src, options.searchSchema) : {}),
                } as any;
            },
            parent: this.data
        });
    }
}

export class ChildRoute<
    TParentRoute extends RouteOptions<TParentParams, TParentSearchParams, any>,
    TChildParams extends {} = {},
    TChildSearchParams extends {} = {},
    TLoader = unknown,
    TParentParams extends {} = {},
    TParentSearchParams extends {} = {},
    TParams extends MergeTypeFromParent<
        TParentParams,
        TChildParams
    > = MergeTypeFromParent<TParentParams, TChildParams>,
    TSearchParams extends MergeTypeFromParent<
        TParentSearchParams,
        TChildSearchParams
    > = MergeTypeFromParent<TParentSearchParams, TChildSearchParams>,
> extends Route<
    TParams,
    TSearchParams,
    TLoader
> {
    public parent: TParentRoute;

    constructor(options: Omit<ChildRouteOptions<TParentRoute, TChildParams, TChildSearchParams, TLoader, TParentParams, TParentSearchParams, TParams, TSearchParams>, "__types">) {
        super(options as any);
        this.parent = options.parent;
    }
}



export function useTypedSearch<TData extends Record<string, unknown>>(schema: ParamSchema<TData> | undefined) {
    return useCallback(() => {
        const [search, setSearch] = useSearchParams();
        if (schema) {
            return getTypedSearchParamsResult(search, setSearch, schema);
        }
        return [search, setSearch] as [
            any,
            (setter: any | ((current: any) => any)) => void
        ];
    }, [schema]);
}

export function useTypedParams<TData extends Record<string, unknown>>(schema: ParamSchema<TData> | undefined) {
    return useCallback(() => {
        const params = useParams();
        if (schema) {
            return parseParams(params, schema);
        }
        return params;
    }, [schema]);
}

export const useTypedLocation = () => {
    const location = useLocation();
    return {
        hash: location.hash,
        path: location.pathname
    }
}