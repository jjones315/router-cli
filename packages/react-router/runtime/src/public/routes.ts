import { useLoaderData } from "react-router-dom";
import { RouteOptions, MergeTypeFromParent, RouteComponent, AnyRouteComponent } from "../types";
import { parseSchema } from "../utils/schemaParser";
import { useTypedParams, useTypedSearch } from "./hooks";

export function createRoute<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown,
    TParentRoute extends AnyRouteComponent = AnyRouteComponent
>(content: React.FC, options?: Omit<RouteOptions<TParams, TSearchParams, TLoader, TParentRoute>, "__types">): RouteComponent<TParams, TSearchParams, TLoader, TParentRoute> {
    //@ts-expect-error
    content.routeData = {
        Error: options?.Error,
        Pending: options?.Pending,
        paramsSchema: options?.paramsSchema,
        searchSchema: options?.searchSchema,
        disableDefaultErrorComponent: options?.disableDefaultErrorComponent,
        disableDefaultPendingComponent: options?.disableDefaultPendingComponent,
        loader: options?.loader,
        useGuards: options?.useGuards,
    };

    //@ts-expect-error
    content.useParams = () => useTypedParams(options?.paramsSchema!);

    //@ts-expect-error
    content.useSearch = () => useTypedSearch<TSearchParams>(options?.searchSchema!);
    
    //@ts-expect-error
    content.childRoute = <
        TChildParams extends {} = {},
        TChildSearchParams extends {} = {},
        TChildLoader = unknown
    >(
        content: React.FC,
        childOptions?: Omit<RouteOptions<TChildParams, TChildSearchParams, TChildLoader, RouteComponent<TParams, TSearchParams, TLoader, TParentRoute>>, "__types">
    ): RouteComponent<MergeTypeFromParent<TChildParams, TParams>, MergeTypeFromParent<TChildSearchParams, TSearchParams>, TChildLoader> => {
        return createRoute(content, {
            parentRoute: content as any,
            loader: childOptions?.loader as any,
            Error: childOptions?.Error,
            Pending: childOptions?.Pending,
            disableDefaultErrorComponent: options?.disableDefaultErrorComponent,
            disableDefaultPendingComponent: options?.disableDefaultPendingComponent,
            useGuards: childOptions?.useGuards,
            paramsSchema(src) {
                return {
                    ...(options?.paramsSchema ? parseSchema(src, options?.paramsSchema) : {}),
                    ...(childOptions?.paramsSchema ? parseSchema(src, childOptions?.paramsSchema) : {}),
                } as any;
            },
            searchSchema(src) {
                return {
                    ...(options?.searchSchema ? parseSchema(src, options?.searchSchema) : {}),
                    ...(childOptions?.searchSchema ? parseSchema(src, childOptions?.searchSchema) : {}),
                } as any;
            },
        }) as any;
    }

    //@ts-expect-error
    return content;
}