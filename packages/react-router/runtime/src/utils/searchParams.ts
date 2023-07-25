import queryString from "query-string";

const searchParamUtilities = {
    parse: (searchParams: URLSearchParams) => queryString.parse(searchParams.toString(), { decode: true, arrayFormat: 'bracket-separator', arrayFormatSeparator: ',', parseBooleans: true, parseNumbers: true }),
    stringify: (object: Record<string, any>) => queryString.stringify(object, { encode: true, arrayFormat: 'bracket-separator', arrayFormatSeparator: ',', skipNull: true })
} 

export default searchParamUtilities;   