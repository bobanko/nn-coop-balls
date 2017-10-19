import { dist, jsPageHeight, random } from 'helpers';
import { Defender } from './defender';

export class Enemy {

	radius: number;
	vel: number;
	posX: number;
	posY: number;

	constructor(r: number, v: number) {
		this.radius = r;
		this.vel = v;
		this.posX = -this.radius;
		this.posY = random(this.radius, jsPageHeight - this.radius);
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
			let dist = dist(this.posX, this.posY, team[i].getX(), team[i].getY());
			if (dist < (this.radius + team[i].getRadius()))
				return true;
		}
		return false;
	}
}