import React from "react";
import { createTypedRouter } from "./createRouter";
import { AllLinkProps, createComponents } from "./public/components";
import { createFunctions } from "./public/functions";
import { createImportHooks, createTypedHooks } from "./public/hooks";
import { AnyRouter, AnyRouteImports, TypedTo, TypedToOrPath, AppRoutes } from "./types";
import { ExtractRouteDataMap } from "./utils/types";

// Types
export interface Register {
}

export type RegisteredRouter = Register extends {
    pages: infer TPages extends AnyRouteImports;
    layouts: infer TLayouts extends AnyRouteImports;
}
    ? {
        pages: TPages;
        layouts: TLayouts;
        app: AppRoutes
    } : AnyRouter

let ROUTER: RegisteredRouter;

export function register<TRouter extends AnyRouter>(router: TRouter): TRouter{
    ROUTER = router;
    return router;
}

function getRegisteredRouter(): RegisteredRouter{
    if(!ROUTER) throw new Error("router must be registered before it can be used.");
    return ROUTER;
}

export type Pages = ExtractRouteDataMap<RegisteredRouter["pages"]>;
export type Routes = keyof Pages;
export type Layouts = ExtractRouteDataMap<RegisteredRouter["layouts"]>;
export type LinkProps<TPath extends Routes = Routes> = AllLinkProps<TPath, Pages>["link"];
export type NavLinkProps<TPath extends Routes = Routes> = AllLinkProps<TPath, Pages>["navLink"];
export type NavigateProps<TPath extends Routes = Routes> = AllLinkProps<TPath, Pages>["navigate"];
export type To<TPath extends Routes = Routes> = TypedTo<TPath, Pages[TPath]>;
export type ToOrPath<TPath extends Routes = Routes> = TypedToOrPath<TPath, Pages[TPath]>;
export type { AllLinkProps, TypedLinkBase } from "./public/components";

// Functions/Components
export const { Link, NavLink, Navigate } = createComponents<Pages>();
export const { matchPath, redirect, makeLinkProps } = createFunctions<Pages>();
export const { useLoaderData, useMatch, useNavigate } = createTypedHooks();
export const createHooks = () => createImportHooks(getRegisteredRouter());
export const createRouter = () => createTypedRouter(getRegisteredRouter()!);
export const RouterOutlet = () => createTypedRouter(getRegisteredRouter()!);
export * from "./utils/errors";
export { createRoute } from "./public/routes";
export { Outlet, useLocation, createBrowserRouter, createMemoryRouter, createHashRouter, RouterProvider, useRouteError, unstable_usePrompt, unstable_useBlocker } from "react-router-dom";
