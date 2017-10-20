import { distance, jsPageHeight, random } from './helpers';
import { Defender } from './defender';
import {Circle} from './circle';
import { ellipse } from './canvasHelper';


const color = '#fae596';


export class Enemy extends Circle{

	vel: number;



	constructor(posX, posY, radius: number, v: number) {
		super(posX, posY, radius, color);

		this.vel = v;

	}

	updatePos(): void {
		this.posX += this.vel;
	}

	//todo: remove getters
	getX(): number {
		return this.posX;
	}

	getY(): number {
		return this.posY;
	}

	getRadius() {
		return this.radius;
	}

	intersect(team: Array<Defender>): boolean {//ArrayList<defender> team

		//todo: any
		for (let i = 0; i < team.length; i++) {
			let dist = distance(this.posX, this.posY, team[i].getX(), team[i].getY());
			if (dist < (this.radius + team[i].getRadius()))
				return true;
		}
		return false;
	}


	draw(){
		ellipse(this.posX, this.posY, this.radius, this.color);
	}
}