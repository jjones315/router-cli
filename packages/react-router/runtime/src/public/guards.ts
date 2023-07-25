import { useRef } from 'react';

export const useGuards = (guard?: () => {}): boolean => {
    const hasRunRef = useRef(false);
    if (guard && hasRunRef.current === false) {
        hasRunRef.current = true;
        guard();
    }
    return true;
}

export const guardLoader = (guard: () => {}) => {
    guard();
    return null;
}