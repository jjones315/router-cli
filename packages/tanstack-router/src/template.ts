export const template = `
// Generated Code, changes to this file will be overridden.
/* eslint-disable */
import { lazy, RootRoute, Route, AnyContext, AnyRoute, AnySearchSchema, ParsePathParams, RouteContext, RouteOptions, RouteComponent } from "@tanstack/router";
/* {{imports}} */


/* {{outlet}} */

// Types and configuration utility.
// Types and configuration utility.
type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N;
type MergeFromParent<T, U> = IsAny<T, U, T & U>;
type LateRouteOptions<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = string,
    TLoader = unknown,
    TParentSearchSchema extends {} = {},
    TSearchSchema extends AnySearchSchema = {},
    TFullSearchSchema extends AnySearchSchema = TSearchSchema,
    TParentParams extends {} = {},
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
    TRoute extends AnyRoute = AnyRoute,
>(generatedRoute: TRoute) {
    return {
        configure: <
            TLoader = TRoute['__types']["loader"],
            TParentSearchSchema extends {} = {},
            TSearchSchema extends AnySearchSchema = {},
            TFullSearchSchema extends AnySearchSchema = TSearchSchema,
            TParentParams extends {} = {},
            TParams = TRoute['__types']["params"],
            TAllParams = TParams,
            TParentContext extends AnyContext = AnyContext,
            TAllParentContext extends IsAny<TRoute['__types']["parentRoute"]['__types']['allParams'],
                TParentContext,
                TRoute['__types']["parentRoute"]["__types"]['allParams'] & TParentContext> = IsAny<TRoute['__types']["parentRoute"]['__types']['allParams'],
                    TParentContext,
                    TRoute['__types']["parentRoute"]['__types']['allParams'] & TParentContext>,
            TRouteContext extends RouteContext = RouteContext,
            TContext extends MergeFromParent<TAllParentContext, TRouteContext> = MergeFromParent<TAllParentContext, TRouteContext>
        >(options: LateRouteOptions<TRoute['__types']["parentRoute"], TRoute['__types']["customId"], TRoute['__types']["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>):
            RouteOptions<TRoute['__types']["parentRoute"], TRoute['__types']["customId"], TRoute['__types']["path"], TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> => {
            return {
                ...options,
                getParentRoute: generatedRoute.options.getParentRoute,
                id: (generatedRoute.options as any).id,
                path: (generatedRoute.options as any).path,
                pendingComponent: generatedRoute.options.pendingComponent,
                errorComponent: generatedRoute.options.errorComponent,
                component: generatedRoute.options.component,
            } as any;
        },
    }
}
`;