import clc from "cli-color";
import { RouteItem } from "src/definitions/types";

export const printRouteTree = (route: RouteItem, last: boolean, indent: string = "") => {
    let line: string = indent + "|-- ";
    if (last) {
        indent += "    ";
    }
    else {
        indent += "|   ";
    }
    line += `${route.naming.route || "index"} [${route.fullRoute}]`;
    console.log(line);

    if (route.children) {
        for (let i = 0; i < route.children.length; i++) {
            printRouteTree(route.children[i], i === route.children.length - 1, indent);
        }
    }
}

export const getSeparator = (size: number) => {
    return "_".repeat(size);
}

export const verboseLog = (section: string, log?: () => void) => {
    const title = `router-cli - ${section}`;
    const separatorSize = process.stdout.columns;
    if (log) {
        console.log(clc.green(title + getSeparator(separatorSize - title.length)));
        log();
    }
    else{
        console.log(clc.green(title));
    }
}