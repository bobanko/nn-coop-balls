import {random } from 'helpers';

export class species{
    constructor(isRandom){//boolean

        //todo: layersizes to vars
        this.first_layer = new float[13][10];
        this.second_layer = new float[11][2];

        if(isRandom)
        {
            for(let /*int*/ i=0; i<13; i++)
                for(let /*int*/ j=0; j<10; j++)
                    this.first_layer[i][j]=random(-1,1);

            for(let /*int*/ i=0; i<11; i++)
                for(let /*int*/ j=0; j<2; j++)
                    this.second_layer[i][j]=random(-1,1);
        }
    }

    calculateOutput(/*float[] */input)//float[]
    {
        let hidden = new float[11];
        let output = new float[2];

        for(let /*int*/ i=0; i<10; i++)
            hidden[i]=0;
        hidden[10]=1; //bias

        for(let /*int*/ i=0; i<2; i++)
            output[i]=0;

        for(let /*int*/ i=0; i<10; i++)
        for(let /*int*/ j=0; j<13; j++)
        {
            hidden[i] += input[j]*this.first_layer[j][i];
            //activation function
            hidden[i] = (2/(1+exp(-2*hidden[i])))-1;
        }

        for(let /*int*/ i=0; i<2; i++)
        for(let /*int*/ j=0; j<11; j++)
        {
            output[i] += hidden[j]*this.second_layer[j][i];
            //activation function
            output[i] = (2/(1+exp(-2*output[i])))-1;
        }

        return output;
    }


    //todo: remove these 2
     first_layer(){//float[][]
        return this.first_layer;
    }

     second_layer(){//float[][]
        return this.second_layer;
    }

    set_layer(/*int*/ layer, /*int*/ i, /*int*/ j, /*float*/ value)
    {
        if(layer === 1)
            this.first_layer[i][j] = value;
        if(layer === 2)
            this.second_layer[i][j] = value;
    }
}