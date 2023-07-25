import { redirect } from "react-router-dom"
import { AnyRouteData, TypedTo } from "../types";
import { getBasicPath } from "../utils/typed";

export const functions = <
    TPages extends Record<string, AnyRouteData>
>() => {
    type Init = number | ResponseInit
    return {
        redirect: <TPath extends keyof TPages & string>(to: TypedTo<TPath, TPages[TPath]>, options?: Init) => {
            const { search, pathname, hash } = getBasicPath(to);
            return redirect(`${pathname || "/"}${search || ""}${hash || ""}`, options);
        },
    }
}