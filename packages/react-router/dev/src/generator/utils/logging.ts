import clc from "cli-color";
import { RouteItem } from "../types";

// export const printRouteTree = (route: RouteItem, last: boolean, indent: string = "") => {
//     let line: string = indent + "|-- ";
//     if (last) {
//         indent += "    ";
//     }
//     else {
//         indent += "|   ";
//     }
//     line += `${route.id}`;

//     if(route.type == "page"){
//         line += ` - [${route.fullRoute}]`;
//     }
//     console.log(line);

//     if (route.children) {
//         for (let i = 0; i < route.children.length; i++) {
//             printRouteTree(route.children[i], i === route.children.length - 1, indent);
//         }
//     }
// }