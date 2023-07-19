import { ModuleImport, RouteData, RouteExports, RouteItem, RouteNaming } from "../definitions/types";
import clc from "cli-color";

export const trimCharEnd = (src: string, char: string) => {
    while (src.endsWith(char)) {
        src = src.slice(0, src.length - char.length);
    }
    return src;
}

export const trimCharStart = (src: string, char: string) => {
    while (src.startsWith(char)) {
        src = src.slice(char.length);
    }
    return src;
}

export const trimChar = (src: string, char: string) => {
    return trimCharEnd(trimCharStart(src, char), char);
}



export const sortByDepth = (src: string[]) => src.sort((a, b) => b.split("/").length - a.split("/").length);

export const getMapKeys = <T>(src: Map<T, any>): T[] => {
    const keys: T[] = [];
    for (const key of src.keys()) {
        keys.push(key);
    }
    return keys;
}
