import {Defender} from './defender';
import {Circle} from './circle';
import {Vector} from './vector';


const color = '#fae596';


export class Enemy extends Circle {

	velX: number;

	constructor(posX, posY, radius: number, velX: number) {
		super(posX, posY, radius, color);

		this.velX = velX;

	}

	intersect(team: Array<Defender>): boolean {
		//todo: use any
		for (let i = 0; i < team.length; i++) {
			let dist = Vector.distance({x: this.posX, y: this.posY}, {x: team[i].posX, y: team[i].posY});
			if (dist < (this.radius + team[i].radius))
				return true;
		}
		return false;
	}
}
