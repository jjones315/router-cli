import path from 'path';
import fs from 'fs';
import { configSchema } from '../../schema';

const _defaultConfigSrc = 'router-cli.config.json';
const resolveConfig = (config?: string) => path.resolve(process.cwd(), config || _defaultConfigSrc);

export const getConfig = async (config?: string) => {
    const src = resolveConfig(config);
    const raw = fs.readFileSync(src, {encoding: "utf8"});
    return await configSchema.parseAsync(JSON.parse(raw));
}

export const doesConfigExist = async (config?: string) => {
    const src = resolveConfig(config);
    return fs.existsSync(src);
}