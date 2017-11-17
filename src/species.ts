import { createArray, createMatrix, random } from './helpers';

const firstLayerNeuronsCount = 10;
const hiddenNeuronsCount = 11;
const outputCount = 2;
export const xxxLayerNeuronsCount = 13; //todo: unknown value?

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
			xxxLayerNeuronsCount, firstLayerNeuronsCount,
			() => isRandom ? random(-1, 1) : 0);
		this.layers[1] = createMatrix(
			hiddenNeuronsCount, outputCount,
			() => isRandom ? random(-1, 1) : 0);
	}

	calculateOutput(input: number[]): number[] {
		let hidden = createArray(hiddenNeuronsCount);
		let output = createArray(outputCount);

		hidden[hiddenNeuronsCount - 1] = 1; //bias

		function activationFn(value: number): number {
			return (2 / (1 + Math.exp(-2 * value))) - 1;
		}

		//todo: refac
		for (let i = 0; i < 10; i++)
			for (let j = 0; j < xxxLayerNeuronsCount; j++) {
				hidden[i] += input[j] * this.firstLayer[j][i];
				//activation function
				hidden[i] = activationFn(hidden[i]);
			}

		for (let i = 0; i < outputCount; i++)
			for (let j = 0; j < hiddenNeuronsCount; j++) {
				output[i] += hidden[j] * this.secondLayer[j][i];
				//activation function
				output[i] = activationFn(output[i]);
			}

		return output;
	}

	set_layer(layer: number, i: number, j: number, value: number) {
		//todo: refac
		if (layer === 1)
			this.firstLayer[i][j] = value;

		if (layer === 2)
			this.secondLayer[i][j] = value;
	}
}
