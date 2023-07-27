import { ChildRouteOptions, MergeTypeFromParent, RouteData, RouteOptions } from "../types";
import { parseSchema } from "../utils/schemaParser";
import { SetAction, useTypedParams, useTypedSearch } from "./hooks";

export class Route<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown
> {
    data: RouteData<TParams, TSearchParams, TLoader>;

    constructor(options: RouteOptions<TParams, TSearchParams, TLoader>) {
        this.data = options as RouteData<TParams, TSearchParams, TLoader>;
    }

    childRoute<
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

    useParams(): keyof TParams extends never ? never : TParams {
        return useTypedParams(this.data.paramsSchema!) as any;
    }

    useSearch(): keyof TSearchParams extends never ? never : [TSearchParams, (action: SetAction<TSearchParams>) => void] {
        return useTypedSearch<TSearchParams>(this.data.searchSchema!) as any;
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