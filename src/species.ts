import { createArray, createMatrix, random } from './helpers';

const hiddenNeuronsCount = 11;
const outputCount = 2;
export const xxxLayerCount = 13; //todo: unknown

export class Species {

	//todo: refac make sizable?
	first_layer: number[][];
	second_layer: number[][];

	constructor(isRandom: boolean) {

		//todo: layer sizes to vars
		this.first_layer = createMatrix(xxxLayerCount, 10);
		this.second_layer = createMatrix(hiddenNeuronsCount, outputCount);

		if (isRandom) {
			for (let i = 0; i < xxxLayerCount; i++) {
				this.first_layer[i] = [];
				for (let /*int*/ j = 0; j < 10; j++) {
					this.first_layer[i][j] = random(-1, 1);
				}
			}

			for (let /*int*/ i = 0; i < hiddenNeuronsCount; i++) {
				this.second_layer[i] = [];
				for (let /*int*/ j = 0; j < outputCount; j++) {
					this.second_layer[i][j] = random(-1, 1);
				}
			}
		}
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
			for (let j = 0; j < xxxLayerCount; j++) {
				hidden[i] += input[j] * this.first_layer[j][i];
				//activation function
				hidden[i] = activationFn(hidden[i]);
			}

		for (let i = 0; i < outputCount; i++)
			for (let j = 0; j < hiddenNeuronsCount; j++) {
				output[i] += hidden[j] * this.second_layer[j][i];
				//activation function
				output[i] = activationFn(output[i]);
			}

		return output;
	}

	set_layer(layer: number, i: number, j: number, value: number) {
		//todo: refac
		if (layer === 1)
			this.first_layer[i][j] = value;

		if (layer === 2)
			this.second_layer[i][j] = value;
	}
}
