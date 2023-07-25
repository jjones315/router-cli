import { ParamSchema } from "../types";

export const parseSchema = <TReturn>(input: Record<string, unknown>, schema: ParamSchema<TReturn>): TReturn => {
    if ("parse" in schema && schema.parse instanceof Function) {
        return schema.parse(input);
    }

    if (schema instanceof Function) {
        return schema(input);
    }

    throw new Error("unknown schema type.")
}