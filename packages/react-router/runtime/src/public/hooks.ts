import {
    NavigateOptions,
    ParamParseKey,
    PathMatch,
    PathPattern,
    useLocation,
    useNavigate,
    useParams,
    useRouteLoaderData,
    useSearchParams
} from 'react-router-dom';
import { ParamSchema, AnyRouteData, TypedToOrPath, AnyRoute } from '../types';
import { useCallback, useMemo } from 'react';
import { parseQuery } from '../utils/requestParser';
import { getBasicPath } from '../utils/typed';
import searchParamUtilities from '../utils/searchParams';
import { useSuspendedPromise } from '../hooks/useSuspendedPromise';
import { parseSchema } from '../utils/schemaParser';
import { PickRoutesWithSchema } from '../utils/types';
import { matchPathLogic } from './functions';

export const createHooks = <
    TPages extends Record<string, AnyRouteData>,
    TLayouts extends Record<string, AnyRouteData>,
>({ pageImports, layoutImports }: {
    pageImports: Record<keyof TPages, () => Promise<AnyRoute>>,
    layoutImports: Record<keyof TLayouts, () => Promise<AnyRoute>>,
}) => {
    type AllRoutes = TPages & TLayouts;
    type RoutesWithParams = PickRoutesWithSchema<AllRoutes, "params">;
    type RoutesWithSearchParams = PickRoutesWithSchema<AllRoutes, "search">;

    const useImport = <TRoute extends keyof AllRoutes & string>(key: TRoute) => {
        const modulePromise = key.endsWith("/layout") ? layoutImports[key] : pageImports[key];
        // This "should" never suspend, since the route will be written to cache when the router resolves it.
        const getter = useSuspendedPromise(modulePromise(), key);
        return getter.data as AllRoutes[TRoute];
    }

    return {
        useNavigate() {
            const navigate = useNavigate();
            return useCallback(<TPath extends keyof TPages & string>(route: TypedToOrPath<TPath, TPages[TPath]> | number, options?: NavigateOptions) => {
                if (typeof route === "number") {
                    return navigate(route);
                }
                return navigate(getBasicPath(route), options);
            }, [navigate]);
        },
        useSearch<TPath extends keyof AllRoutes & keyof RoutesWithSearchParams & string>(route: TPath) {
            const module = useImport(route);
            return useTypedSearch<RoutesWithSearchParams[TPath]>(module.searchSchema!);
        },
        useParams<TPath extends keyof AllRoutes & keyof RoutesWithParams & string>(route: TPath): RoutesWithParams[TPath] {
            const module = useImport(route);
            return useTypedParams(module.paramsSchema!);
        },
        useLoaderData<
            TPath extends keyof AllRoutes & string,
        >(route: TPath) {
            const loaderData = useRouteLoaderData(route);
            return loaderData as AllRoutes[TPath]["__types"]["loader"];
        },
        useMatch<
            TParamKey extends ParamParseKey<TPath>,
            TPath extends keyof AllRoutes & string
        >(pattern: PathPattern<TPath> | TPath): PathMatch<TParamKey> | null {
            let { pathname } = useLocation();
            return useMemo(() => matchPathLogic<TParamKey, TPath>(pattern, pathname), [pathname, pattern]);
        }
    }
}

export type SetAction<TData> = ((data: TData | undefined) => TData | undefined) | (TData | undefined);


export function useTypedSearch<TData extends Record<string, unknown>>(schema: ParamSchema<TData>): [TData, (action: SetAction<TData>) => void] {
    if (!schema) {
        throw new Error("useParams cannot be used on a route with no paramsSchema");
    }
    const [searchParams, setSearchParams] = useSearchParams();

    return [
        useMemo(() => parseQuery(searchParams, schema), [searchParams, schema]),
        useCallback((action: SetAction<TData>) => searchParamsSetter(action, setSearchParams, schema), [setSearchParams, schema]),
    ];
}

export function useTypedParams<TData extends Record<string, unknown>>(schema: ParamSchema<TData>): TData {
    if (!schema) {
        throw new Error("useSearch cannot be used on a route with no searchSchema");
    }
    
    const params = useParams();
    return useMemo(() => parseSchema(params, schema), [schema, params]);
}

const searchParamsSetter = <TData extends Record<string, unknown>>(action: SetAction<TData>, setter: ReturnType<typeof useSearchParams>[1], schema: ParamSchema<TData>): any => {
    if (action instanceof Function) {
        setter((current) => {
            const currentParsed = parseQuery<TData>(current, schema);
            const data = action(currentParsed);
            if (data) {
                return validateSearchParams(schema, data);
            }
            return "";
        });
    }
    else {
        if (action) {
            var str = validateSearchParams(schema, action);
            setter(str);
        }
    }
}

const validateSearchParams = <TData extends Record<string, unknown>>(schema: ParamSchema<TData>, data: TData): string => {
    const validation = parseSchema(data, schema);
    return searchParamUtilities.stringify(validation);
}