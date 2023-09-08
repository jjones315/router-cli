import React, { PropsWithoutRef, RefAttributes } from "react";
import {
    Link, NavLink, Navigate,
    LinkProps as BaseLinkProps,
    NavLinkProps as BaseNavLinkProps,
    NavigateProps as BaseNavigateProps
} from "react-router-dom";
import { forwardRef } from "react";
import { AnyRouteComponent, TypedTo } from "../types";
import { getBasicPath } from "../utils/typed";

export const createComponents = <
    TPages extends Record<string, AnyRouteComponent>,
>() => {
    type Components = {
        Link: <TPath extends keyof TPages & string>(props: PropsWithoutRef<AllLinkProps<TPath, TPages>["link"]> & RefAttributes<HTMLAnchorElement> ) => ReturnType<ReturnType<typeof forwardRef<HTMLAnchorElement, AllLinkProps<TPath, TPages>["link"]>>>
        NavLink: <TPath extends keyof TPages & string>(props: PropsWithoutRef<AllLinkProps<TPath, TPages>["navLink"]> & RefAttributes<HTMLAnchorElement> ) => ReturnType<ReturnType<typeof forwardRef<HTMLAnchorElement, AllLinkProps<TPath, TPages>["navLink"]>>>
        Navigate: <TPath extends keyof TPages & string>(props: AllLinkProps<TPath, TPages>["navigate"]) => JSX.Element
    }

    return {
        Link: forwardRef<HTMLAnchorElement, AllLinkProps<keyof TPages & string, TPages>["link"]>((props, ref) => {
            const { to, hash, search, params, ...others } = props as typeof props & EmptyParams;
            return <Link ref={ref} {...others} to={getBasicPath({ to: to as any, hash, search, params })} />
        }),
        NavLink: forwardRef<HTMLAnchorElement, AllLinkProps<keyof TPages & string, TPages>["navLink"]>((props, ref) => {
            const { to, hash, search, params, ...others } = props as typeof props & EmptyParams;
            return <NavLink ref={ref} {...others} to={getBasicPath({ to: to as any, hash, search, params })} />
        }),
        Navigate: (props: AllLinkProps<keyof TPages & string, TPages>["navigate"]) => {
            const { to, hash, search, params, ...others } = props as typeof props & EmptyParams;
            return <Navigate  {...others} to={getBasicPath({ to: to as any, hash, search, params })} />
        },
    } as any as Components;
}

type EmptyParams = { search?: never, params?: never }


export type TypedLinkBase<
    TLinkProps,
    TPath extends string,
    TRoute extends AnyRouteComponent,
> = Omit<TLinkProps, "to" | "params" | "search" | "hash"> & TypedTo<TPath, TRoute>;


export interface AllLinkProps<
    TPath extends keyof TPages & string,
    TPages extends Record<string, AnyRouteComponent>,
> {
    link: TypedLinkBase<BaseLinkProps, TPath, TPages[TPath]>;
    navLink: TypedLinkBase<BaseNavLinkProps, TPath, TPages[TPath]>;
    navigate: TypedLinkBase<BaseNavigateProps, TPath, TPages[TPath]>;
}