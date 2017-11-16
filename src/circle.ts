import { ellipse, line } from './canvasHelper';
import { TVector, Vector } from './vector';

export abstract class Circle {

	position: Vector = Vector.zero;
	velocity: Vector = Vector.zero;

	constructor(position: TVector,
				public radius: number,
				public color: string) {
		this.position = new Vector(position.x, position.y);
	}

	intersects(other: Circle) {
		return this.position.distance(other.position) < this.radius + other.radius;
	}

	updatePos() {
		this.position.addSelf(this.velocity);
	}

	draw() {
		ellipse(this.position.x, this.position.y, this.radius, this.color);
		let velNormalized = this.velocity.normalize();
		let velDirection = velNormalized.multiply(this.radius);

		line(this.position.x, this.position.y, this.position.x + velDirection.x, this.position.y + velDirection.y);
	}
}
