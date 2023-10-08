class NeuralNetwork {
    constructor(neuronCounts){
        //neural network consists of an array of level
        this.levels = []
        for(let i = 0; i<neuronCounts.length-1; i++){
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }

    }

    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]
        );
        //connect outputs with previous ones
        for (let i = 1; i<network.levels.length;i++){
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }
        return outputs;
    }


    //mutate a already existing network within a specific range (amount, 1 = 100% = completly random)
    //use: create networka that are similar to an existing one, to continue improving this network
    static mutate(network, amount=1){
        network.levels.forEach( level => {
            for(let i = 0; i< level.biases.length; i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            
            for(let i = 0; i< level.weights.length;i++){
                for(let j = 0; j<level.weights[i].length; j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}



class Level {

    //input & output neurons
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        //biases = level on which the output neurons fire
        this.biases = new Array(outputCount);

        //every input neuron is connected with every output neuron

        this.weights = []
        for (let i = 0; i<inputCount;i++){
            this.weights[i] = new Array(outputCount);
        }

        //randomize weights for initial start (weigth of the connection between the neurons)
        //Level in front is needed because it's a static method
        Level.#randomize(this)



    }


    static #randomize(level){

        //set weights
        for(let i = 0; i<level.inputs.length;i++){
            for (let j = 0; j<level.outputs.length;j++){
                //set weights randomly between -1 and 1
                level.weights[i][j] = Math.random()*2-1;
            }
        }

        //set biases
        for (let i = 0; i< level.biases.length;i++){
            level.biases[i] = Math.random()*2-1;
        }

    }

    //calculate output values
    //givenInputs = values from the sensor
    static feedForward(givenInputs,level){
        //set inputs from the sensor to the level inputs
        for(let i = 0;i<level.inputs.length;i++){
            level.inputs[i] = givenInputs[i];
        }


        //calculate the output by sum the input with the weighting of the input
        for (let i = 0; i<level.outputs.length; i++){
            let sum = 0;
            for (let j = 0; j<level.inputs.length; j++){
                sum += level.inputs[j]*level.weights[j][i];
            }

            //check if sum is higher than firing bias and set output neuron to fire or not
            if (sum > level.biases[i]){
                level.outputs[i] = 1;
            }else {
                level.outputs[i] = 0;
            }

        }
        return level.outputs
    }

}