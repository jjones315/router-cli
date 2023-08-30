import { RouterCliConfig } from "../schema";
import * as fs from 'fs'
import glob from "fast-glob";
import * as loggingUtils from "../utils/logging";
import { AppRouteComponents, AppRoutes, RouteItem, RouteMap, RouteType, RouterType } from "./types";
import { trimCharEnd } from "./utils/strings";
import { transformRoute } from "./utils/code-scanning";
import { CODE_NAMING, RouteData, populateTemplate } from "./code-gen";
import { trimExt } from "./code-gen/utils";
import { exec } from 'child_process'
import path from "path";

export class Generator {
    private _currentOutput: string;
    private _config: RouterCliConfig;
    private _verbose: boolean;

    constructor(config: RouterCliConfig, verbose: boolean) {
        this._currentOutput = fs.existsSync(config.output) ? fs.readFileSync(config.output, 'utf-8') : "";
        this._verbose = verbose;
        this._config = config;
        this._config.source = trimCharEnd(this._config.source, "/");
        this._config.sourceAlias = this._config.sourceAlias ? trimCharEnd(this._config.source, "/") : undefined;
    }

    async generate() {
        const routes = await this.discoverRouteFiles();
        const codeOutput = this.generateCode(routes);
        await this.writeFile(codeOutput);
    }

    private generateCode(routes: { pages: RouteMap; layouts: RouteMap; appRoutes: AppRoutes; }) {
        const layouts: RouteData = {
            imports: [],
            routes: [],
        }

        const pages: RouteData = {
            imports: [],
            routes: [],
        }

        const imports: string[] = [];
        const exports: string[] = [];

        const appRouteComponents: AppRouteComponents = {
            app: false,
            notFound: false,
            error: false,
            pending: false,
        }

        for (const item of routes.pages.values()) {
            pages.imports.push(`"${item.typedRoute}": () => import("${item.importSource}").then(x => x.default)`);
            pages.routes.push(`"${item.typedRoute}": ExtractImportType<typeof ${CODE_NAMING.pages}["${item.typedRoute}"]>`);
        }

        for (const item of routes.layouts.values()) {
            layouts.imports.push(`"${item.typedRoute}": () => import("${item.importSource}").then(x => x.default)`);
            layouts.routes.push(`"${item.typedRoute}": ExtractImportType<typeof ${CODE_NAMING.layouts}["${item.typedRoute}"]>`);
        }

        if (routes.appRoutes.app) {
            imports.push(`import App from "${routes.appRoutes.app}";`);
            appRouteComponents.app = true;
        }

        if (routes.appRoutes.notFound) {
            imports.push(`import NotFound from "${routes.appRoutes.notFound}";`);
            appRouteComponents.notFound = true;
        }

        if (routes.appRoutes.error) {
            imports.push(`import DefaultErrorComponent from "${routes.appRoutes.error}";`);
            exports.push(`export { DefaultErrorComponent };`);
            appRouteComponents.error = true;
        }

        if (routes.appRoutes.pending) {
            imports.push(`import DefaultPendingComponent from "${routes.appRoutes.pending}";`);
            exports.push(`export { DefaultPendingComponent };`);
            appRouteComponents.pending = true;
        }

        let routerType: RouterType = "createBrowserRouter";

        if(this._config.type === "hash"){
            routerType = "createHashRouter";
        }
        if(this._config.type === "memory"){
            routerType = "createMemoryRouter";
        }

        return populateTemplate({
            layouts,
            pages,
            appRouteComponents,
            imports,
            exports,
            routerType
        });
    }

    private async discoverRouteFiles() {
        const pagesPromise = await glob([
            this._config.source + '/**/?($)[\\w-]*.page.tsx'
        ], { onlyFiles: true });

        const layoutsPromise = await glob([
            this._config.source + '/**/_layout.tsx',
        ], { onlyFiles: true });

        const reservedRoutesPromise = await glob([
            this._config.source + '/_app.tsx',
            this._config.source + '/_404.tsx',
            this._config.source + '/_error.tsx',
            this._config.source + '/_pending.tsx',
        ], { onlyFiles: true });

        const [pages, layouts, reservedRoutes] = await Promise.all([
            pagesPromise,
            layoutsPromise,
            reservedRoutesPromise
        ]);

        // Sort layouts by the number of segments, then alphabetically, helps ensure the output matches so we don't trigger additional writes if watching.
        pages.sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b));

        // Sort layouts by the number of segments.
        layouts.sort((a, b) => a.split("/").length - b.split("/").length);

        this.verboseLog(`discovered routes`, () => {
            console.log("Pages");
            pages.forEach(x => console.log(x));
            console.log("Layouts");
            layouts.forEach(x => console.log(x));
            console.log("Reserved");
            reservedRoutes.forEach(x => console.log(x));
        });

        const appRoutes: AppRoutes = {};

        if (reservedRoutes.length) {
            const app = reservedRoutes.find(x => x.endsWith("/_app.tsx"));
            if (app) {
                const relativeSource = this.getRelativeSource(app);
                appRoutes.app = this.getImportSource(relativeSource);
            }

            const notFound = reservedRoutes.find(x => x.endsWith("/_404.tsx"));
            if (notFound) {
                const relativeSource = this.getRelativeSource(notFound);
                appRoutes.notFound = this.getImportSource(relativeSource);
            }

            const error = reservedRoutes.find(x => x.endsWith("/_error.tsx"));
            if (error) {
                const relativeSource = this.getRelativeSource(error);
                appRoutes.error = this.getImportSource(relativeSource);
            }

            const pending = reservedRoutes.find(x => x.endsWith("/_pending.tsx"));
            if (pending) {
                const relativeSource = this.getRelativeSource(pending);
                appRoutes.pending = this.getImportSource(relativeSource);
            }
        }

        return {
            pages: new Map(pages.map(item => {
                const data = this.processRoute(item, "page");
                return [data.fullRoute, data]
            })) as RouteMap,
            layouts: new Map(layouts.map(item => {
                const data = this.processRoute(item, "layout");
                return [data.fullRoute, data]
            })) as RouteMap,
            appRoutes
        };
    }

    private processRoute(srcPath: string, type: RouteType): RouteItem {
        const relativeSource = this.getRelativeSource(srcPath);
        const importSource = this.getImportSource(relativeSource);
        const typedRoute = "/" + (transformRoute(relativeSource, this._config.hiddenDirectories) || "") + (type === "layout" ? "/layout" : "");
        const fullRoute = typedRoute.replace("/$", "/:").replace("/$catchAll", "/*");

        return {
            fullRoute,
            typedRoute,
            importSource,
        }
    }

    private getImportSource(relativeSrc: string) {
        const { sourceAlias, source } = this._config;
        return `${(sourceAlias || source)}/${trimExt(relativeSrc)}`;
    }

    private getRelativeSource(srcPath: string) {
        return srcPath.slice(this._config.source.length + 1, srcPath.length);
    }

    private writeFile(output: string) {
        if (this._currentOutput !== output && output) {
            console.log("Writing Routes File.");
            fs.writeFileSync(this._config.output, output);

            if (this._config.formatter) {
                if (this._config.formatter === "prettier") {
                    const prettier = path.resolve('./node_modules/.bin/prettier');
                    if (fs.existsSync(prettier)) {
                        exec(`${prettier} --write --cache ${this._config.output}`)
                    }
                }
                if (this._config.formatter === "eslint") {
                    const eslint = path.resolve('./node_modules/.bin/eslint');
                    if (fs.existsSync(eslint)) {
                        exec(`${eslint} --format ${this._config.output}`)
                    }
                }
            }

            this._currentOutput = output;
        }
    }

    private verboseLog = (section: string, log?: () => void) => {
        if (this._verbose) {
            loggingUtils.verboseLog(section, log);
        }
    }
}