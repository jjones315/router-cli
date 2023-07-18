export const template = `
// Generated Code, changes to this file will be overridden.
/* eslint-disable */
import { lazy, RootRoute, Route } from "@tanstack/router";
import { AnyContext, AnyRoute, AnySearchSchema, ParsePathParams, RootRouteId, RouteContext, RouteOptions, TrimPath, TrimPathLeft, TrimPathRight } from "@tanstack/router";


/* {{imports}} */


/* {{routes}} */


/* {{tree}} */


// Types and configuration utility.
export type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N;
type MergeFromParent<T, U> = IsAny<T, U, T & U>;
export type AnyPathParams = {};

export type LateRouteOptions<
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

function createRouteConfig<
    TParentRoute extends AnyRoute = AnyRoute,
    TCustomId extends string = string,
    TPath extends string = '/'
>(generatedConfig: RouteOptions<TParentRoute, TCustomId, TPath>) {
    return {
        configure: <
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
        >(options: LateRouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext>):
            RouteOptions<TParentRoute, TCustomId, TPath, TLoader, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TParentContext, TAllParentContext, TRouteContext, TContext> => {
            return {
                component: generatedConfig.component,
                pendingComponent: generatedConfig.pendingComponent,
                errorComponent: generatedConfig.errorComponent,
                ...options,
                getParentRoute: generatedConfig.getParentRoute,
                id: (generatedConfig as any).id as TCustomId,
                path: (generatedConfig as any).path as TPath,
            };
        },
        generated: generatedConfig,
    }
}
`;