import { z } from "zod";

export const configSchema = z.object({
    source: z.string().default("src/app"),
    sourceAlias: z.string().optional(),
    output: z.string().default("src/routes.ts"),
});

export const cliOptionsSchema = configSchema.extend({
    config: z.string().optional(),
    verbose: z.coerce.boolean().default(false),
    source: z.string().optional(),
    sourceAlias: z.string().optional(),
    output: z.string().optional(),
});

export type RouterCliConfig = z.TypeOf<typeof configSchema>;
export type RouterCliOptions = z.TypeOf<typeof cliOptionsSchema>;