import { RouteOptions, MergeTypeFromParent, RouteComponent } from "../types";
import { parseSchema } from "../utils/schemaParser";
import { SetAction, useTypedParams, useTypedSearch } from "./hooks";

// export function route< 
//     TParams extends {} = {},
//     TSearchParams extends {} = {},
//     TLoader = unknown,
// >(options: Omit<RouteOptions<TParams, TSearchParams, TLoader>, "__types">): RouteComponent<TParams, TSearchParams, TLoader> {
//     const result: any = options.Content;
    // result.Error = options.Error;
    // result.Pending = options.Pending;
    // result.paramsSchema = options.paramsSchema;
    // result.searchSchema = options.searchSchema;
    // result.loader = options.loader;
    // result.guard = options.guard;
    // result.useParams = () => {
    //     return useTypedParams(options.paramsSchema!) as any;
    // };
    // result.useSearch = () => {
    //     return useTypedSearch<TSearchParams>(options.searchSchema!) as any;
    // };
    // result.childRoute = <
    //     TChildParams extends {} = {},
    //     TChildSearchParams extends {} = {},
    //     TChildLoader = unknown
    // >(childOptions: Omit<RouteOptions<TChildParams, TChildSearchParams, TChildLoader, TParams, TSearchParams>, "__types" | "parent">): Route<MergeTypeFromParent<TChildParams, TParams>, MergeTypeFromParent<TChildSearchParams, TSearchParams>, TChildLoader> => {
    //     type types = Omit<RouteOptions<TChildParams, TChildSearchParams, TChildLoader, TParams, TSearchParams>, "parent">["__types"];
    //     return route<
    //         types["mergedParams"],
    //         types["mergedSearchParams"],
    //         types["loader"]
    //     >({
    //         Content: childOptions.Content as any,
    //         loader: childOptions.loader as any,
    //         Error: childOptions.Error,
    //         Pending: childOptions.Pending,
    //         guard: childOptions.guard,
    //         paramsSchema(src) {
    //             return {
    //                 ...(options.paramsSchema ? parseSchema(src, options.paramsSchema) : {}),
    //                 ...(childOptions.paramsSchema ? parseSchema(src, childOptions.paramsSchema) : {}),
    //             } as any;
    //         },
    //         searchSchema(src) {
    //             return {
    //                 ...(options.searchSchema ? parseSchema(src, options.searchSchema) : {}),
    //                 ...(childOptions.searchSchema ? parseSchema(src, childOptions.searchSchema) : {}),
    //             } as any;
    //         },
    //     });
    // }

//     return result;
// }


export function Route<TParams extends {} = {}, TSearchParams extends {} = {}, TLoader = unknown>(
    options: Omit<RouteOptions<TParams, TSearchParams, TLoader>, "__types">,
): RouteComponent<TParams, TSearchParams, TLoader> {
    const result: any = options.Content;
    result.Error = options.Error;
    result.Pending = options.Pending;
    result.paramsSchema = options.paramsSchema;
    result.searchSchema = options.searchSchema;
    result.loader = options.loader;
    result.guard = options.guard;

    return result;
}