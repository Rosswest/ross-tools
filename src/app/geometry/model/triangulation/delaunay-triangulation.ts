import { GrahamScanHull } from "../convex-hull/graham-scan-hull";
import { Edge2D as Edge2D } from "../edge-2d";
import { Vector2D } from "../vector2D";

export class DelaunayTriangulation {
    points: Vector2D[];
    convexHull: Edge2D[];
    edges: Edge2D[];

    constructor (points: Vector2D[]) {
        this.points = points;
        this.process();
    }

    private process() {

        // start by creating the convex hull of the polygon formed by these points
        const convexHull = new GrahamScanHull(this.points);
        this.convexHull = convexHull.segments;
        console.log(this.convexHull);
    }
}