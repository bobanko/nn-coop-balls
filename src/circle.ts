import { ellipse } from './canvasHelper';

export abstract class Circle {

	constructor(public posX: number, public posY: number,
					public radius: number,
					public color: string) {

	}

	draw() {
		ellipse(this.posX, this.posY, this.radius, this.color);
	}
}