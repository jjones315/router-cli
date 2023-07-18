import * as yargs from 'yargs'
import { watch } from './watch'
import { generate } from './generator'
import { doesConfigExist as configExist, getConfig } from './utils/config';
import { verboseLog } from './utils';
import { RouterCliOptions, RouterCliConfig, configSchema, cliOptionsSchema } from './definitions/schema';


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
        verboseLog(`running with options`, () => {
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
                    await generate(config, args.verbose)
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