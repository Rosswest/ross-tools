import { Vector2D } from "./vector2D";

export class DivideAndConquerHull {
    allPoints: Vector2D[];
    hullPoints: Vector2D[];
    segments: Set<any>;

    constructor(allPoints: Vector2D[]) {
        this.segments = new Set<any>();
        this.allPoints = allPoints;
        this.hullPoints = [];
    }
}