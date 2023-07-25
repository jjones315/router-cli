export const template = `// Generated Code, changes to this file will be overridden.
/* eslint-disable */

import {
  components,
  pageHooks,
  layoutHooks,
  functions,
  AllLinkProps,
  Route,
  ChildRoute,
  ExtractImportTypes,
  TypedTo,
  TypedToOrPath,
  createRoutes,
} from "@router-cli/react-router";

import { createRoutes } from "@router-cli/react-router/src/createRoutes";

/*imports*/

const appRoutes = {
  app: undefined,
  notFound: undefined,
}

export const pageImports = {};
export const layoutImports = {};

export const routes = (options?: { defaultErrorComponent: React.ComponentType<any> }) => createRoutes({appRoutes, pageImports, layoutImports}, options);

export type Pages = ExtractImportTypes<typeof pageImports>;
export type Layouts = ExtractImportTypes<typeof layoutImports>;

export const { Link, NavLink, Navigate } = components<Pages>();
export const { useNavigate, useSearchParams, useLoaderData } = pageHooks<Pages>(pageImports);
export const { useLayoutParams, useLayoutSearchParams, useLayoutLoaderData } = layoutHooks<Layouts>(layoutImports);
export const { redirect } = functions<Pages>();
export { Outlet, useLocation } from "@router-cli/react-router";

export type LinkProps = AllLinkProps<keyof Pages, Pages>["link"];
export type NavLinkProps = AllLinkProps<keyof Pages, Pages>["navLink"];
export type NavigateProps = AllLinkProps<keyof Pages, Pages>["navigate"];
export type To<TPath extends keyof Pages> = TypedTo<TPath, Pages[TPath]>;
export type ToOrPath<TPath extends keyof Pages> = TypedToOrPath<TPath, Pages[TPath]>;

export {
    Route,
    ChildRoute,
};

export type Routes = keyof Pages;

`;