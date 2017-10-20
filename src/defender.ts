import { jsPageHeight, limit } from './helpers';
import { Circle } from './circle';

const radius = 35;
const color = '#3fb0ac';

export class Defender extends Circle {

	max_acc = 0.1;
	max_vel = 2;

	accX = 0;
	accY = 0;
	velX = 0;
	velY = 0;

	constructor(posX:number, posY:number) {
		super(posX, posY, radius, color);
	}

	change_acc(changeX: number, changeY: number): void {
		this.accX += changeX;
		this.accY += changeY;
		this.accX = limit(this.accX, this.max_acc, -this.max_acc);
		this.accY = limit(this.accY, this.max_acc, -this.max_acc);

		this.velX += this.accX;
		this.velY += this.accY;
		this.velX = limit(this.velX, this.max_vel, -this.max_vel);
		this.velY = limit(this.velY, this.max_vel, -this.max_vel);

		this.posX += this.velX;
		this.posY += this.velY;
		this.posX = limit(this.posX, 800 - this.radius, 300 + this.radius);
		this.posY = limit(this.posY, jsPageHeight - this.radius, this.radius);
	}

}

