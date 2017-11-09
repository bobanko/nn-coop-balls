import { boxBounds, jsPageHeight, limit } from './helpers';
import {Circle} from './circle';
import { TVector, Vector } from './vector';

const radius = 35;

const color = '#3fb0ac';

export class Defender extends Circle {

	max_acc = 0.1;
	max_vel = 2;

	acc: Vector = Vector.zero;

	constructor(position: TVector) {
		super(position, radius, color);
	}

	change_acc(changeX: number, changeY: number): void {
		this.acc.x += changeX;
		this.acc.y += changeY;
		this.acc.x = limit(this.acc.x, this.max_acc, -this.max_acc);
		this.acc.y = limit(this.acc.y, this.max_acc, -this.max_acc);

		this.velocity = this.velocity.add(this.acc);
		this.velocity.y += this.acc.y;
		this.velocity.x = limit(this.velocity.x, this.max_vel, -this.max_vel);
		this.velocity.y = limit(this.velocity.y, this.max_vel, -this.max_vel);

		super.updatePos();

		this.position.x = limit(this.position.x, boxBounds.end - this.radius, boxBounds.start + this.radius);
		this.position.y = limit(this.position.y, jsPageHeight - this.radius, this.radius);
	}
}

