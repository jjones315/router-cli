export const template = `// Generated Code, changes to this file will be overridden.
/* eslint-disable */

import { createElement } from "react";
import {
  createComponents,
  createHooks,
  createFunctions,
  AllLinkProps,
  createRoute,
  ExtractRouteDataMap,
  TypedTo,
  TypedToOrPath,
  createRoutes,
  RouterProvider,
  /*{browserType}*/
} from "@router-cli/react-router";
/*imports*/

const appRoutes = {
  app: undefined,
  notFound: undefined,
  pending: undefined,
  error: undefined,
}

export const pageImports = {};
export const layoutImports = {};

export const routes = createRoutes({appRoutes, pageImports, layoutImports});
export const router = /*{browserType}*/(routes);
export const RouterOutlet = () => createElement(RouterProvider, { router }, null);

export type Pages = ExtractRouteDataMap<typeof pageImports>;
export type Routes = keyof Pages;
export type Layouts = ExtractRouteDataMap<typeof layoutImports>;

export const { Link, NavLink, Navigate } = createComponents<Pages>();
export const { useNavigate, useSearch, useLoaderData, useParams, useMatch } = createHooks<Pages, Layouts>({ pageImports, layoutImports });
export const { matchPath, redirect, makeLinkProps } = createFunctions<Pages>();
export { Outlet, useLocation } from "@router-cli/react-router";

export type LinkProps<TPath extends Routes = Routes> = AllLinkProps<TPath, Pages>["link"];
export type NavLinkProps<TPath extends Routes = Routes> = AllLinkProps<TPath, Pages>["navLink"];
export type NavigateProps<TPath extends Routes = Routes> = AllLinkProps<TPath, Pages>["navigate"];
export type To<TPath extends Routes = Routes> = TypedTo<TPath, Pages[TPath]>;
export type ToOrPath<TPath extends Routes = Routes> = TypedToOrPath<TPath, Pages[TPath]>;

export {
  createRoute,
};

/*exports*/
`;