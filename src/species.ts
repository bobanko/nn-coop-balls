import { createArray, createMatrix, random } from './helpers';

export const inputsCount = 13;
const firstLayerNeuronsCount = 10;
const hiddenNeuronsCount = 11;
const outputCount = 2;

export class Species {
	layers: number[][][];

	get firstLayer() {
		return this.layers[0];
	}

	get secondLayer() {
		return this.layers[1];
	}

	constructor(isRandom: boolean) {
		this.layers = [];

		this.layers[0] = createMatrix(
			inputsCount, firstLayerNeuronsCount,
			() => isRandom ? random(-1, 1) : 0);
		this.layers[1] = createMatrix(
			hiddenNeuronsCount, outputCount,
			() => isRandom ? random(-1, 1) : 0);
	}

	calculateOutput(input: number[]): number[] {
		let hidden = createArray(hiddenNeuronsCount);
		let output = createArray(outputCount);

		function activationFn(value: number): number {
			return (2 / (1 + Math.exp(-2 * value))) - 1;
		}

		//todo: refac
		for (let i = 0; i < hiddenNeuronsCount; i++) {
			for (let j = 0; j < inputsCount; j++) {
				hidden[i] = activationFn(hidden[i] + input[j] * this.firstLayer[j][i]);
			}
		}

		hidden[hiddenNeuronsCount - 1] = 1; //last is the bias (needed for each hidden layer)

		for (let i = 0; i < outputCount; i++) {
			for (let j = 0; j < hiddenNeuronsCount; j++) {
				output[i] = activationFn(output[i] + hidden[j] * this.secondLayer[j][i]);
			}
		}

		return output;
	}
}
