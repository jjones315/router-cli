import clc from "cli-color";

export const getSeparator = (size: number) => {
    return "_".repeat(size);
}

export const verboseLog = (section: string, log?: () => void) => {
    const title = `router-cli - ${section}`;
    const separatorSize = process.stdout.columns;
    if (log) {
        console.log(clc.green(title + getSeparator(separatorSize - title.length)));
        log();
    }
    else{
        console.log(clc.green(title));
    }
}