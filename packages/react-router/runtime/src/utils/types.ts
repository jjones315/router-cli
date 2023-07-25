import { Route } from "../public/routes";
import { AnyRouteData } from "../types";


export type ExtractRouteData<T extends () => Promise<Route<any, any, any>>> = Awaited<ReturnType<T>>["data"];
export type ExtractRouteDataMap<T extends Record<string, () => Promise<any>>> = {
    [Prop in keyof T]: ExtractRouteData<T[Prop]>;
}

export type PickRequired<T> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type PickRoutesWithSchema<T extends Record<string, AnyRouteData>, TSchema extends keyof AnyRouteData["__types"]> = {
    [K in keyof T as ExtractRouteSchema<T[K], TSchema> extends false ? never : K]: T[K]["__types"][TSchema]
}

export type PickRoutesWithLoader<T extends Record<string, AnyRouteData>> = {
    [K in keyof T as ExtractRouteLoader<T[K]> extends false ? never : K]: T[K]["__types"]["params"];
}

export type ExtractRouteRequiredSchema<T extends AnyRouteData, TSchema extends keyof T["__types"]> = ExtractRequiredSchema<T["__types"][TSchema]>;;
export type ExtractRouteSchema<T extends AnyRouteData, TSchema extends keyof T["__types"]> = ExtractSchema<T["__types"][TSchema]>;

export type ExtractRequiredSchema<T extends {} | never> = keyof PickRequired<T> extends never ? never : PickRequired<T>;
export type ExtractSchema<T extends {} | never> = keyof T extends never ? never : T;

export type ExtractRouteLoader<T extends AnyRouteData> = T["__types"]["loader"] extends never ? never : T["__types"]["loader"];