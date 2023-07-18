import * as chokidar from 'chokidar'
import { generate } from './generator'
import { RouterCliOptions } from './types'

export async function watch(config: RouterCliOptions) {
  let watcher = new chokidar.FSWatcher()

  const generatorWatcher = async () => {
    watcher.close()

    console.log(`router-cli: Watching routes (${config.source})...`)
    watcher = chokidar.watch(config.source)

    watcher.on('ready', async () => {
      try {
        await generate(config)
      } catch (err) {
        console.error(err)
        console.log()
      }

      const handle = async () => {
        try {
          await generate(config)
        } catch (err) {
          console.error(err)
          console.log()
        }
      }

      watcher.on('change', handle)
      watcher.on('add', handle)
      watcher.on('addDir', handle)
      watcher.on('unlink', handle)
      watcher.on('unlinkDir', handle)
    })
  }

  generatorWatcher();
}