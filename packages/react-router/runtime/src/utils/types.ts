import { AnyRouteComponent, AnyRouteOptions } from "../types";


export type ExtractRouteData<T extends () => Promise<AnyRouteOptions>> = Awaited<ReturnType<T>>;
export type ExtractRouteDataMap<T extends Record<string, () => Promise<any>>> = {
    [Prop in keyof T]: ExtractRouteData<T[Prop]>;
}

export type PickRequired<T> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type PickRoutesWithSchema<T extends Record<string, AnyRouteComponent>, TSchema extends keyof AnyRouteOptions["__types"]> = {
    [K in keyof T as ExtractRouteSchema<T[K]["routeData"], TSchema> extends false ? never : K]: T[K]["routeData"]["__types"][TSchema]
}

export type PickRoutesWithLoader<T extends Record<string, AnyRouteComponent>> = {
    [K in keyof T as ExtractRouteLoader<T[K]["routeData"]> extends false ? never : K]: T[K]["routeData"]["__types"]["params"];
}

export type ExtractRouteRequiredSchema<T extends AnyRouteOptions, TSchema extends keyof T["__types"]> = ExtractRequiredSchema<T["__types"][TSchema]>;;
export type ExtractRouteSchema<T extends AnyRouteOptions, TSchema extends keyof T["__types"]> = ExtractSchema<T["__types"][TSchema]>;

export type ExtractRequiredSchema<T> = keyof PickRequired<T> extends never ? never : PickRequired<T>;
export type ExtractSchema<T> = keyof T extends never ? never : T;

export type ExtractRouteLoader<T extends AnyRouteOptions> = T["__types"]["loader"] extends never ? never : T["__types"]["loader"];