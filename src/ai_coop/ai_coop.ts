//import org.gicentre.utils.stat.*; //todo: charts here

let XYChart = function (...args) {
};//chart mock

import { jsPageHeight, random, distance, limit } from '../helpers';

import { Defender } from '../defender';
import { Enemy } from '../enemy';
import { Species } from '../species';


//Global
let mutation_rate = 0.005;
let num_species = 25;
let max_acc_variation = 0.01;
let num_defenders = 6;
let num_lives = 3;
let graphics = false;
let stop = false;

let /*ArrayList<defender>*/ team: Defender[] = [];
let /*ArrayList<enemy>*/ mafia: Enemy[] = [];
let /*ArrayList<species>*/ speciesADN: Species[] = [];
let /*int*/ generation = 1;
let /*int*/ last_spawn = 1;
let /*float*/ frame = 1.00;
let /*int*/ lives = num_lives;
let /*int*/ species = 0;
let /*int*/ score = 0;
let /*int[]*/ scores = new Array(num_species).fill(0);
let /*int*/ top_score = 0;
let /*int*/ top_score_gen = 0;
let /*float*/ last_gen_avg = 0;
let /*float*/ top_gen_avg = 0;
let /*float[][]*/ leaderboard = new float[3][10];
let /*XYChart*/ lineChart;
let /*XYChart*/ medianChart;
let /*float[]*/ generation_array:number[] = [];
let /*float[]*/ history_avg:number[] = [];
let /*float[]*/ history_top:number[] = [];
let /*float[]*/ history_med:number[] = [];
let /*Table*/ table;

let /*boolean*/ evolution_end = false;

let /*int*/ time = performance.now();

/*millis();*/


function /*void*/  setup() {
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


	/*table = new Table();
	 table.addColumn("Generation");
	 table.addColumn("Average");
	 table.addColumn("Median");
	 table.addColumn("Top");*/

	frameRate(10000);
	console.log("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");

	size(1080, 720);
	for (let /*int*/ i = 0; i < num_defenders; i++)
		team.add(new Defender(i + 1, num_defenders));

	for (let /*int*/ i = 0; i < num_species; i++)
		speciesADN.add(new Species(true));

	for (let /*int*/ i = 0; i < 10; i++) {
		leaderboard[0][i] = 0;
		leaderboard[1][i] = 0;
		leaderboard[2][i] = 0;
	}
}

//#fae596 amarelo
//#173e43 azul escuro

function /*void*/  draw() {
	//console.log(frameRate);
	do {
		if (graphics)
			background('#dddfd4'
			)
			;
		update_defenders();
		update_mafia();
		if (!evolution_end)
			mafia_spawn();
		if (graphics)
			graphics();

		if (score >= leaderboard[0][9]) {
			let /*boolean*/ new_entry = true;
			for (let /*int*/ i = 0; i < 10; i++) {
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
			//console.log(scores[species]);
			species++;
			score = 0;
			frame = 0;
			last_spawn = 0;
			reset_defenders();
			if (species == num_species) //end of generation
			{
				//score order
				let /*int[]*/ ordered_scores = new int[num_species];
				let /*Array<species>*/ ordered_speciesADN = [];
				/*new Array < Species > ()*/

				for (let /*int*/ i = 0; i < num_species; i++) {
					let /*int*/ top_score = Math.max(...scores);
					let /*int*/ index = 0;
					while (scores[index] != top_score)
						index++;
					ordered_scores[i] = scores[index];
					scores[index] = -1;
					ordered_speciesADN.add(speciesADN[index]);
				}
				scores = ordered_scores;
				top_score_gen = scores[0];
				speciesADN = ordered_speciesADN;
				//new species
				let /*Array<species>*/ new_speciesADN: Species[] = [];
				new_speciesADN.add(speciesADN[0]);
				for (let /*int*/ i = 1; i < num_species; i++) {
					new_speciesADN.add(newSpecies(speciesADN, scores));
				}
				speciesADN = new_speciesADN;
				let /*int*/ median = scores[/*(int)*/num_species / 2];
				//reset scores
				let /*float*/ total_score = 0;
				for (let /*int*/ i = 0; i < num_species; i++) {
					total_score += scores[i];
					scores[i] = 0;
				}
				last_gen_avg = total_score / num_species;
				top_gen_avg = Math.max(top_gen_avg, last_gen_avg);
				history_avg = append(history_avg, top_gen_avg);
				//history_top = append(history_top,top_score); //top all time graph
				history_top = append(history_top, top_score_gen); //top each generation graph
				history_med = append(history_med, median);
				generation_array = append(generation_array, generation);

				//save to csv file
				/*TableRow newRow = table.addRow();
				 newRow.setInt("Generation", generation);
				 newRow.setFloat("Average", last_gen_avg);
				 newRow.setInt("Median", median);
				 newRow.setInt("Top", top_score);
				 saveTable(table, "data/coop.csv");*/

				if (generation > 7 && stop) {
					//check if end of evolution
					//if last 7 median average is greater than last median
					let /*float*/ sum = 0;
					for (let /*int*/ i = 0; i < 7; i++) {
						sum = sum + history_med[generation - 1 - i];
					}
					let /*float*/ average = sum / 7;
					if (average >= history_med[generation - 1]) {
						evolution_end = true;
						console.log("Num of Species: " + num_species + " with mutation rate of " + mutation_rate + " got a score of " + (top_score - generation + max(history_med)));
					}
				}
				//draw only after gen 100
				if (generation == 100)
					graphics = true;

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
	} while (!graphics);
}

//end of draw**************************************************************************************


function stub (...args){
	console.warn('not impl.', args);
}

let text = stub;
let line = stub;
let fill = stub;
let textSize = stub;
let ellipse = stub;


function /*void*/  reset_defenders() {
	for (let /*int*/ i = team.length - 1; i >= 0; i--)
		team.remove(i);
	for (let /*int*/ i = 0; i < num_defenders; i++)
		team.add(new Defender(i + 1, num_defenders));
	for (let /*int*/ i = mafia.length - 1; i >= 0; i--)
		mafia.remove(i);
}

function /*void*/  graphics() {
	//Static Graphics
	line(300, 0, 300, jsPageHeight);
	line(800, 0, 800, jsPageHeight);
	fill('#173e43'
	)
	;
	textSize(20);
	text("Generation " + generation, 810, 30);
	text("Species: " + (species + 1) + "/" + num_species, 810, 55);
	text("Top Score: " + top_score, 810, 80);
	textSize(22);
	text("Generation Info", 810, 115);
	text("Species Info", 810, 210);
	text("Leaderboards", 810, 285);
	textSize(18);
	text("Average:        " + nf(arraySum(scores) / species, 1, 2), 810, 135); //change to 1
	text("Last Average: " + nf(last_gen_avg, 1, 2), 810, 155);
	text("Best Average: " + nf(top_gen_avg, 1, 2), 810, 175);
	text("Current Score: " + score, 810, 230);
	text("Lives: " + lives, 810, 250);

	for (let /*int*/ i = 0; i < 10; i++) {
		fill('#173e43', 255 - ((generation - leaderboard[1][i]) * 7)
		)
		;
		if (leaderboard[1][i] == generation) {
			if (leaderboard[2][i] == species)
				fill('#D5A021'
				)
				;
			else
				fill('#3fb0ac'
				)
				;
		}
		text((i + 1) + ". Generation " + /*(int)*/
			leaderboard[1][i] + ": " + leaderboard[0][i], 810, 310 + i * 21
		)
		;
	}
	textSize(12);
	lineChart.draw(810, 535, 270, 175);
	medianChart.draw(810, 535, 270, 175);
}

function /*void*/  mafia_spawn() {
	//mafia spawn
	if (random(1) < (last_spawn * 0.0001)) {
		let /*float*/ radius = (Math.exp(-frame / 20000) * 40);
		let /*int*/ vel = 2;
		if (frame > 10000)
			vel += /*(int)*/(frame / 10000);
		//console.log("Spawn: Radius:"+/*(int)*/ radius+" Vel:"+vel+"   (Frame:"+frame+")");
		mafia.add(new Enemy(/*(int)*/
			radius, vel
		))
		;
		last_spawn = 0;
	}
}

function/*void*/ update_mafia() {
	fill('#fae596'
	)
	;

	for (let /*int*/ i = mafia.length - 1; i >= 0; i--) {
		mafia[i].updatePos();
		if (mafia[i].intersect(team)) {
			mafia.remove(i);
			score++;
		}
		else {
			let /*int*/ pos = mafia[i].getX();
			if (pos >= 800 - mafia[i].getRadius()) {
				mafia.remove(i);
				lives--;
			}
			else if (graphics)
				ellipse(mafia[i].getX(), mafia[i].getY(), mafia[i].getRadius() * 2, mafia[i].getRadius() * 2);
		}
	}
}

function/*void*/ update_defenders() {
	fill('#3fb0ac');
	//update defenders
	for (let /*int*/ i = 0; i < team.length; i++) {
		if (graphics)
			ellipse(team[i].getX(), team[i].getY(), team[i].getRadius() * 2, team[i].getRadius() * 2);
		//calcule inputs
		let /*float[]*/ dist = new Array(team.length).fill(0);
		for (let /*int*/ j = 0; j < team.length; j++) {
			if (j != i) {
				dist[j] = distance(team[i].getX(), team[i].getY(), team[j].getX(), team[j].getY());
			}
			else
				dist[j] = 99999;
		}
		let /*float*/ closest = Math.min(...dist);
		//console.log("1st: "+closest);
		let /*int*/ index1 = 0;
		let /*int*/ index2 = 0;
		while (closest != dist[index1])
			index1++;
		dist[index1] = 99999;
		closest = Math.min(...dist);
		//console.log("2nd: "+closest);
		while (closest != dist[index2])
			index2++;

		let /*float[]*/ input:number[] = new Array(13).fill(0);
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

		//console.log("input: X:"+input[0]+" Y:"+input[1]+" VelX:"+input[2]+" VelY:"+input[3]);

		let /*float*/ output /*[]*/ = speciesADN[species].calculateOutput(input);
		team[i].change_acc(output[0] * max_acc_variation, output[1] * max_acc_variation);
		//console.log("X: "+team[0].getX()+"Y: "+team[0].getY());
	}
}

function/*species*/ newSpecies(/*Array<species>*/ ancestor, /*int[]*/ scores) {
	let baby = new Species(false);
	let /*float*/ total_score = 0;
	let /*float[]*/ float_scores = new Array(num_species).fill(0);
	//normalize
	for (let /*int*/ i = 0; i < num_species; i++) {
		total_score += /*(float)*/
			scores[i] * scores[i];
	}
	for (let /*int*/ i = 0; i < num_species; i++) {
		float_scores[i] = (scores[i] * scores[i]) / total_score;
	}

	//calculate genes
	for (let /*int*/ i = 0; i < 13; i++)
		for (let /*int*/ j = 0; j < 10; j++) {
			let /*float*/ r = random(0, 1);
			let /*int*/ index = 0;
			while (r >= 0) {
				r = r - float_scores[index];
				index++;
			}
			index--;
			let /*float[][]*/ layer = ancestor[index].first_layer();
			baby.set_layer(1, i, j, layer[i][j]);
		}

	for (let /*int*/ i = 0; i < 11; i++)
		for (let /*int*/ j = 0; j < 2; j++) {
			let /*float*/ r = random(0, 1);
			let /*int*/ index = 0;
			while (r >= 0) {
				r = r - float_scores[index];
				index++;
			}
			index--;
			let /*float[][]*/ layer = ancestor[index].second_layer();
			baby.set_layer(2, i, j, layer[i][j]);
		}

	//calculate mutations
	for (let /*int*/ i = 0; i < 13; i++)
		for (let /*int*/ j = 0; j < 10; j++) {
			let /*float*/ r = random(0, 1);
			if (r < mutation_rate)
				baby.set_layer(1, i, j, random(-1, 1));
		}

	for (let /*int*/ i = 0; i < 11; i++)
		for (let /*int*/ j = 0; j < 2; j++) {
			let /*float*/ r = random(0, 1);
			if (r < mutation_rate)
				baby.set_layer(2, i, j, random(-1, 1));
		}

	return baby;
}

function /*float*/ arraySum(/*int[]*/ arr) {
	let /*float*/ sum = 0;
	for (let /*int*/ i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum;
}

function /*float[][]*/ sortLeaderboard(/*float[][]*/ old:number[][]) {
	let /*float[][]*/ sorted:number[][] = new float[3][10];
	for (let /*int*/ i = 0; i < 10; i++) {
		let /*float*/ max = Math.max(...old[0]);
		let /*int*/ index = 0;
		while (old[0][index] != max)
			index++;
		sorted[0][i] = old[0][index];
		sorted[1][i] = old[1][index];
		sorted[2][i] = old[2][index];
		old[0][index] = -1;
	}
	return sorted;
}