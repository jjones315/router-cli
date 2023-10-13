import { ParamParseKey, PathMatch, PathPattern, matchPath as matchPathBase, redirect } from "react-router-dom"
import { AnyRouteComponent, TypedTo } from "../types";
import { getBasicPath } from "../utils/typed";

export const createFunctions = <
    TPages extends Record<string, AnyRouteComponent>
>() => {
    type Init = number | ResponseInit
    return {
        redirect<TPath extends keyof TPages & string>(to: TypedTo<TPath, TPages[TPath]>, options?: Init)  {
            const { search, pathname, hash } = getBasicPath(to);
            return redirect(`${pathname || "/"}${search || ""}${hash || ""}`, options);
        },
        matchPath<TParamKey extends ParamParseKey<TPath>, TPath extends keyof TPages & string>(pattern: PathPattern<TPath> | TPath, pathname: string): PathMatch<TParamKey> | null  {
            return matchPathLogic(pattern, pathname);
        },
        makeLinkProps<TPath extends keyof TPages & string>(to: TypedTo<TPath, TPages[TPath]>) {
            return to;
        },
    }
}

export function matchPathLogic<TParamKey extends ParamParseKey<TPath>, TPath extends string>(pattern: PathPattern<TPath> | TPath, pathname: string): PathMatch<TParamKey> | null {
    let result: PathMatch<TParamKey> | null = null;
    if(typeof pattern === "string"){
        result = matchPathBase(pattern.replace(/\/\$/, "/:"), pathname);
    }
    else{
        result = matchPathBase({
            path: pattern.path.replace(/\/\$/, "/:"),
            caseSensitive: pattern.caseSensitive,
            end: pattern.end
        }, pathname); 
    }

    if(result === null){
        return null;
    }
    result.pattern.path = result.pattern.path.replace(/\/\:/, "/$");
    return result;
};