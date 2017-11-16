import { boxBounds, jsPageHeight } from './helpers';
import { Circle } from './circle';
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

	change_acc(change: TVector): void {
		this.acc.addSelf(change)
			.limitSelf(Vector.both(this.max_acc), Vector.both(-this.max_acc));

		this.velocity.addSelf(this.acc)
			.limitSelf(Vector.both(this.max_vel), Vector.both(-this.max_vel));

		super.updatePos();

		this.position.limitSelf({
			x: boxBounds.end - this.radius,
			y: jsPageHeight - this.radius
		}, {
			x: boxBounds.start + this.radius,
			y: this.radius
		})
	}
}

