import { Defender } from './defender';
import { Circle } from './circle';
import { TVector, Vector } from './vector';

const color = '#fae596';

export class Enemy extends Circle {

	constructor(position: TVector, radius: number) {
		super(position, radius, color);

		console.log('oy');
	}

	intersect(team: Array<Defender>): boolean {
		//todo: use .any()
		for (let i = 0; i < team.length; i++) {
			let dist = Vector.distance(this.position, team[i].position);
			if (dist < (this.radius + team[i].radius))
				return true;
		}
		return false;
	}
}
