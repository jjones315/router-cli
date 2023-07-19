export const template = `
// Generated Code, changes to this file will be overridden.
/* eslint-disable */
import { lazy, RootRoute, Route, AnyContext, AnyRoute, AnySearchSchema, ParsePathParams, RouteContext, RouteOptions, RouteComponent } from "@tanstack/router";
/* {{imports}} */


/* {{outlet}} */

// Types and configuration utility.
type GeneratedRoutes = typeof generatedRoutes;
type GeneratedLayouts = typeof generatedLayouts;
type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N;
type MergeFromParent<T, U> = IsAny<T, U, T & U>;
type AnyPathParams = {};

type LateRouteOptions<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = string,
    TLoader = unknown,
    TParentSearchSchema extends {} = {},
    TSearchSchema extends AnySearchSchema = {},
    TFullSearchSchema extends AnySearchSchema = TSearchSchema,
    TParentParams extends AnyPathParams = {},
    TParams = Record<ParsePathParams<TPath>, string>,
    TAllParams = TParams,
    TParentContext extends AnyContext = AnyContext,
    TAllParentContext extends IsAny<TParentRoute['__types']['allParams'],
        TParentContext,
        TParentRoute['__types']['allParams'] & TParentContext> = IsAny<TParentRoute['__types']['allParams'],
            TParentContext,
            TParentRoute['__types']['allParams'] & TParentContext>,
    TRouteContext extends RouteContext = RouteContext,
    TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>
> = Omit<RouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>, "getParentRoute" | "id" | "path" | "component" | "pendingComponent" | "errorComponent">;

export function configureRoute<
    TRoute extends keyof GeneratedRoutes = keyof GeneratedRoutes,
    TLoader = unknown,
    TParentSearchSchema extends {} = {},
    TSearchSchema extends AnySearchSchema = {},
    TFullSearchSchema extends AnySearchSchema = TSearchSchema,
    TParentParams extends AnyPathParams = {},
    TParams = Record<ParsePathParams<GeneratedRoutes[TRoute]['__types']["path"]>, string>,
    TAllParams = TParams,
    TParentContext extends AnyContext = AnyContext,
    TAllParentContext extends IsAny<GeneratedRoutes[TRoute]['__types']["parentRoute"]['__types']['allParams'],
        TParentContext,
        GeneratedRoutes[TRoute]['__types']["parentRoute"]["__types"]['allParams'] & TParentContext> = IsAny<GeneratedRoutes[TRoute]['__types']["parentRoute"]['__types']['allParams'],
            TParentContext,
            GeneratedRoutes[TRoute]['__types']["parentRoute"]['__types']['allParams'] & TParentContext>,
    TRouteContext extends RouteContext = RouteContext,
    TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>
>(route: TRoute, options: LateRouteOptions<GeneratedRoutes[TRoute]['__types']["parentRoute"], GeneratedRoutes[TRoute]['__types']["customId"], GeneratedRoutes[TRoute]['__types']["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>):
    LateRouteOptions<GeneratedRoutes[TRoute]['__types']["parentRoute"], GeneratedRoutes[TRoute]['__types']["customId"], GeneratedRoutes[TRoute]['__types']["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> {
    return options as any;
};

export function configureLayout<
    TRoute extends keyof GeneratedLayouts = keyof GeneratedLayouts,
    TLoader = unknown,
    TParentSearchSchema extends {} = {},
    TSearchSchema extends AnySearchSchema = {},
    TFullSearchSchema extends AnySearchSchema = TSearchSchema,
    TParentParams extends AnyPathParams = {},
    TParams = Record<ParsePathParams<GeneratedLayouts[TRoute]['__types']["path"]>, string>,
    TAllParams = TParams,
    TParentContext extends AnyContext = AnyContext,
    TAllParentContext extends IsAny<GeneratedLayouts[TRoute]['__types']["parentRoute"]['__types']['allParams'],
        TParentContext,
        GeneratedLayouts[TRoute]['__types']["parentRoute"]["__types"]['allParams'] & TParentContext> = IsAny<GeneratedLayouts[TRoute]['__types']["parentRoute"]['__types']['allParams'],
            TParentContext,
            GeneratedLayouts[TRoute]['__types']["parentRoute"]['__types']['allParams'] & TParentContext>,
    TRouteContext extends RouteContext = RouteContext,
    TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>
>(route: TRoute, options: LateRouteOptions<GeneratedLayouts[TRoute]['__types']["parentRoute"], GeneratedLayouts[TRoute]['__types']["customId"], GeneratedLayouts[TRoute]['__types']["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>):
    LateRouteOptions<GeneratedLayouts[TRoute]['__types']["parentRoute"], GeneratedLayouts[TRoute]['__types']["customId"], GeneratedLayouts[TRoute]['__types']["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> {
    return options as any;
};

function mergeConfig<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = string,
    TLoader = unknown,
    TParentSearchSchema extends {} = {},
    TSearchSchema extends AnySearchSchema = {},
    TFullSearchSchema extends AnySearchSchema = TSearchSchema,
    TParentParams extends AnyPathParams = {},
    TParams = Record<ParsePathParams<TPath>, string>,
    TAllParams = TParams,
    TParentContext extends AnyContext = AnyContext,
    TAllParentContext extends IsAny<TParentRoute['__types']['allParams'],
        TParentContext,
        TParentRoute['__types']['allParams'] & TParentContext> = IsAny<TParentRoute['__types']['allParams'],
            TParentContext,
            TParentRoute['__types']['allParams'] & TParentContext>,
    TRouteContext extends RouteContext = RouteContext,
    TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>
>(
    generated: Route<TParentRoute, TPath, any, TCustomId>,
    options: LateRouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>): 
    RouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> {
    return {
        ...options,
        getParentRoute: generated.options.getParentRoute,
        id: (generated.options as any).id,
        path: (generated.options as any).path,
        pendingComponent: generated.options.pendingComponent,
        errorComponent: generated.options.errorComponent,
        component: generated.options.component,
    } as any;
}
`;