import { SetAction } from "./public/hooks";
import { ExtractSchema, ExtractRequiredSchema, ExtractRouteRequiredSchema, ExtractRouteSchema } from "./utils/types";

export type MergeTypeFromParent<TParent extends {}, TChild extends {}> = TParent extends never ? {poop: string} : {pee: string}


type X = keyof never;
type Test = MergeTypeFromParent<never, {child:string}>;

export type RouteComponent<
    TParams extends {} = {},
    TSearchParams extends {} = {},
    TLoader = unknown
> 
= Omit<RouteOptions<TParams, TSearchParams, TLoader>, "Content">
& RouteOptions<TParams, TSearchParams, TLoader>["Content"]
& {
    useParams(): keyof TParams extends never ? never : TParams;
    useSearch(): keyof TSearchParams extends never ? never : [TSearchParams, (action: SetAction<TSearchParams>) => void];
    childRoute<
        TChildParams extends {} = {},
        TChildSearchParams extends {} = {},
        TChildLoader = unknown
    >(options: Omit<RouteOptions<TChildParams, TChildSearchParams, TChildLoader, TParams, TSearchParams>, "__types" | "parent">): RouteComponent<MergeTypeFromParent<TChildParams, TParams>, MergeTypeFromParent<TChildSearchParams, TSearchParams>, TChildLoader>;
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

export interface RouteOptions<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TLoader extends unknown = never,
    TParentParams extends {} | never = never,
    TParentSearchParams extends {} | never = never,
> {
    Error?: React.FC;
    Pending?: React.FC;
    Content: React.FC<ContentProps<MergeTypeFromParent<TParentParams, TParams>, MergeTypeFromParent<TParentSearchParams, TSearchParams>, TLoader>>;
    paramsSchema?: ParamSchema<TParams>;
    searchSchema?: ParamSchema<TSearchParams>;
    loader?: LoaderFunction<TParams, TSearchParams, TLoader>;
    guard?: () => {};
    "__types": {
        params: TParams,
        search: TSearchParams;
        loader: TLoader
        parentParams: TParentParams
        parentSearchParams: TParentSearchParams,
        mergedParams: MergeTypeFromParent<TParentParams, TParams>,
        mergedSearchParams: MergeTypeFromParent<TParentSearchParams, TSearchParams>,
    }
};

export type AnyRouteComponent = RouteComponent<any, any, any>;
export type TypedPath<TPath extends string> = { to: TPath; hash?: string; };
export type TypedParamsSchema<T extends AnyRouteComponent, TSchema extends keyof T["__types"], TTypes extends RouteSchemaTypes<T, TSchema> = RouteSchemaTypes<T, TSchema>> =
    TTypes["hasRequiredFields"] extends true
    ? { [key in TSchema]: TTypes["source"]; }
    : TTypes["hasAnyFields"] extends true
    ? { [key in TSchema]?: TTypes["source"]; }
    : {}


export type TypedSearchParams<TRouteData extends AnyRouteComponent> = TRouteData extends RouteOptions<any, {}, any> ? { search: TRouteData["__types"]["search"]; } : { search?: TRouteData["__types"]["search"] };
export type TypedTo<
    TPath extends string,
    TRouteData extends AnyRouteComponent,
>
    = TypedPath<TPath>
    & TypedParamsSchema<TRouteData, "search">
    & TypedParamsSchema<TRouteData, "params">
//& TypedSearchParams<TRouteData, TSearchParams>

export type TypedToOrPath<
    TPath extends string,
    TRoute extends AnyRouteComponent,
>
    = ExtractRouteRequiredSchema<TRoute, "search"> extends false
    ? ExtractRouteRequiredSchema<TRoute, "params"> extends false
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

export type RouteSchemaTypes<T extends AnyRouteComponent, TSchema extends keyof T["__types"]> = {
    hasAnyFields: ExtractRouteSchema<T, TSchema> extends never ? false : true;
    hasRequiredFields: ExtractRouteRequiredSchema<T, TSchema> extends never ? false : true;
    source: T["__types"][TSchema];
}

export type SchemaTypes<T extends {} | never> = {
    hasAnyFields: ExtractSchema<T> extends never ? false : true;
    hasRequiredFields: ExtractRequiredSchema<T> extends never ? false : true;
    source: T;
}