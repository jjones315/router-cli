import { template } from "../template";
import { RouterType, AppRouteComponents } from "../types";

type PopulateTemplateArgs = {
    layouts: RouteData;
    pages: RouteData;
    appRouteComponents: AppRouteComponents,
    imports: string[];
    exports: string[];
    routerType: RouterType;
};

export type RouteData = {
    routes: string[];
    imports: string[];
};

export const CODE_NAMING = {
    exportType: "export type",
    exportConst: "export const",
    never: "never",
    empty: "{}",
    pages: "pageImports",
    layouts: "layoutImports"
}

export function populateTemplate(args: PopulateTemplateArgs) {
    let content = template;


    function replaceImportObject(src: string[], type: string) {
        if (src.length > 0) {
            content = content.replaceAll(
                `${CODE_NAMING.exportConst} ${type} = ${CODE_NAMING.empty};`,
                `${CODE_NAMING.exportConst} ${type} = {
    ${src.sort().join(',\n    ')}
};`);
        }
    }

    replaceImportObject(args.layouts.imports, CODE_NAMING.layouts);
    replaceImportObject(args.pages.imports, CODE_NAMING.pages);

    content = content.replace("/*imports*/", args.imports.join("\n"));
    content = content.replace("/*exports*/", args.exports.join("\n"));
    content = content.replaceAll("/*{browserType}*/", args.routerType);

    if(args.appRouteComponents.app) content = content.replace("app: undefined,", `app: App,`);
    if(args.appRouteComponents.notFound) content = content.replace("notFound: undefined,", `notFound: NotFound,`);
    if(args.appRouteComponents.error) content = content.replace("error: undefined,", `error: DefaultErrorComponent,`);
    if(args.appRouteComponents.pending) content = content.replace("pending: undefined,", `pending: DefaultPendingComponent,`);

    return content;
}