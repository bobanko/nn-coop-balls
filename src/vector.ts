import { limit } from './helpers';

export type TVector = { x: number, y: number };

export class Vector {
	/* STATICS */
	static get zero() {
		return new Vector(0, 0);
	};

	static get one() {
		return new Vector(1, 1);
	};


	static both(value) {
		return new Vector(value, value);
	}

	static distance(vector1: TVector, vector2: TVector): number {
		return Math.sqrt((vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2);
	}

	static limit(vector: Vector, min: Vector, max: Vector) {
		return new Vector(limit(vector.x, min.x, max.x), limit(vector.y, min.y, max.y))
	}

	constructor(public x: number = 0, public y: number = 0) {

	}

	/* ACCESSORS */
	normalize(): Vector {
		let dist = this.distance(Vector.zero);
		return this.multiply(1 / dist);
	};

	add(vector: TVector): Vector {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	multiply(multiplier: number): Vector {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}

	distance(vector: TVector): number {
		return Vector.distance(this, vector);
	}

	/* MUTATORS */

	//todo: how to name them?

	limitSelf(min: TVector, max: TVector): Vector {
		this.x = limit(this.x, min.x, max.x);
		this.y = limit(this.y, min.y, max.y);
		return this;
	}

	addSelf(vector: TVector): Vector {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}
}
