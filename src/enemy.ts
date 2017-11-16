import { Defender } from './defender';
import { Circle } from './circle';
import { TVector } from './vector';

const color = '#fae596';

export class Enemy extends Circle {

	constructor(position: TVector, radius: number) {
		super(position, radius, color);
	}

	intersect(team: Array<Defender>): boolean {
		return team.some(def => this.intersects(def));
	}
}
