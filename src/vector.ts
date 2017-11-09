export type TVector = { x: number, y: number };

export class Vector {
	static get zero() {
		return new Vector(0, 0);
	};

	static get one() {
		return new Vector(1, 1);
	};

	static distance(vector1: TVector, vector2: TVector): number {
		return Math.sqrt((vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2);
	}

	constructor(public x: number = 0, public y: number = 0) {

	}

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
}
