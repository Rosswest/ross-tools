import { Utils } from "src/app/shared/utils";
import { Vector2D } from "./vector2D";

export class QuickHull {
    allPoints: Vector2D[];
    hullPoints: Vector2D[];
    leftMost: Vector2D;
    rightMost: Vector2D;
    segments: Set<any>;
    maxIterations = 100;
    iterations = 0;

    constructor(allPoints: Vector2D[]) {
        this.segments = new Set<any>();
        this.allPoints = allPoints;
        this.hullPoints = [];
        this.leftMost = this.findLeftMostPoint();
        this.rightMost = this.findRightMostPoint();
        this.process();
    }

    sortPointsByX(points: Vector2D[]) {
        return points.sort((a,b)=>{
            return (a.x > b.x) ? 1 : -1;
        });
    }

    private process() {
        const hull = this.bruteForceHull(this.allPoints);
        this.hullPoints = hull;
    }

    divideAndConquerHull(points: Vector2D[]) {
        if (points.length < 6) {
            return this.bruteForceHull(points);
        } else {
            const xSortedPoints = this.sortPointsByX(points);
            const midPointIndex = Math.floor(xSortedPoints.length / 2);
            const leftPoints = [];
            const rightPoints = [];
            for (let i = 0; i < midPointIndex; i++) {
                const point = xSortedPoints[i];
                leftPoints.push(point);
            }
            for (let i = midPointIndex; i < xSortedPoints.length; i++) {
                const point = xSortedPoints[i];
                rightPoints.push(point);
            }

            const leftHull = this.divideAndConquerHull(leftPoints);
            const rightHull = this.divideAndConquerHull(rightPoints);
            const mergedHull = this.mergeHulls(leftHull,rightHull);
            return mergedHull;
        }
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
                    // console.log("points",JSON.stringify(points));
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
        console.log(JSON.stringify(segments));
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

        console.log("first segment",firstSegment);
        let segment = firstSegment;

        while (!complete) {

            console.log(JSON.stringify(segment));
            // add this segments start point to the hull
            const startPoint = segment.start;
            hull.push(startPoint);
            const endPoint = segment.end;

            console.log(segment, segmentsAsArray);

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

    mergeHulls(firstHull: Vector2D[], secondHull: Vector2D[]): Vector2D[] {
        console.log("joining", firstHull.length, secondHull.length);
        const merged = [];
        for (const point of firstHull) {
            merged.push(point);
        }
        for (const point of secondHull) {
            merged.push(point);
        }
        return merged;
    }

    // find point with minimum x, tie-breaking with minimum y
    findLeftMostPoint(): Vector2D {
        let leftMost = this.allPoints[0];
        for (let point of this.allPoints) {
            if (point.x < leftMost.x) {
                leftMost = point;
            } else if (point.x == leftMost.x) {
                if (point.y < leftMost.y) {
                    leftMost = point;
                }
            }
        }

        return leftMost;
    }

    // find point with minimum x, tie-breaking with minimum y
    findRightMostPoint(): Vector2D {
        let rightMost = this.allPoints[0];
        for (let point of this.allPoints) {
            if (point.x > rightMost.x) {
                rightMost = point;
            } else if (point.x == rightMost.x) {
                if (point.y > rightMost.y) {
                    rightMost = point;
                }
            }
        }

        return rightMost;
    }

}