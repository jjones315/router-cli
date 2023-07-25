export const trimCharEnd = (src: string, char: string) => {
    while (src.endsWith(char)) {
        src = src.slice(0, src.length - char.length);
    }
    return src;
}

export const trimCharStart = (src: string, char: string) => {
    while (src.startsWith(char)) {
        src = src.slice(char.length);
    }
    return src;
}

export const trimChar = (src: string, char: string) => {
    return trimCharEnd(trimCharStart(src, char), char);
}
