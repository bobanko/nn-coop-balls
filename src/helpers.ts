//todo: get from page
export const jsPageHeight = 750;//todo: remove!
export const boxBounds = {start: 300, end: 800};


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

export function createArray(length: number, valueFn = () => 0): number[] {
	return Array(length).fill(null).map(valueFn);
}

export function createMatrix(rows: number, cols: number, valueFn = () => 0): number[][] {
	return createArray(rows).map(() => createArray(cols, valueFn));
}
