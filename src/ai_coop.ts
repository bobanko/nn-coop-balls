//import org.gicentre.utils.stat.*; //todo: charts here


import {jsPageHeight, random, distance, limit, arraySum, createMatrix, createArray, nf} from './helpers';

import {Defender} from './defender';
import {Enemy} from './enemy';
import {Species} from './species';
import {XYChart} from './xyChart';

import './styles.less';


//Global
let mutation_rate = 0.005;
let num_species = 25;
let max_acc_variation = 0.01;
let num_defenders = 6;
let num_lives = 3;
let stop = false;

let team: Defender[] = [];
let mafia: Enemy[] = [];
let speciesADN: Species[] = [];
let generation = 1;
let last_spawn = 1;
let frame = 1.00;
let lives = num_lives;
let species = 0;
let score = 0;
let scores: number[] = createArray(num_species);
let top_score = 0;
let top_score_gen = 0;
let last_gen_avg = 0;
let top_gen_avg = 0;
let leaderboard: number[][] = createMatrix(3, 10);
let lineChart: XYChart;
let medianChart: XYChart;
let generation_array: number[] = [];
let history_avg: number[] = [];
let history_top: number[] = [];
let history_med: number[] = [];
let /*Table*/ table;

let evolution_end = false;

let time = performance.now();


const gbSize = {width: 1080, height: 720};
const gb: HTMLCanvasElement = document.querySelector('#gameboard') as HTMLCanvasElement;
const ctx = gb.getContext('2d');

function stub(...args) {
    console.warn('not impl.', args);
}

let fill = stub;
let textSize = stub;


function background(color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, gbSize.width, gbSize.height);
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function ellipse(x1, y1, radius, color) {
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function text (value, x, y) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(value, x, y);
}


function setupCharts() {
    lineChart = new XYChart(this);
    // Axis formatting and labels.
    lineChart.showXAxis(true);
    lineChart.showYAxis(true);
    // Symbol colours
    lineChart.setPointSize(2);
    lineChart.setLineWidth(2);
    lineChart.setMinY(0);
    lineChart.setXAxisLabel("Generation");
    lineChart.setYFormat("###");
    lineChart.setXFormat("###");

    medianChart = new XYChart(this);
    // Axis formatting and labels.
    medianChart.showXAxis(true);
    medianChart.showYAxis(true);
    // Symbol colours
    medianChart.setPointSize(2);
    medianChart.setLineWidth(2);
    medianChart.setMinY(0);
    medianChart.setYFormat("###");
    medianChart.setXFormat("###");
    medianChart.setXAxisLabel("Generation");
    medianChart.setLineColour('#D5A021');
    medianChart.setPointColour('#D5A021');
}


function setup(): void {
    gb.width = gbSize.width;
    gb.height = gbSize.height;


    setupCharts();

    console.log("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");


    for (let i = 0; i < num_defenders; i++)
        team.push(new Defender(i + 1, num_defenders));

    for (let i = 0; i < num_species; i++)
        speciesADN.push(new Species(true));

    for (let i = 0; i < 10; i++) {
        leaderboard[0][i] = 0;
        leaderboard[1][i] = 0;
        leaderboard[2][i] = 0;
    }
}


setup();
draw();
const SEC = 1000;
let FPS = 10;
//todo: gameloop?
setInterval(() => draw(), SEC / FPS);

function draw(): void {

    background('#dddfd4');

    graphics();

    update_defenders();
    update_mafia();
    if (!evolution_end)
        mafia_spawn();


    if (score >= leaderboard[0][9]) {
        let new_entry = true;
        for (let i = 0; i < 10; i++) {
            if (leaderboard[1][i] == generation && leaderboard[2][i] == species) {
                new_entry = false;
                leaderboard[0][i] = score;
            }
        }
        if (new_entry) {
            leaderboard[0][9] = score;
            leaderboard[1][9] = generation;
            leaderboard[2][9] = species;
        }
        leaderboard = sortLeaderboard(leaderboard);
    }

    if (lives == 0) //end of species
    {
        lives = num_lives;
        scores[species] = score;
        top_score = Math.max(top_score, score);
        console.log(scores[species]);
        species++;
        score = 0;
        frame = 0;
        last_spawn = 0;
        reset_defenders();
        if (species == num_species) //end of generation
        {
            //score order
            let ordered_scores: number[] = createArray(num_species);
            let ordered_speciesADN: Species[] = [];
            /*new Array < Species > ()*/

            for (let i = 0; i < num_species; i++) {
                let top_score = Math.max(...scores);
                let index = 0;
                while (scores[index] != top_score)
                    index++;
                ordered_scores[i] = scores[index];
                scores[index] = -1;
                ordered_speciesADN.push(speciesADN[index]);
            }
            scores = ordered_scores;
            top_score_gen = scores[0];
            speciesADN = ordered_speciesADN;
            //new species
            let new_speciesADN: Species[] = [];
            new_speciesADN.push(speciesADN[0]);
            for (let i = 1; i < num_species; i++) {
                new_speciesADN.push(newSpecies(speciesADN, scores));
            }
            speciesADN = new_speciesADN;
            let median = scores[num_species / 2];
            //reset scores
            let total_score = 0;
            for (let i = 0; i < num_species; i++) {
                total_score += scores[i];
                scores[i] = 0;
            }
            last_gen_avg = total_score / num_species;
            top_gen_avg = Math.max(top_gen_avg, last_gen_avg);
            history_avg.push(top_gen_avg);
            //history_top = append(history_top,top_score); //top all time graph
            history_top.push(top_score_gen); //top each generation graph
            history_med.push(median);
            generation_array.push(generation);


            if (generation > 7 && stop) {
                //check if end of evolution
                //if last 7 median average is greater than last median
                let sum = 0;
                for (let i = 0; i < 7; i++) {
                    sum = sum + history_med[generation - 1 - i];
                }

                let average = sum / 7;
                if (average >= history_med[generation - 1]) {
                    evolution_end = true;
                    console.log("Num of Species: " + num_species + " with mutation rate of " + mutation_rate + " got a score of " + (top_score - generation + Math.max(...history_med)));
                }
            }


            lineChart.setMaxY(top_score);
            medianChart.setMaxY(top_score);
            lineChart.setData(generation_array, history_top);
            medianChart.setData(generation_array, history_med);

            console.log(generation + "\t|\t" + last_gen_avg + "\t|\t" + median + "\t|\t" + top_score);
            generation++;
            species = 0;

        }
    }

    frame++;
    if (frame > 300)
        last_spawn++;

}

//end of draw**************************************************************************************


function reset_defenders(): void {
    for (let i = team.length - 1; i >= 0; i--)
        team.splice(i, 1);

    for (let i = 0; i < num_defenders; i++)
        team.push(new Defender(i + 1, num_defenders));

    for (let i = mafia.length - 1; i >= 0; i--)
        mafia.splice(i, 1);
}

function graphics(): void {
    //Static Graphics
    line(300, 0, 300, jsPageHeight);
    line(800, 0, 800, jsPageHeight);
    fill('#173e43');
    textSize(20);
    text("Generation " + generation, 810, 30);
    text("Species: " + (species + 1) + "/" + num_species, 810, 55);
    text("Top Score: " + top_score, 810, 80);
    textSize(22);
    text("Generation Info", 810, 115);
    text("Species Info", 810, 210);
    text("Leaderboards", 810, 285);
    textSize(18);
    text(`Average:       ${ arraySum(scores) / species }`, 810, 135); //change to 1
    text(`Last Average:  ${ last_gen_avg}`, 810, 155);
    text(`Best Average:  ${top_gen_avg}`, 810, 175);
    text(`Current Score: ${score}`, 810, 230);
    text(`Lives:         ${lives}`, 810, 250);

    for (let i = 0; i < 10; i++) {
        fill('#173e43', 255 - ((generation - leaderboard[1][i]) * 7));
        if (leaderboard[1][i] == generation) {
            if (leaderboard[2][i] == species)
                fill('#D5A021');
            else
                fill('#3fb0ac');
        }
        text((i + 1) + ". Generation " + leaderboard[1][i] + ": " + leaderboard[0][i], 810, 310 + i * 21);
    }
    textSize(12);
    lineChart.draw(810, 535, 270, 175);
    medianChart.draw(810, 535, 270, 175);
}

function mafia_spawn(): void {
    //mafia spawn
    if (random(1) < (last_spawn * 0.0001)) {
        let radius = (Math.exp(-frame / 20000) * 40);
        let vel = 2;
        if (frame > 10000)
            vel += frame / 10000;
        console.log(`Spawn: Radius: ${radius} Vel:${vel}   (Frame:${frame})`);
        mafia.push(new Enemy(radius, vel));
        last_spawn = 0;
    }
}

function update_mafia(): void {

    for (let i = mafia.length - 1; i >= 0; i--) {
        mafia[i].updatePos();
        if (mafia[i].intersect(team)) {
            mafia.splice(i, 1);
            score++;
        }
        else {
            let pos = mafia[i].getX();
            if (pos >= 800 - mafia[i].getRadius()) {
                mafia.splice(i, 1);
                lives--;
            }
            else if (graphics)
                ellipse(mafia[i].getX(), mafia[i].getY(), mafia[i].getRadius(), '#fae596');
        }
    }
}

function update_defenders(): void {
    //update defenders
    for (let i = 0; i < team.length; i++) {
        if (graphics) {
            ellipse(team[i].getX(), team[i].getY(), team[i].getRadius(), '#3fb0ac');
        }
        //calcule inputs
        let dist: number[] = createArray(team.length);
        for (let j = 0; j < team.length; j++) {
            if (j != i) {
                dist[j] = distance(team[i].getX(), team[i].getY(), team[j].getX(), team[j].getY());
            }
            else
                dist[j] = 99999;
        }
        let closest = Math.min(...dist);
        console.log("1st: " + closest);
        let index1: number = 0;
        let index2: number = 0;
        while (closest != dist[index1])
            index1++;
        dist[index1] = 99999;
        closest = Math.min(...dist);
        console.log("2nd: " + closest);
        while (closest != dist[index2])
            index2++;

        let input: number[] = createArray(13);
        input[0] = (team[i].getX() - 600) / 200.00; //pos x
        input[1] = (team[i].getY()) / (jsPageHeight / 2.00);//pos y
        input[2] = team[i].getVelX() / 2.00;//vel x
        input[3] = (team[i].getVelY() / 2.00);//vel y
        input[4] = ((team[index1].getX() - 600) / 200.00) - input[0];
        input[5] = ((team[index1].getY() / (jsPageHeight / 2.00))) - input[1];
        input[6] = (team[index1].getVelX() / 2.00) - input[2];
        input[7] = (team[index1].getVelY() / 2.00) - input[3];
        input[8] = ((team[index2].getX() - 600) / 200.00) - input[0];
        input[9] = ((team[index2].getY() / (jsPageHeight / 2.00))) - input[1];
        input[10] = (team[index2].getVelX() / 2.00) - input[2];
        input[11] = (team[index2].getVelY() / 2.00) - input[3];
        input[12] = 1; //bias

        console.log(`input: X:${input[0]} Y:${input[1]} VelX:${input[2]} VelY:${input[3]}`);

        let output: number[] = speciesADN[species].calculateOutput(input);
        team[i].change_acc(output[0] * max_acc_variation, output[1] * max_acc_variation);
        console.log(`X: ${team[0].getX()} Y: ${team[0].getY()}`);
    }
}

function newSpecies(ancestor: Species[], scores: number[]): Species {
    let baby = new Species(false);
    let total_score = 0;
    let float_scores: number[] = createArray(num_species);
    //normalize
    for (let i = 0; i < num_species; i++) {
        total_score += scores[i] ** 2;
    }

    for (let i = 0; i < num_species; i++) {
        float_scores[i] = (scores[i] ** 2) / total_score;
    }

    //calculate genes
    for (let i = 0; i < 13; i++)
        for (let j = 0; j < 10; j++) {
            let r = random(0, 1);
            let index = 0;
            while (r >= 0) {
                r = r - float_scores[index];
                index++;
            }
            index--;
            let layer: number[][] = ancestor[index].first_layer;
            baby.set_layer(1, i, j, layer[i][j]);
        }

    for (let i = 0; i < 11; i++)
        for (let j = 0; j < 2; j++) {
            let r = random(0, 1);
            let index = 0;
            while (r >= 0) {
                r = r - float_scores[index];
                index++;
            }
            index--;
            let layer: number[][] = ancestor[index].second_layer;
            baby.set_layer(2, i, j, layer[i][j]);
        }

    //calculate mutations
    for (let i = 0; i < 13; i++)
        for (let j = 0; j < 10; j++) {
            let r = random(0, 1);
            if (r < mutation_rate)
                baby.set_layer(1, i, j, random(-1, 1));
        }

    for (let i = 0; i < 11; i++)
        for (let j = 0; j < 2; j++) {
            let r = random(0, 1);
            if (r < mutation_rate)
                baby.set_layer(2, i, j, random(-1, 1));
        }

    return baby;
}


function sortLeaderboard(old: number[][]): number[][] {
    let sorted: number[][] = createMatrix(3, 10);

    for (let i = 0; i < 10; i++) {
        let max = Math.max(...old[0]);
        let index = 0;
        while (old[0][index] != max)
            index++;
        sorted[0][i] = old[0][index];
        sorted[1][i] = old[1][index];
        sorted[2][i] = old[2][index];
        old[0][index] = -1;
    }
    return sorted;
}