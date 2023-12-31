import * as chokidar from 'chokidar'
import { generate } from './generator'
import { verboseLog } from './utils'
import { RouterCliConfig } from './definitions/schema'

export async function watch(config: RouterCliConfig, verbose: boolean) {
  let watcher = new chokidar.FSWatcher()

  const generatorWatcher = async () => {
    watcher.close()
    console.log(`router-cli: Watching routes (${config.source})...`)

    const log = (type: string, path: string) => {
      if (verbose) verboseLog(`"${path}" ${type}. regenerating...`);
    }

    watcher = chokidar.watch(config.source)

    watcher.on('ready', async () => {
      try {
        await generate(config, verbose)
      } catch (err) {
        console.error(err)
      }

      const handle = async () => {
        try {
          await generate(config, verbose)
        } catch (err) {
          console.error(err)
        }
      }

      watcher.on('change', (path) => {
        log("updated", path);
        handle();
      });
      watcher.on('add', (path) => {
        log("created", path);
        handle();
      });
      watcher.on('addDir', (path) => {
        log("created", path);
        handle();
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