import { Route } from "./public/routes";
import { ExtractSchema, ExtractRequiredSchema, ExtractRouteRequiredSchema, ExtractRouteSchema } from "./utils/types";

export type MergeTypeFromParent<TParent extends {}, TChild extends {}> = TParent & TChild;

type LoaderArgs<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
> = {
    pathname: string;
    hash: string;
    params: () => TParams;
    search: () => TSearchParams;
}

export type ContentProps<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TLoader extends unknown = never,
> = {
    useSearch: () => [
        TSearchParams,
        (setter: TSearchParams | ((current: TSearchParams) => TSearchParams)) => void
    ]
    useParams: () => TParams
    useLoader: () => TLoader
};

type LoaderFunction<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TResponse extends unknown = never,
> = (args: LoaderArgs<TParams, TSearchParams>) => Response | void | TResponse | Promise<Response | void | TResponse>;

export interface ChildRouteOptions<
    TParentRoute extends RouteOptions<TParentParams, TParentSearchParams, any>,
    TChildParams extends {} | never = never,
    TChildSearchParams extends {} | never = never,
    TLoader extends unknown = never,
    TParentParams extends {} | never = never,
    TParentSearchParams extends {} | never = never,
    TParams extends MergeTypeFromParent<
        TParentParams,
        TChildParams
    > = MergeTypeFromParent<TParentParams, TChildParams>,
    TSearchParams extends MergeTypeFromParent<
        TParentSearchParams,
        TChildSearchParams
    > = MergeTypeFromParent<TParentSearchParams, TChildSearchParams>,
> {
    Error?: React.FC;
    Pending?: React.FC;
    Content: React.FC<ContentProps<TParams, TSearchParams, TLoader>>;
    paramsSchema?: ParamSchema<TChildParams>;
    searchSchema?: ParamSchema<TChildSearchParams>;
    loader?: LoaderFunction<TParams, TSearchParams, TLoader>;
    guard?: () => {};
    parent: TParentRoute;
};

export interface RouteOptions<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TLoader extends unknown = never,
> {
    Error?: React.FC;
    Pending?: React.FC;
    Content: React.FC<ContentProps<TParams, TSearchParams, TLoader>>;
    paramsSchema?: ParamSchema<TParams>;
    searchSchema?: ParamSchema<TSearchParams>;
    loader?: LoaderFunction<TParams, TSearchParams, TLoader>;
    guard?: () => {};
};

export interface RouteData<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TLoader extends unknown = never,
> extends RouteOptions<TParams, TSearchParams, TLoader> {
    "__types": {
        params: TParams,
        search: TSearchParams;
        loader: TLoader
    }
};

export type AnyRouteData = RouteData<any, any, any>;
export type AnyRoute = Route<any, any, any>;

export type TypedPath<TPath extends string> = { to: TPath; hash?: string; };


export type TypedParamsSchema<T extends AnyRouteData, TSchema extends keyof T["__types"], TTypes extends RouteSchemaTypes<T, TSchema> = RouteSchemaTypes<T, TSchema>> =
    TTypes["hasRequiredFields"] extends true
    ? { [key in TSchema]: TTypes["source"]; }
    : TTypes["hasAnyFields"] extends true
    ? { [key in TSchema]?: TTypes["source"]; }
    : {}


export type TypedSearchParams<TRouteData extends AnyRouteData> = TRouteData extends RouteData<any, {}, any> ? { search: TRouteData["__types"]["search"]; } : { search?: TRouteData["__types"]["search"] };

export type TypedTo<
    TPath extends string,
    TRouteData extends AnyRouteData,
>
    = TypedPath<TPath>
    & TypedParamsSchema<TRouteData, "search">
    & TypedParamsSchema<TRouteData, "params">
//& TypedSearchParams<TRouteData, TSearchParams>

export type TypedToOrPath<
    TPath extends string,
    TRouteData extends AnyRouteData,
>
    = ExtractRouteRequiredSchema<TRouteData, "search"> extends false
    ? ExtractRouteRequiredSchema<TRouteData, "params"> extends false
    ? TPath | TypedTo<TPath, TRouteData>
    : TypedTo<TPath, TRouteData>
    : TypedTo<TPath, TRouteData>;



export type ParamSchema<TReturn> =
    | ParamSchemaObj<TReturn>
    | ParamSchemaFn<TReturn>

export type ParamSchemaObj<TReturn> = {
    parse?: ParamSchemaFn<TReturn>
}

export type ParamSchemaFn<TReturn> = (
    searchObj: Record<string, unknown>,
) => TReturn

export type RouteSchemaTypes<T extends AnyRouteData, TSchema extends keyof T["__types"]> = {
    hasAnyFields: ExtractRouteSchema<T, TSchema> extends never ? false : true;
    hasRequiredFields: ExtractRouteRequiredSchema<T, TSchema> extends never ? false : true;
    source: T["__types"][TSchema];
}

export type SchemaTypes<T extends {} | never> = {
    hasAnyFields: ExtractSchema<T> extends never ? false : true;
    hasRequiredFields: ExtractRequiredSchema<T> extends never ? false : true;
    source: T;
}