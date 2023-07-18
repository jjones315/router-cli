export const template = `
// Generated Code, changes to this file will be overridden.
/* eslint-disable */
import { lazy, RootRoute, Route, AnyContext, AnyRoute, AnySearchSchema, ParsePathParams, RouteContext, RouteOptions, RouteComponent } from "@tanstack/router";
/* {{imports}} */


/* {{outlet}} */

// Types and configuration utility.
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


function createRouteConfigurator<
    TGeneratedRoutes extends { [route: string]: TypedRouteOptions },
>(generatedRoute: TGeneratedRoutes) {
    return {
        configure: <
            TRoute extends keyof TGeneratedRoutes,
            TLoader = unknown,
            TParentSearchSchema extends {} = {},
            TSearchSchema extends AnySearchSchema = {},
            TFullSearchSchema extends AnySearchSchema = TSearchSchema,
            TParentParams extends AnyPathParams = {},
            TParams = Record<ParsePathParams<TGeneratedRoutes[TRoute]["__types"]["path"]>, string>,
            TAllParams = TParams,
            TParentContext extends AnyContext = AnyContext,
            TAllParentContext extends IsAny<TGeneratedRoutes[TRoute]["__types"]["parentRoute"]['__types']['allParams'],
                TParentContext,
                TGeneratedRoutes[TRoute]["__types"]["parentRoute"]['__types']['allParams'] & TParentContext> = IsAny<TGeneratedRoutes[TRoute]["__types"]["parentRoute"]['__types']['allParams'],
                    TParentContext,
                    TGeneratedRoutes[TRoute]["__types"]["parentRoute"]['__types']['allParams'] & TParentContext>,
            TRouteContext extends RouteContext = RouteContext,
            TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>
        >(route: TRoute, options: LateRouteOptions<TGeneratedRoutes[TRoute]["__types"]["parentRoute"], TGeneratedRoutes[TRoute]["__types"]["customId"], TGeneratedRoutes[TRoute]["__types"]["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>):
            RouteOptions<TGeneratedRoutes[TRoute]["__types"]["parentRoute"], TGeneratedRoutes[TRoute]["__types"]["customId"], TGeneratedRoutes[TRoute]["__types"]["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> => {
            return {
                ...options,
                getParentRoute: generatedRoute.getParentRoute,
                id: (generatedRoute as any).id,
                path: generatedRoute.path,
                pendingComponent: generatedRoute.pendingComponent,
                errorComponent: generatedRoute.errorComponent,
                component: generatedRoute.component,
            } as any;
        },
    }
}

type TypedRouteOptions<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = string,
> = {
    getParentRoute: () => TParentRoute,
    id: TCustomId,
    path: TPath,
    pendingComponent: RouteComponent,
    errorComponent: RouteComponent<{
        error: Error;
        info: {
            componentStack: string;
        };
    }>,
    component: RouteComponent,
    __types: {
        parentRoute: TParentRoute,
        customId: TCustomId,
        path: TPath,
    }
}

function routeConfig<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = string,
>(options: RouteOptions<TParentRoute, TCustomId, TPath>): TypedRouteOptions<TParentRoute, TCustomId, TPath> {
    return options as any
}
`;