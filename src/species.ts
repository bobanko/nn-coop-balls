import {random} from './helpers';

const hiddenNeuronsCount = 11;
const outputCount = 2;

export class Species {

    //todo: refac make sizable?
    first_layer: number[][];
    second_layer: number[][];

    constructor(isRandom: boolean) {//boolean

        //todo: layer sizes to vars
        this.first_layer = [];
        /*new float[13][10]*/
        this.second_layer = [];
        /*new float[hiddenNeuronsCount][outputCount]*/

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

    calculateOutput(input: number[]): number[] {
        let hidden = new Array(hiddenNeuronsCount).fill(0);
        let output = new Array(outputCount).fill(0);

        hidden[hiddenNeuronsCount - 1] = 1; //bias

        function activationFn(value: number): number {
            return (2 / (1 + Math.exp(-2 * value))) - 1;
        }

        //todo: refac
        for (let i = 0; i < 10; i++)
            for (let j = 0; j < 13; j++) {
                hidden[i] += input[j] * this.first_layer[j][i];
                //activation function
                hidden[i] = activationFn(hidden[i]);
            }

        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 11; j++) {
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