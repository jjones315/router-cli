
import * as yargs from 'yargs'
import { watch } from './watch'
import { doesConfigExist as configExist, getConfig } from './utils/config';
import { RouterCliOptions, RouterCliConfig, configSchema, cliOptionsSchema } from '../schema';
import { Generator } from '../generator';
import { verboseLog } from '../utils/logging';


const hasConfig = (options: RouterCliOptions) => typeof options.config === "string";
const hasCliOptions = (options: RouterCliOptions) => typeof options.output === "string"
    || typeof options.source === "string"
    || typeof options.sourceAlias === "string";

const createConfigFromOption = async (options: RouterCliOptions): Promise<RouterCliConfig> => {
    if (hasConfig(options)) {
        if (!await configExist(options.config)) {
            throw new Error(`config "${options.config}" not found.`)
        }
        return getConfig(options.config)
    }
    else if (!hasCliOptions(options) && await configExist(options.config)) {
        return getConfig(options.config)
    }
    return configSchema.parseAsync(options);
}

const getConfigFromOption = async (options: RouterCliOptions): Promise<RouterCliConfig> => {
    const config = await createConfigFromOption(options);
    if (options.verbose) {
        verboseLog(`route-cli - running with options`, () => {
            console.log(JSON.stringify(config, null, 4));
        });
    }
    return config;
}

export const main = () => {
    yargs
        .scriptName('router-cli')
        .usage('$0 <cmd> [args]')
        .option('output', {
            alias: "o",
            describe: "File where the generated routes will be outputted.",
            type: "string",
        })
        .option('source', {
            alias: 's',
            describe: "Directory to scan.",
            type: "string",
        })
        .option('sourceAlias', {
            alias: 'a',
            describe: "Alias for the scanned directory path. ex: \"@app\" would alias src/app as @app in the generated code.",
            type: "string",
        })
        .option('hiddenDirectories', {
            alias: 'h',
            describe: "Directories to ignore. ie [pages] would changes the source \"/users/pages/create.page.tsx\" in to the public route \"/users/create\"",
            type: "array",
        })
        .option('formatter', {
            alias: 'f',
            describe: "format the outputted routes file. defaults to none.",
            type: "string",
            choices: ["eslint", "prettier", undefined],
            default: undefined
        })
        .option('type', {
            alias: 't',
            describe: "type of router to create. defaults to browser.",
            type: "string",
            choices: ["browser", "memory", "hash"],
            default: "browser"
        })
        .option('verbose', {
            alias: "v",
            type: "boolean",
        })
        .command('generate', 'Generate the routes for a project',
            async (yargs) => {
                const rawArgs = await yargs.parse();
                const args = await cliOptionsSchema.parseAsync(rawArgs);
                const config = await getConfigFromOption(args);
                try {
                    const generator = new Generator(config, args.verbose);
                    await generator.generate();
                    process.exit(0)
                } catch (err) {
                    console.error(err)
                    process.exit(1)
                }
            })
        .command(
            'watch',
            'Continuously watch and generate the routes for a project',
            async (yargs) => {
                const rawArgs = await yargs.parse();
                const args = await cliOptionsSchema.parse(rawArgs);
                const config = await getConfigFromOption(args);
                watch(config, args.verbose)
            },
        )
        .help()
        .argv
}

main();