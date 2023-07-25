import type { LoaderFunctionArgs } from 'react-router-dom';
import searchParamUtilities from "./searchParams";
import { ParamSchema } from '../types';
import { parseSchema } from './schemaParser';

type Params = LoaderFunctionArgs['params'];

type Options<Parser = SearchParamsParser> = {
    message?: string;
    status?: number;
    parser?: Parser;
};


export function parseParams<TShape, T extends ParamSchema<TShape> = ParamSchema<TShape>>(
    params: Params,
    schema: T,
    options?: Options
): TShape {
    try {
        return parseSchema(params, schema);
    } catch (error) {
        throw createErrorResponse(options);
    }
}

export function parseQuery<TShape, T extends ParamSchema<TShape> = ParamSchema<TShape>>(
    request: Request | URLSearchParams,
    schema: T,
    options?: Options
): TShape {
    try {
        const searchParams = isURLSearchParams(request)
            ? request
            : getSearchParamsFromRequest(request);
        const params = parseSearchParams(searchParams, options?.parser);
        return parseSchema(params, schema);
    } catch (error) {
        throw createErrorResponse(options);
    }
}

type ParsedSearchParamsTypes = string | number | boolean;

type ParsedSearchParams<T = ParsedSearchParamsTypes> = Record<string, T | null | Array<T | null>>

type SearchParamsParser<T = ParsedSearchParams> = (
    searchParams: URLSearchParams
) => T;

function isObjectEntry([, value]: [string, FormDataEntryValue]) {
    return value instanceof Object;
}

function parseFormData(formData: FormData, customParser?: SearchParamsParser) {
    const objectEntries = [...formData.entries()].filter(isObjectEntry);
    objectEntries.forEach(([key, value]) => {
        formData.set(key, JSON.stringify(value));
    });
    // Context on `as any` usage: https://github.com/microsoft/TypeScript/issues/30584
    return parseSearchParams(new URLSearchParams(formData as any), customParser);
}

function parseSearchParams(
    searchParams: URLSearchParams,
    customParser?: SearchParamsParser
): ParsedSearchParams {
    const parser = customParser || parseSearchParamsDefault;
    return parser(searchParams);
}

const parseSearchParamsDefault: SearchParamsParser = (searchParams) => {
    return searchParamUtilities.parse(searchParams);
};

function getSearchParamsFromRequest(request: Request): URLSearchParams {
    const url = new URL(request.url);
    return url.searchParams;
}

function isURLSearchParams(value: unknown): value is URLSearchParams {
    return getObjectTypeName(value) === 'URLSearchParams';
}

function getObjectTypeName(value: unknown): string {
    return toString.call(value).slice(8, -1);
}

function createErrorResponse(
    options: {
        message?: string;
        status?: number;
    } = {}
): Response {
    const statusText = options?.message || "Bad Request";
    const status = options?.status || 400;
    return new Response(statusText, { status, statusText });
}