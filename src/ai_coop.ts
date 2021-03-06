//import org.gicentre.utils.stat.*; //todo: charts here

import { arraySum, boxBounds, createArray, createMatrix, jsPageHeight, random } from './helpers';

import { Defender } from './defender';
import { Enemy } from './enemy';
import { inputsCount, Species } from './species';
import { XYChart } from './xyChart';

import './styles.less';
import { background, fill, line, text, textSize } from './canvasHelper';
import { Vector } from './vector';

//Global
let mutation_rate = 0.005;
let speciesTotal = 25;//num_species
let max_acc_variation = 0.01;
let num_defenders = 6;
let num_lives = 3;
let stop = false;

let graphicsFlag = false;

let team: Defender[] = [];
let mafia: Enemy[] = [];
let speciesADN: Species[] = [];
let generation = 1;
let last_spawn = 1;
let frame = 1.00;
let lives = num_lives;
let species = 0;
let score = 0;
let scores: number[] = createArray(speciesTotal);
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


function setupCharts() {
	lineChart = new XYChart(this);
	// Axis formatting and labels.
	lineChart.showXAxis(true);
	lineChart.showYAxis(true);
	// Symbol colours
	lineChart.setPointSize(2);
	lineChart.setLineWidth(2);
	lineChart.setMinY(0);
	lineChart.setXAxisLabel('Generation');
	lineChart.setYFormat('###');
	lineChart.setXFormat('###');

	medianChart = new XYChart(this);
	// Axis formatting and labels.
	medianChart.showXAxis(true);
	medianChart.showYAxis(true);
	// Symbol colours
	medianChart.setPointSize(2);
	medianChart.setLineWidth(2);
	medianChart.setMinY(0);
	medianChart.setYFormat('###');
	medianChart.setXFormat('###');
	medianChart.setXAxisLabel('Generation');
	medianChart.setLineColour('#D5A021');
	medianChart.setPointColour('#D5A021');
}


function createDefenders() {
	for (let i = 0; i < num_defenders; i++) {

		let x = (boxBounds.start + boxBounds.end) / 2;
		let y = (jsPageHeight / num_defenders) * i;

		let defender = new Defender({x, y});
		team.push(defender);
	}
}

function setup(): void {
	setupCharts();

	//console.log("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");
	createDefenders();

	for (let i = 0; i < speciesTotal; i++)
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
let FPS = 160;
//todo: gameloop? use RAF
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

	//end of species
	if (lives == 0) {
		lives = num_lives;
		scores[species] = score;
		top_score = Math.max(top_score, score);
		species++;

		score = 0;
		frame = 0;
		last_spawn = 0;
		reset_defenders();
		if (species === speciesTotal) //end of generation
		{
			//score order
			let ordered_scores: number[] = createArray(speciesTotal);
			let ordered_speciesADN: Species[] = [];
			/*new Array < Species > ()*/

			for (let i = 0; i < speciesTotal; i++) {
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
			for (let i = 1; i < speciesTotal; i++) {
				new_speciesADN.push(newSpecies(speciesADN, scores));
			}
			speciesADN = new_speciesADN;
			let median = scores[speciesTotal / 2];
			//reset scores
			let total_score = 0;
			for (let i = 0; i < speciesTotal; i++) {
				total_score += scores[i];
				scores[i] = 0;
			}
			last_gen_avg = total_score / speciesTotal;
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
					// console.log("Num of Species: " + num_species + " with mutation rate of " + mutation_rate + " got a score of " + (top_score - generation + Math.max(...history_med)));
				}
			}

			//draw only after gen 100
			// if (generation == 100)
			//     graphicsFlag = true;

			lineChart.setMaxY(top_score);
			medianChart.setMaxY(top_score);
			lineChart.setData(generation_array, history_top);
			medianChart.setData(generation_array, history_med);

			//console.log(generation + "\t|\t" + last_gen_avg + "\t|\t" + median + "\t|\t" + top_score);
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
	team.splice(0);

	createDefenders();

	mafia.splice(0);
}

function graphics(): void {
	function renderScore(score = 0) {
		const maxScore = 3;
		return (score > maxScore)
			? `💎x${score}`
			: ([...Array(score).fill('💎')].join('') || 0);
	}

	function renderLives(current = 0, max = num_lives) {
		return [...Array(lives).fill('💗'), ...Array(max - lives).fill('🖤')].join('');
	}

	//Static Graphics
	line(boxBounds.start, 0, boxBounds.start, jsPageHeight);
	line(boxBounds.end, 0, boxBounds.end, jsPageHeight);
	fill('#173e43');
	textSize(20);
	let padding = 10;
	let textBlockPosX = boxBounds.end + padding;
	text('Generation ' + generation, textBlockPosX, 30);
	text('Species: ' + (species + 1) + '/' + speciesTotal, textBlockPosX, 55);
	text('Top Score: ' + top_score, textBlockPosX, 80);
	textSize(22);
	text('Generation Info', textBlockPosX, 115);
	text('Species Info', textBlockPosX, 210);
	text('Leaderboards', textBlockPosX, 285);
	textSize(18);
	text(`Average:       ${ arraySum(scores) / species }`, textBlockPosX, 135); //change to 1
	text(`Last Average:  ${ last_gen_avg}`, textBlockPosX, 155);
	text(`Best Average:  ${top_gen_avg}`, textBlockPosX, 175);
	text(`Current Score: ${renderScore(score)}`, textBlockPosX, 230);
	text(`❤Lives:       ${renderLives(lives, num_lives)}`, textBlockPosX, 250);

	for (let i = 0; i < 10; i++) {
		fill('#173e43', 255 - ((generation - leaderboard[1][i]) * 7));
		if (leaderboard[1][i] == generation) {
			if (leaderboard[2][i] == species)
				fill('#D5A021');
			else
				fill('#3fb0ac');
		}
		text((i + 1) + '. Generation ' + leaderboard[1][i] + ': ' + leaderboard[0][i], textBlockPosX, 310 + i * 21);
	}
	textSize(12);

	lineChart.draw(textBlockPosX, 535, 270, 175);
	medianChart.draw(textBlockPosX, 535, 270, 175);
}

function mafia_spawn(): void {
	//mafia spawn
	if (random(0, 1) < (last_spawn * 0.0001)) {
		let radius = (Math.exp(-frame / 20000) * 40);
		let vel = 2;
		//shit?
		if (frame > 10000)
			vel += frame / 10000;
		//console.log(`Spawn: Radius: ${radius} Vel:${vel}   (Frame:${frame})`);

		vel = 10;//todo: remove (debug only) or not?

		let enemyStartPos = {
			x: -radius,
			y: random(radius, jsPageHeight - radius)
		};

		let enemy = new Enemy(enemyStartPos, radius);
		enemy.velocity.x = vel;
		mafia.push(enemy);

		last_spawn = 0;
	}
}

function update_mafia(): void {
	//todo: rewrite - but collection modification problem
	for (let i = mafia.length - 1; i >= 0; i--) {
		mafia[i].updatePos();
		if (mafia[i].intersect(team)) {
			mafia.splice(i, 1); //delete
			score++;
			continue;
		}

		let pos = mafia[i].position.x;
		if (pos >= boxBounds.end - mafia[i].radius) {
			mafia.splice(i, 1); //delete
			lives--;
			continue;
		}

		mafia[i].draw();
	}
}

function getClosestDefenders(current: Defender, items: Defender[], count: number): Defender[] {
	return items.map(def => ({
		def,
		distance: Vector.distance(current.position, def.position)
	})).sort((item1, item2) => item1.distance - item2.distance)
		.slice(1)
		.slice(0, count)
		.map(item => item.def);
}

function update_defenders(): void {

	const boxWidth = boxBounds.end - boxBounds.start;

	function normalizePosX(x: number): number {
		return (x - boxBounds.start - boxWidth / 2) / (boxWidth / 2);
	}

	//update defenders
	team.forEach(defender => {
		defender.draw();

		let [closest1, closest2] = getClosestDefenders(defender, team, 2);

		let input: number[] = createArray(inputsCount);

		input[0] = normalizePosX(defender.position.x);
		input[1] = (defender.position.y) / (jsPageHeight / 2.00);//pos y

		input[2] = defender.velocity.x / 2.00;//vel x
		input[3] = defender.velocity.y / 2.00;//vel y

		input[4] = normalizePosX(closest1.position.x) - input[0]; // minus current?
		input[5] = (closest1.position.y / (jsPageHeight / 2.00)) - input[1];

		input[6] = closest1.velocity.x / 2.00 - input[2];//vel x
		input[7] = closest1.velocity.y / 2.00 - input[3];

		input[8] = normalizePosX(closest2.position.x) - input[0];//minus current?
		input[9] = (closest2.position.y / (jsPageHeight / 2.00)) - input[1];

		input[10] = (closest2.velocity.x / 2.00) - input[2];
		input[11] = (closest2.velocity.y / 2.00) - input[3];

		input[12] = 1; //bias

		//console.log(`input: X:${input[0]} Y:${input[1]} VelX:${input[2]} VelY:${input[3]}`);

		let output: number[] = speciesADN[species].calculateOutput(input);

		let xyOutput = new Vector(output[0], output[1]).multiply(max_acc_variation);
		defender.change_acc(xyOutput);
		//console.log(`X: ${team[0].posX} Y: ${team[0].position.y}`);
	});
}

function newSpecies(ancestor: Species[], scores: number[]): Species {
	let baby = new Species(false);
	let total_score = 0;
	let float_scores: number[] = createArray(speciesTotal);
	//normalize

	total_score = scores.reduce((total, score) => total + score ** 2, 0);
	float_scores = scores.map(score => score ** 2 / total_score);


	//calculate genes
	for (let i = 0; i < inputsCount; i++)
		for (let j = 0; j < 10; j++) {
			let r = random(0, 1);
			let index = 0;
			while (r >= 0) {
				r = r - float_scores[index];
				index++;
			}
			index--;
			let layer: number[][] = ancestor[index].firstLayer;
			baby.layers[0][i][j] = layer[i][j];
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
			let layer: number[][] = ancestor[index].secondLayer;
			baby.layers[1][i][j] = layer[i][j];
		}

	//calculate mutations
	for (let i = 0; i < inputsCount; i++)
		for (let j = 0; j < 10; j++) {
			let r = random(0, 1);
			if (r < mutation_rate)
				baby.layers[0][i][j] = random(-1, 1);
		}

	for (let i = 0; i < 11; i++)
		for (let j = 0; j < 2; j++) {
			let r = random(0, 1);
			if (r < mutation_rate)
				baby.layers[1][i][j] = random(-1, 1);
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
