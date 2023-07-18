import * as yargs from 'yargs'
import { watch } from './watch'
import { generate } from './generator'

main

export function main() {
    yargs
        .scriptName('router-cli')
        .usage('$0 <cmd> [args]')
        .option('output', {
            alias: "o",
            describe: "File where the generated routes will be outputted.",
            default: "./src/routes.ts",
            type: "string",
        })
        .option('source', {
            alias: 's',
            describe: "Directory to scan.",
            default: "./src/app",
            type: "string",
        })
        .option('sourceAlias', {
            describe: "Alias for the scanned directory path. ex: \"@app\" would alias src/app as @app in the generated code.",
            default: "src/app",
            type: "string",
        })
        .option('verbose', {
            alias: "v",
            type: "boolean",
            default: false,
        })
        .command('generate', 'Generate the routes for a project',
            async (yargs) => {
                const args = await yargs.parse();
                try {
                    await generate(args)
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
                const args = await yargs.parse();
                watch(args)
            },
        )
        .help()
        .argv
}