import { Route } from "../public/routes";
import { AnyRouteData } from "../types";


export type ExtractRouteData<T extends () => Promise<Route<any, any, any>>> = Awaited<ReturnType<T>>["data"];
export type ExtractRouteDataMap<T extends Record<string, () => Promise<any>>> = {
    [Prop in keyof T]: ExtractRouteData<T[Prop]>;
}

export type PickRequired<T> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type ExtractRequiredSchema<T extends AnyRouteData, TSchema extends keyof T["__types"]> = keyof PickRequired<T["__types"][TSchema]> extends never ? never : PickRequired<T["__types"][TSchema]>;
export type ExtractSchema<T extends AnyRouteData, TSchema extends keyof T["__types"]> = keyof T["__types"][TSchema] extends never ? never : T["__types"][TSchema];
export type ExtractLoader<T extends AnyRouteData> = keyof T["__types"]["loader"] extends undefined ? never : T["__types"]["loader"];