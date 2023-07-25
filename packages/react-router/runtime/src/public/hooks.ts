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
        const getter = useSuspendedPromise(modulePromise(), [key]);
        return getter as AllRoutes[TRoute];
    }

    function useTypedNavigate(){
        const navigate = useNavigate();
        return useCallback(<TPath extends keyof TPages & string>(route: TypedToOrPath<TPath, TPages[TPath]> | number, options?: NavigateOptions) => {
            if (typeof route === "number") {
                return navigate(route);
            }
            return navigate(getBasicPath(route), options);
        }, [navigate]);
    }

    function useSearchParams<
        TPath extends keyof AllRoutes & keyof RoutesWithSearchParams & string
    >(route: TPath) {
        const module = useImport(route);
        return useTypedSearchParams<RoutesWithSearchParams[TPath]>(module.searchSchema!);
    }

    function useTypedParams<
        TPath extends keyof AllRoutes & keyof RoutesWithParams & string
    >(route: TPath): RoutesWithParams[TPath] {
        const module = useImport(route);
        const params = useParams();
        const schema = module.paramsSchema!
        return useMemo(() => parseSchema(params, schema), [schema, params]);
    }

    function useLoaderData<
        TPath extends keyof AllRoutes & string,
    >(route: TPath) {
        const loaderData = useRouteLoaderData(route);
        return loaderData as AllRoutes[TPath]["__types"]["loader"];
    };
    
    function useTypedMatch<
        TParamKey extends ParamParseKey<TPath>, 
        TPath extends keyof AllRoutes & string
    >(pattern: PathPattern<TPath> | TPath): PathMatch<TParamKey> | null {
        let { pathname } = useLocation();
        return useMemo(
          () => matchPathLogic<TParamKey, TPath>(pattern, pathname),
          [pathname, pattern]
        );
    };

    return {
        useNavigate: useTypedNavigate,
        useSearchParams,
        useParams: useTypedParams,
        useLoaderData,
        useMatch: useTypedMatch
    }
}

type SetAction<TData> = ((data: TData | undefined) => TData | undefined) | (TData | undefined);

export function useTypedSearchParams<TData extends Record<string, unknown>>(schema: ParamSchema<TData>): [TData, (action: SetAction<TData>) => void] {
    const [searchParams, setSearchParams] = useSearchParams();
    return getTypedSearchParamsResult(searchParams, setSearchParams, schema);
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

export function getTypedSearchParamsResult<TData extends Record<string, unknown>>(
    searchParams: ReturnType<typeof useSearchParams>[0],
    setter: ReturnType<typeof useSearchParams>[1],
    schema: ParamSchema<TData>): [TData, (action: SetAction<TData>) => void] {
    return [
        parseQuery(searchParams, schema),
        (action) => searchParamsSetter(action, setter, schema)
    ];
}

const validateSearchParams = <TData extends Record<string, unknown>>(schema: ParamSchema<TData>, data: TData): string => {
    const validation = parseSchema(data, schema);
    return searchParamUtilities.stringify(validation);
}