import { Utils } from "src/app/shared/utils";
import { Vector2D } from "./vector2D";

export class BruteForceHull {
    hullPoints: Vector2D[];
    segments: Set<any>;

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
                        segments.add({start: lineStart, end: lineEnd});
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
                    this.segments.add({start: startPoint, end: endPoint});
                }
                previous = point;
                i++;
            }
            this.segments.add({start: previous, end: firstPoint});

            // hull = points;
        }

        return [];
    }

    convertLineSegmentsToHull(segments: Set<any>) {
        const handledPoints = new Set<Vector2D>();
        const hull = [];
        let complete = false;
        const segmentsAsArray = Array.from(segments);
        let noMatchingEnd = null;
        let noMatchingStart = null;

        // the first segment will have a start point with no matching previous segment
        let firstSegment = null;
        for (const segment of segments) {
            const startPoint = segment.start
            const matchingStartSegment = segmentsAsArray.find(candidate=>{
                const xMatch = candidate.end.x == startPoint.x;
                const yMatch = candidate.end.y == startPoint.y;
                return (xMatch && yMatch);
            });
            if (matchingStartSegment == undefined) {
                firstSegment = segment;
                break;
            }
        }

        let segment = firstSegment;

        while (!complete) {

            // add this segments start point to the hull
            const startPoint = segment.start;
            hull.push(startPoint);
            const endPoint = segment.end;


            //find a segment with a start point that matches this segments end point
            const matchingSegment = segmentsAsArray.find(segment=>{
                const xMatch = segment.start.x == endPoint.x;
                const yMatch = segment.start.y == endPoint.y;
                return (xMatch && yMatch);
            });

            // handle that segment next
            segment = matchingSegment;
            
            // end the iterations once we have the right number of points
            complete = (hull.length == segments.size);
        }

        return hull;
    }

}