import * as chokidar from 'chokidar'
import { RouterCliConfig } from '../schema'
import { Generator } from '../generator'
import { verboseLog } from '../utils/logging';

export async function watch(config: RouterCliConfig, verbose: boolean) {
  let watcher = new chokidar.FSWatcher()

  const generator = new Generator(config, verbose);

  const generatorWatcher = async () => {
    watcher.close()
    console.log(`router-cli: Watching routes (${config.source})...`)

    const log = (type: string, path: string) => {
      if (verbose) verboseLog(`"${path}" ${type}. regenerating...`);
    }

    watcher = chokidar.watch(config.source)

    watcher.on('ready', async () => {
      const handle = async () => {
        try {
          await generator.generate();
        } catch (err) {
          console.error(err)
        }
      }

      const checkPath = (path: string) => (path.endsWith('.page.tsx') || path.endsWith('_layout.tsx'));

      handle();

      watcher.on('add', (path) => {
        if (checkPath(path)) {
          log("created", path);
          handle();
        }
      });
      watcher.on('unlink', (path) => {
        log("removed", path);
        handle();
      });
      watcher.on('unlinkDir', (path) => {
        log("removed", path);
        handle();
      });
    })
  }

  generatorWatcher();
}
