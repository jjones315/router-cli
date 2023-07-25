
import { Plugin } from 'vite'
import { RouterCliConfig } from './schema'
import { Generator } from './generator'

export default function RouteGenerator(config: RouterCliConfig, verbose: boolean = false): Plugin {
    const generator = new Generator(config, verbose);
    return {
        name: 'router-cli',
        enforce: 'pre',
        configureServer(server) {
            const listener = (path: string) => {
                if (
                    path.includes(config.source)
                    && (
                        path.endsWith('.page.tsx')
                        || path.endsWith('_layout.tsx')
                    )) {
                    generator.generate();
                }
            }
            server.watcher.on('add', listener)
            server.watcher.on('change', listener)
            server.watcher.on('unlink', listener)
        },
        buildStart() {
            generator.generate();
        },
    }
}