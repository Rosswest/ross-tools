import { Vector2D } from "./vector2D";

export class Edge2D {
    start: Vector2D;
    end: Vector2D;

    constructor(start: Vector2D, end: Vector2D) {
        this.start = start;
        this.end = end;
    }

    public getDifferenceVector(): Vector2D {
        const difference = Vector2D.subtract(this.end,this.start);
        return difference;
    }
}