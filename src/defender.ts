import {jsPageHeight, limit} from './helpers';
import {Point} from './Point';

export class Defender extends Point {

    radius = 35;
    max_acc = 0.1;
    max_vel = 2;

    accX = 0;
    accY = 0;
    velX = 0;
    velY = 0;

    constructor(/*int*/ current: number, /*int*/ total: number) {
        super();
        //posX = random(600+radius,800-radius);
        //posY = random(radius, jsPageHeight-radius);
        this.posX = (300 + this.radius + 800 - this.radius) / 2;
        this.posY = (jsPageHeight / total) * current;
    }

    change_acc(/*float*/ changeX: number, /*float*/ changeY: number): void {
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

    //todo: remove getters
    /*int*/
    getRadius() {
        return this.radius;
    }

    /*int*/
    getX() {
        return this.posX;
    }

    /*int*/
    getVelY() {
        return this.velY;
    }

    /*int*/
    getVelX() {
        return this.velX;
    }

    /*int*/
    getY() {
        return this.posY;
    }

}

