import { Route } from "./public/routes";
import { ExtractSchema, ExtractRequiredSchema, ExtractLoader } from "./utils/types";

export type MergeTypeFromParent<TParent extends {}, TChild extends {}> = TParent & TChild;

type LoaderArgs<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
> = {
    path: string;
    hash: string;
    params: () => TParams;
    search: () => TSearchParams;
}

export type ContentProps<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TLoader = unknown
> = {
    useLocation: () => { path: string, hash: string }
    useParams: () => TParams
    useSearch: () => [
        TSearchParams,
        (setter: TSearchParams | ((current: TSearchParams) => TSearchParams)) => void
    ],
    useLoader: () => TLoader
};

type LoaderFunction<
    TParams extends {} | never = never,
    TSearchParams extends {} | never = never,
    TResponse = unknown
> = (args: LoaderArgs<TParams, TSearchParams>) => Response | void | TResponse | Promise<Response | void | TResponse>;

export interface ChildRouteOptions<
    TParentRoute extends RouteOptions<TParentParams, TParentSearchParams, any>,
    TChildParams extends {} | never = never,
    TChildSearchParams extends {} | never = never,
    TLoader = unknown,
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
    TLoader = unknown,
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
    TLoader = unknown
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




export type TypedParamsSchema<T extends AnyRouteData, TSchema extends keyof T["__types"], TTypes extends SchemaTypes<T, TSchema> = SchemaTypes<T, TSchema>> =
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
    = ExtractRequiredSchema<TRouteData, "search"> extends false
    ? ExtractRequiredSchema<TRouteData, "params"> extends false
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

export type SchemaTypes<T extends AnyRouteData, TSchema extends keyof T["__types"]> = {
    hasAnyFields: ExtractSchema<T, TSchema> extends never ? false : true;
    hasRequiredFields: ExtractRequiredSchema<T, TSchema> extends never ? false : true;
    source: T["__types"][TSchema];
}

// export type SearchParamOptions<
//     TRoutesInfo extends AnyRoutesInfo,
//     TFrom,
//     TTo,
//     // Find the schema for the new path, and make optional any keys
//     // that are already defined in the current schema
//     TToSchema = Partial<
//         RouteByPath<TRoutesInfo, TFrom>['__types']['fullSearchSchema']
//     > &
//     Omit<
//         RouteByPath<TRoutesInfo, TTo>['__types']['fullSearchSchema'],
//         keyof PickRequired<
//             RouteByPath<TRoutesInfo, TFrom>['__types']['fullSearchSchema']
//         >
//     >,
//     TFromFullSchema = UnionToIntersection<
//         TRoutesInfo['fullSearchSchema'] & TFromSchema
//     >,
//     TToFullSchema = UnionToIntersection<
//         TRoutesInfo['fullSearchSchema'] & TToSchema
//     >,
// > = keyof PickRequired<TToSchema> extends never
//     ? {
//         search?: true | SearchReducer<TFromFullSchema, TToFullSchema>
//     }
//     : {
//         search: SearchReducer<TFromFullSchema, TToFullSchema>
//     }