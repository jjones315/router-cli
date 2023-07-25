import {
    LoaderFunction,
    NavigateOptions,
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

export const pageHooks = <
    TPages extends Record<string, AnyRouteData>,
>(imports: Record<keyof TPages, () => Promise<AnyRoute>>) => {

    const useImport = <TPath extends keyof TPages & string>(key: TPath) => {
        const modulePromise = imports[key]();
        const getter = useSuspendedPromise(modulePromise, [key]);
        return getter as TPages[TPath];
    }

    return {
        useNavigate: () => {
            const navigate = useNavigate();
            return useCallback(<TPath extends keyof TPages & string>(route: TypedToOrPath<TPath, TPages[TPath]> | "./" | "../", options?: NavigateOptions) => {
                if (route === "./") {
                    return navigate(0);
                }
                if (route === "../") {
                    return navigate(-1);
                }
                return navigate(getBasicPath(route), options);
            }, [navigate]);
        },
        useSearchParams<
            TPath extends keyof TPages & string,
            TRoute extends TPages[TPath] = TPages[TPath],
            TSearch extends {} = {},
            TSearchSchema extends TRoute["searchSchema"] & ParamSchema<TSearch> = TRoute["searchSchema"] & ParamSchema<TSearch>,
        >(route: TPath) {
            const module = useImport(route);
            return useTypedSearchParams<TSearch>(module.searchSchema!);
        },
        useLoaderData<
            TPath extends keyof TPages & string,
            TRoute extends TPages[TPath] = TPages[TPath],
            TLoaderFunc extends TRoute["loader"] & LoaderFunction = TRoute["loader"] & LoaderFunction,
        >(route: TPath) {
            const loaderData = useRouteLoaderData(route);
            return loaderData as ReturnType<TLoaderFunc>;
        },
    }
}

export const layoutHooks = <
    TLayouts extends Record<string, AnyRouteData>,
>(imports: Record<keyof TLayouts, () => Promise<AnyRoute>>) => {

    const useImport = <TRoute extends keyof TLayouts>(key: TRoute) => {
        const modulePromise = imports[key]();
        const getter = useSuspendedPromise(modulePromise, [key]);
        return getter as TLayouts[TRoute];
    }

    return {
        useLayoutParams<
            TPath extends keyof TLayouts & string,
            TRoute extends TLayouts[TPath] = TLayouts[TPath],
            TParams extends {} = {},
            TParamsSchema extends TRoute["paramsSchema"] & ParamSchema<TParams> = TRoute["paramsSchema"] & ParamSchema<TParams>,
        >(key: TPath): TParams {
            const module = useImport(key);
            const params = useParams();
            const schema = module.paramsSchema!
            return useMemo(() => parseSchema(params, schema), [schema, params]);
        },
        useLayoutSearchParams<
            TPath extends keyof TLayouts & string,
            TRoute extends TLayouts[TPath] = TLayouts[TPath],
            TSearch extends {} = {},
            TSearchSchema extends TRoute["searchSchema"] & ParamSchema<TSearch> = TRoute["searchSchema"] & ParamSchema<TSearch>,
        >(route: TPath) {
            const module = useImport(route);
            return useTypedSearchParams<TSearch>(module.searchSchema!);
        },
        useLayoutLoaderData<
            TPath extends keyof TLayouts & string,
            TRoute extends TLayouts[TPath] = TLayouts[TPath],
            TLoaderFunc extends TRoute["loader"] & LoaderFunction = TRoute["loader"] & LoaderFunction,
        >(route: TPath) {
            const loaderData = useRouteLoaderData(route);
            return loaderData as ReturnType<TLoaderFunc>;
        },
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