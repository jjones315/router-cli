export const getMapKeys = <T>(src: Map<T, any>): T[] => {
    const keys: T[] = [];
    for (const key of src.keys()) {
        keys.push(key);
    }
    return keys;
}

export const getMapValues = <T>(src: Map<any, T>): T[] => {
    const values: T[] = [];
    for (const key of src.values()) {
        values.push(key);
    }
    return values;
}