import {ellipse, line} from './canvasHelper';
import {Vector} from './vector';

export abstract class Circle {

	velX: number = 0;
	velY: number = 0;

	constructor(public posX: number, public posY: number,
				public radius: number,
				public color: string) {

	}

	updatePos() {
		this.posX += this.velX;
		this.posY += this.velY;
	}

	draw() {
		ellipse(this.posX, this.posY, this.radius, this.color);
		let velNormalized = new Vector(this.velX, this.velY).normalize();
		let velDirection = velNormalized.multiply(this.radius);

		line(this.posX, this.posY, this.posX + velDirection.x, this.posY + velDirection.y);
	}
}
