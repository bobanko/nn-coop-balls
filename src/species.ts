import { random } from 'helpers';

const hiddenNeuronsCount = 11;
const outputCount = 2;

export class Species {

	first_layer: Array<Array<number>>;
	second_layer: Array<Array<number>>;

	constructor(isRandom:boolean) {//boolean

		//todo: layersizes to vars
		this.first_layer = [];/*new float[13][10]*/
		this.second_layer = [];/*new float[hiddenNeuronsCount][outputCount]*/

		if (isRandom) {
			for (let /*int*/ i = 0; i < 13; i++) {
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

	calculateOutput(/*float[] */input:number):number[]//float[]
	{
		let hidden = new Array(hiddenNeuronsCount).fill(0);
		let output = new Array(outputCount).fill(0);

		hidden[hiddenNeuronsCount-1] = 1; //bias


		for (let /*int*/ i = 0; i < 10; i++)
			for (let /*int*/ j = 0; j < 13; j++) {
				hidden[i] += input[j] * this.first_layer[j][i];
				//activation function
				hidden[i] = (2 / (1 + Math.exp(-2 * hidden[i]))) - 1;
			}

		for (let /*int*/ i = 0; i < 2; i++)
			for (let /*int*/ j = 0; j < 11; j++) {
				output[i] += hidden[j] * this.second_layer[j][i];
				//activation function
				output[i] = (2 / (1 + Math.exp(-2 * output[i]))) - 1;
			}

		return output;
	}


	//todo: remove these 2
	first_layer(): Array<Array<number>> {//float[][]
		return this.first_layer;
	}

	second_layer(): Array<Array<number>> {//float[][]
		return this.second_layer;
	}

	set_layer(/*int*/ layer: number, /*int*/ i: number, /*int*/ j: number, /*float*/ value: number) {
		if (layer === 1)
			this.first_layer[i][j] = value;
		if (layer === 2)
			this.second_layer[i][j] = value;
	}
}