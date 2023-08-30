import { z } from "zod";



const configSchemaBase = z.object({
    sourceAlias: z.string().optional(),
    hiddenDirectories: z.array(z.string()).default([]),
    formatter: z.union([
        z.literal("prettier"),
        z.literal("eslint")
    ]).optional(),
    type: z.union([
        z.literal("browser"),
        z.literal("memory"),
        z.literal("hash")
    ]).optional(),
});

export const configSchema = configSchemaBase.extend({
    source: z.string().default("src/app"),
    output: z.string().default("src/routes.ts"),
});

export const cliOptionsSchema = configSchemaBase.extend({
    config: z.string().optional(),
    verbose: z.coerce.boolean().default(false),
    source: z.string().optional(),
    output: z.string().optional(),
});

export type RouterCliConfig = z.TypeOf<typeof configSchema>;
export type RouterCliOptions = z.TypeOf<typeof cliOptionsSchema>;