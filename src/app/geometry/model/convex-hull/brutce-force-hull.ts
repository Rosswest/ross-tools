import { Utils } from "src/app/shared/utils";
import { Vector2D } from "../vector2D";
import { Edge2D } from "../edge-2d";

export class BruteForceHull {
    hullPoints: Vector2D[];
    segments: Set<Edge2D>;

    constructor(points: Vector2D[]) {
        this.hullPoints = [];
        this.segments = new Set<any>();
        this.process(points);
    }

    private process(points: Vector2D[]) {
        this.hullPoints = this.bruteForceHull(points);
    }

    bruteForceHull(points: Vector2D[]): Vector2D[] {
        const segments: Set<any> = new Set<any>();

        let hull: Vector2D[] = [];
        const pointCount = points.length

        let lineStart = null;
        let lineEnd = null;

        if (pointCount > 3) {
            for (let i=0; i < pointCount; i++) {
                lineStart = points[i];
                for (let j = i+1; j < pointCount; j++) {
                    lineEnd = points[j];
                    const otherPoints = Utils.getArrayWithoutElements(points, [lineStart,lineEnd]);
                    const grouped = Vector2D.groupPointsByOrientation(lineStart,lineEnd,otherPoints);
                    const hasClockwisePoints = (grouped.clockwise.length > 0);
                    const hasAntiClockwisePoints = (grouped.antiClockwise.length > 0);
                    const isOnConvexHull = Utils.exclusiveOr(hasClockwisePoints,hasAntiClockwisePoints);
                    if (isOnConvexHull) {
                        segments.add(new Edge2D(lineStart,lineEnd));
                    }
                }
            }

            // translate the segments to hull points
            // hull = this.convertLineSegmentsToHull(segments);
            for (const segment of segments) {
                this.segments.add(segment);
            }
        } else {
            const firstPoint = points[0];
            let previous = points[0];
            let i = 0;
            for (const point of points) {
                if (i > 0) {
                    const startPoint = previous;
                    const endPoint = point;
                    this.segments.add(new Edge2D(startPoint,endPoint));
                }
                previous = point;
                i++;
            }
            this.segments.add(new Edge2D(previous,firstPoint));

            // hull = points;
        }

        return [];
    }

}