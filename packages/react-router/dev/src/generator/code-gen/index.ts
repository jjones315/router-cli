import { template } from "../template";

type PopulateTemplateArgs = {
    layouts: RouteData;
    pages: RouteData;
    appComponent: string | undefined;
    notFoundComponent: string | undefined;
    imports: string[];
};

export type RouteData = {
    routes: string[];
    imports: string[];
    // loaders: string[];
    // paramSchemas: string[];
    // searchParamSchemas: string[];
};

export const CODE_NAMING = {
    exportType: "export type",
    exportConst: "export const",
    never: "never",
    empty: "{}",
    pages: "pageImports",
    layouts: "layoutImports"
}

export function populateTemplate({ pages, layouts, imports, appComponent, notFoundComponent }: PopulateTemplateArgs) {
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

    replaceImportObject(layouts.imports, CODE_NAMING.layouts);
    replaceImportObject(pages.imports, CODE_NAMING.pages);

    content = content.replace("/*imports*/", imports.join("\n"));

    if(appComponent) content = content.replace("app: undefined,", `app: ${appComponent},`);
    if(notFoundComponent) content = content.replace("notFound: undefined,", `notFound: ${notFoundComponent},`);

    return content;
}