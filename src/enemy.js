import {random, dist, jsPageHeight } from 'helpers';

export class enemy{

    constructor (r, v) {
        this.radius = r;
        this.vel = v;
        this.posX = -this.radius;
        this.posY = random(this.radius, jsPageHeight - this.radius);
    }

    updatePos(){
        this.posX += this.vel;
    }

    getX(){
        return this.posX;
    }

    getY(){
        return this.posY;
    }

    getRadius(){
        return this.radius;
    }

    intersect(team){//ArrayList<defender> team

        //todo: any
        for(let i=0; i<team.size(); i++)
        {
            let dist = dist(this.posX, this.posY, team.get(i).getX(), team.get(i).getY());
            if(dist<(this.radius + team.get(i).getRadius()))
                return true;
        }
        return false;
    }
}