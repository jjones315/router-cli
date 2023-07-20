export const template = `
// Generated Code, changes to this file will be overridden.
/* eslint-disable */
import type { z, ZodType } from "zod";
import { lazy, RootRoute, Route, AnyContext, AnyRoute, AnySearchSchema, ParsePathParams, RouteContext, RouteOptions, RouteComponent } from "@tanstack/router";
/* {{imports}} */


/* {{outlet}} */

// Types and configuration utility.
type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N;
type MergeFromParent<T, U> = IsAny<T, U, T & U>;
type SelectSchemaType<TLateSchema extends ZodType<any> | {}, TGenerated> = TLateSchema extends ZodType<any> ? z.TypeOf<TLateSchema> : TGenerated;
type AnyPathParams = {};

export type LateRouteOptions<TParamsSchema extends ZodType<any> | {} = {}, TSearchSchema extends ZodType<any> | {} = {}> = {
    paramsSchema?: TParamsSchema,
    searchSchema?: TSearchSchema,
}

export function routeOptions<TParamsSchema extends ZodType<any> | {} = {}, TSearchSchema extends ZodType<any> | {} = {}>(options: LateRouteOptions<TParamsSchema, TSearchSchema>) {
    return options;
}

function createRouteOptions<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = string,
    TLoader = unknown,
    TParentSearchSchema extends {} = {},
    TSearchSchema extends ZodType<any> | {} = {},
    TFullSearchSchema extends AnySearchSchema = SelectSchemaType<TSearchSchema, {}>,
    TParentParams extends AnyPathParams = {},
    TLateParamsSchema extends ZodType<any> | {} = {},
    TParams = SelectSchemaType<TLateParamsSchema, Record<ParsePathParams<TPath>, string>>,
    TAllParams = TParams,
    TParentContext extends AnyContext = AnyContext,
    TAllParentContext extends IsAny<TParentRoute['__types']['allParams'],
        TParentContext,
        TParentRoute["__types"]['allParams'] & TParentContext> = IsAny<TParentRoute['__types']['allParams'],
            TParentContext,
            TParentRoute['__types']['allParams'] & TParentContext>,
    TRouteContext extends RouteContext = RouteContext,
    TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>,  
>(
    generated: RouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, any, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>,
    config: LateRouteOptions<TLateParamsSchema, TSearchSchema>
): RouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, SelectSchemaType<TSearchSchema, {}>, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> {
    return {
        getParentRoute: generated.getParentRoute,
        id: (generated as any).id as TCustomId,
        path: (generated as any).path as TPath,
        pendingComponent: generated.pendingComponent,
        errorComponent: generated.errorComponent,
        component: generated.component,
        validateSearch: config.searchSchema,
        parseParams: (raw: any) => (config.searchSchema as any)?.parse(raw),
    }
}
`;