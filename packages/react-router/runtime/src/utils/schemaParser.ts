import { ParamSchema } from "../types";
import { createBadRequestResponse } from "./errors";

export const parseSchema = <TReturn>(input: Record<string, unknown>, schema: ParamSchema<TReturn>): TReturn => {
    try {
        if ("parse" in schema && schema.parse instanceof Function) {
            return schema.parse(input);
        }

        if (schema instanceof Function) {
            return schema(input);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw createBadRequestResponse({ error });
        }
        throw createBadRequestResponse();
    }
    throw new Error("unknown schema type.")
}