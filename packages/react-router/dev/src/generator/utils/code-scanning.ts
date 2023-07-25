import { RouteExports, RouteType } from "../types";

export const getRouteExports = (content: string, type: RouteType): RouteExports => {
    return ({
        default: /^export\s+default\s+/gm.test(content),
    });
}


export const transformRoute = (src: string, hiddenDirectories:string[] = []) => {
    let result = src
        .replace(/(\.page|\/_layout)\.tsx$/g, '')
        .replace(/\/$catchAll\//g, '/*/')
        .replace(/\/?index|\./g, '/')
        .replace(/(\w)\/$/g, '$1');

    let segments = result.split("/").filter(Boolean);

    if(hiddenDirectories.length > 0){
        for(const dir of hiddenDirectories){
            segments = segments.filter(s => s !== dir);
        }
    }

    return segments.join("/")
}
