export const getIndent = (depth: number, spacesInTab: number = 4) => {
    return " ".repeat(depth * spacesInTab);
}

export const getFallbackParams = (path: string) => {
    const param = path.split('/').filter((segment) => segment.startsWith(':'))
    if (param.length > 0) {
        return `{ ${param.map((p) => p.replace(/\$(.+)(\?)?/, '$1$2:') + ' string').join('; ')} }`;
    }
    return null;
}

export const trimExt = (src: string) => {
    return src.split('.').slice(0, -1).join('.');
}