import { SetAction } from "./public/hooks";
import { ExtractSchema, ExtractRequiredSchema, ExtractRouteRequiredSchema, ExtractRouteSchema } from "./utils/types";

export type MergeTypeFromParent<TParent extends {}, TChild extends {}> = TParent & TChild;


export type RouteComponent<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown,
    TParentRoute extends AnyRouteComponent = AnyRouteComponent,
>
    = React.FC & {
        routeData: RouteOptions<TParams, TSearchParams, TLoader, TParentRoute>
    } & {
        useParams(): keyof TParams extends never ? never : TParams;
        useSearch(): keyof TSearchParams extends never ? never : [TSearchParams, (action: SetAction<TSearchParams>) => void];
        useLoader(): TLoader;
        childRoute<
            TChildParams extends {} = {},
            TChildSearchParams extends {} = {},
            TChildLoader = unknown
        >(content: React.FC, options?: Omit<RouteOptions<TChildParams, TChildSearchParams, TChildLoader, RouteComponent<TParams, TSearchParams, TLoader, TParentRoute>>, "__types" | "parent">): RouteComponent<MergeTypeFromParent<TChildParams, TParams>, MergeTypeFromParent<TChildSearchParams, TSearchParams>, TChildLoader>;
    }

type LoaderArgs<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
> = {
    pathname: string;
    hash: string;
    params: () => TParams;
    search: () => TSearchParams;
}

type LoaderFunction<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TResponse extends unknown = never,
> = (args: LoaderArgs<TParams, TSearchParams>) => Response | void | TResponse | Promise<Response | void | TResponse>;

export interface RouteOptions<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TLoader extends unknown = never,
    TParentRoute extends AnyRouteComponent = AnyRouteComponent,
> {
    Error?: React.FC;
    Pending?: React.FC;
    paramsSchema?: ParamSchema<TParams>;
    searchSchema?: ParamSchema<TSearchParams>;
    loader?: LoaderFunction<TParams, TSearchParams, TLoader>;
    parentRoute?: TParentRoute,
    disableDefaultPendingComponent?: boolean,
    disableDefaultErrorComponent?: boolean,
    //guard?: () => {};
    "__types": {
        params: TParams,
        search: TSearchParams;
        loader: TLoader;
        parent: TParentRoute;
    }
};

export type AnyRouteComponent = RouteComponent<any, any, any, any>;
export type AnyRouteOptions = RouteOptions<any, any, any, any>;
export type TypedPath<TPath extends string> = { to: TPath; hash?: string; };
export type TypedParamsSchema<T extends AnyRouteOptions, TSchema extends keyof T["__types"], TTypes extends RouteSchemaTypes<T, TSchema> = RouteSchemaTypes<T, TSchema>> =
    TTypes["hasRequiredFields"] extends true
    ? { [key in TSchema]: TTypes["source"]; }
    : TTypes["hasAnyFields"] extends true
    ? { [key in TSchema]?: TTypes["source"]; }
    : {}


export type TypedSearchParams<TRoute extends AnyRouteOptions> = TRoute extends RouteOptions<any, {}, any> ? { search: TRoute["__types"]["search"]; } : { search?: TRoute["__types"]["search"] };
export type TypedTo<
    TPath extends string,
    TRoute extends AnyRouteComponent,
>
    = TypedPath<TPath>
    & TypedParamsSchema<TRoute["routeData"], "search">
    & TypedParamsSchema<TRoute["routeData"], "params">

export type TypedToOrPath<
    TPath extends string,
    TRoute extends AnyRouteComponent,
>
    = ExtractRouteRequiredSchema<TRoute["routeData"], "search"> extends false
    ? ExtractRouteRequiredSchema<TRoute["routeData"], "params"> extends false
    ? TPath | TypedTo<TPath, TRoute>
    : TypedTo<TPath, TRoute>
    : TypedTo<TPath, TRoute>;



export type ParamSchema<TReturn> =
    | ParamSchemaObj<TReturn>
    | ParamSchemaFn<TReturn>

export type ParamSchemaObj<TReturn> = {
    parse?: ParamSchemaFn<TReturn>
}

export type ParamSchemaFn<TReturn> = (
    obj: Record<string, unknown>,
) => TReturn

export type RouteSchemaTypes<T extends AnyRouteOptions, TSchema extends keyof T["__types"]> = {
    hasAnyFields: ExtractRouteSchema<T, TSchema> extends never ? false : true;
    hasRequiredFields: ExtractRouteRequiredSchema<T, TSchema> extends never ? false : true;
    source: T["__types"][TSchema];
}

export type SchemaTypes<T extends {} | never> = {
    hasAnyFields: ExtractSchema<T> extends never ? false : true;
    hasRequiredFields: ExtractRequiredSchema<T> extends never ? false : true;
    source: T;
}