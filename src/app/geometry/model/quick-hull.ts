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
        this.process(allPoints);
    }

    sortPointsByX(points: Vector2D[]) {
        return points.sort((a,b)=>{
            return (a.x > b.x) ? 1 : -1;
        });
    }

    private process(points: Vector2D[]) {
        const hull = [];
        const lineStart = this.leftMost;
        const lineEnd = this.rightMost;
        const orientedPoints = Vector2D.groupPointsByOrientation(lineStart,lineEnd,points);
        const leftPoints = orientedPoints.antiClockwise;
        const rightPoints = orientedPoints.clockwise;
        const leftHull = this.subHull(this.leftMost,this.rightMost, leftPoints);
        const rightHull = this.subHull(this.rightMost,this.leftMost, rightPoints);

        //merge the sub-segments into the main hull
        hull.push(this.leftMost);
        for (const point of leftHull) {
            hull.push(point);
        }
        hull.push(this.rightMost);
        for (const point of rightHull) {
            hull.push(point);
        }
        hull.push(this.leftMost);
        
        this.hullPoints = hull;
    }

    private subHull(lineStart: Vector2D, lineEnd: Vector2D, candidates: Vector2D[]): Vector2D[] {
        const segment: Vector2D[] = [];
        let mostDistantPoint = null;
        let greatestDistance = null;

        if (candidates.length == 1) {
            segment.push(candidates[0]);
        } else if (candidates.length == 0) {
            return [];
        } else {
            
            // find the most distant point
            for (const point of candidates) {
                if (mostDistantPoint == null) {
                    mostDistantPoint = point;
                    const lineDistance = Vector2D.distanceFromPointToLine(lineStart,mostDistantPoint,point);
                    const startDistance = Vector2D.distanceBetweenPoints(point,lineStart);
                    const endDistance = Vector2D.distanceBetweenPoints(point,lineEnd);
                    const distance = Math.min(lineDistance,startDistance,endDistance);

                    greatestDistance = distance;
                } else {
                    const lineDistance = Vector2D.distanceFromPointToLine(lineStart,mostDistantPoint,point);
                    const startDistance = Vector2D.distanceBetweenPoints(point,lineStart);
                    const endDistance = Vector2D.distanceBetweenPoints(point,lineEnd);
                    const distance = Math.min(lineDistance,startDistance,endDistance);

                    if (distance > greatestDistance) {
                        mostDistantPoint = point;
                        greatestDistance = distance;
                    }
                }
            }


            // remove candidates that are within the new triangle
            const newCandidates = [];
            const polygon = [lineStart,lineEnd,mostDistantPoint,lineStart];
            for (const candidate of candidates) {
                if (!Vector2D.isInsidePolygon(polygon, candidate)) {
                    newCandidates.push(candidate);
                }
            }
            candidates = newCandidates;

            const orientedPoints = Vector2D.groupPointsByOrientation(lineStart,lineEnd,candidates);
            const leftPoints = orientedPoints.antiClockwise;
            const rightPoints = orientedPoints.clockwise;
            const leftHull = this.subHull(lineStart, mostDistantPoint,leftPoints);
            const rightHull = this.subHull(mostDistantPoint, lineEnd, rightPoints);
            
            for (const point of leftHull) {
                segment.push(point);
            }
            segment.push(mostDistantPoint);
            for (const point of rightHull) {
                segment.push(point);
            }
        }

        return segment;
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