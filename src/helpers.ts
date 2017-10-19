//todo: get from page
export const jsPageHeight = 100;

//todo: impl
export function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function random(min: number = 0, max: number = 1): number {
    //range random
    return min + Math.random() * (max - min);
}

export function limit(value: number, max: number, min: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}


export function arraySum(arr: number[]): number {
    return arr.reduce((sum, item) => sum + item, 0);
}


export function createArray(length: number, value = 0): number[] {
    return Array(length).fill(value);
}

export function createMatrix(rows: number, cols: number, value = 0): number[][] {
    return createArray(rows).map(() => createArray(cols, value));
}


export function nf(value: number, ...args) {
    return value;
}