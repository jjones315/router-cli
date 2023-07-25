export const template = `// Generated Code, changes to this file will be overridden.
/* eslint-disable */

import {
  createComponents,
  createHooks,
  createFunctions,
  AllLinkProps,
  Route,
  ChildRoute,
  ExtractRouteDataMap,
  TypedTo,
  TypedToOrPath,
  createRoutes,
} from "@router-cli/react-router";

/*imports*/

const appRoutes = {
  app: undefined,
  notFound: undefined,
}

export const pageImports = {};
export const layoutImports = {};

export const routes = (options?: { defaultErrorComponent: React.ComponentType<any> }) => createRoutes({appRoutes, pageImports, layoutImports}, options);

export type Pages = ExtractRouteDataMap<typeof pageImports>;
export type Layouts = ExtractRouteDataMap<typeof layoutImports>;

export const { Link, NavLink, Navigate } = createComponents<Pages>();
export const { useNavigate, useSearchParams, useLoaderData, useParams, useMatch } = createHooks<Pages, Layouts>({ pageImports, layoutImports });
export const { matchPath, redirect } = createFunctions<Pages>();
export { Outlet, useLocation } from "@router-cli/react-router";

export type LinkProps<TPath extends keyof Pages = keyof Pages> = AllLinkProps<TPath, Pages>["link"];
export type NavLinkProps<TPath extends keyof Pages = keyof Pages> = AllLinkProps<TPath, Pages>["navLink"];
export type NavigateProps<TPath extends keyof Pages = keyof Pages> = AllLinkProps<TPath, Pages>["navigate"];
export type To<TPath extends keyof Pages = keyof Pages> = TypedTo<TPath, Pages[TPath]>;
export type ToOrPath<TPath extends keyof Pages = keyof Pages> = TypedToOrPath<TPath, Pages[TPath]>;

export {
    Route,
    ChildRoute,
};

export type Routes = keyof Pages;

`;