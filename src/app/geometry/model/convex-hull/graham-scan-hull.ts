import { Utils } from "src/app/shared/utils";
import { GeometryUtils } from "../GeometryUtils";
import { Vector2D } from "../vector2D";
import { Edge2D } from "../edge-2d";

export class GrahamScanHull {
    hullPoints: Vector2D[];
    segments: Edge2D[] = [];

    constructor(points: Vector2D[]) {
        this.hullPoints = [];
        points = Vector2D.removeDuplicatePoints(points);
        this.process(points);
        this.populateSegments();
    }

    populateSegments() {
        const segments = [];
        let previousPoint = this.hullPoints[0];
        for (let i = 1; i < this.hullPoints.length; i++) {
            const currentPoint = this.hullPoints[i];
            const segment = new Edge2D(previousPoint,currentPoint);
            segments.push(segment);
            previousPoint = currentPoint;
        }

        const segment = new Edge2D(previousPoint,this.hullPoints[0]);
        segments.push(segment);
        this.segments = GeometryUtils.getUniqueEdges(segments);
    }

    private process(points: Vector2D[]) {
        const firstPointCandidates = points.sort((a,b)=>{
            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            } else {
                if (a.x < b.x) {
                    return -1;
                } else if (a.x > b.x) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        // push initial points
        const firstPoint = firstPointCandidates[0];
        const secondPoint = firstPointCandidates[0];
        const thirdPoint = firstPointCandidates[0];
        const hull = [];

        hull.push(firstPoint);
        hull.push(secondPoint);
        hull.push(thirdPoint);
        points = Utils.getArrayWithoutElements(points, [firstPoint,secondPoint,thirdPoint]);
        let sortedPoints = this.sortPointsByPolarAngle(points, firstPoint);
        for (const point of sortedPoints) {
            let canRemovePoints = hull.length > 2;
            if (canRemovePoints) {
                let previousPoint = hull[hull.length-1];
                let secondPreviousPoint = hull[hull.length-2];
                let pointIsNotAppropriate = !Vector2D.ccw(previousPoint, point, secondPreviousPoint);
                while (canRemovePoints && pointIsNotAppropriate) {
                    hull.pop();
                    canRemovePoints = hull.length > 2;
                    if (canRemovePoints) {
                        previousPoint = hull[hull.length-1];
                        secondPreviousPoint = hull[hull.length-2];
                        pointIsNotAppropriate = !Vector2D.ccw(previousPoint, point, secondPreviousPoint);
                    }
                }
            }

            

            hull.push(point);
        }
       
        /*
    
        for point in points:
            # pop the last point from the stack if we turn clockwise to reach this point
            while count stack > 1 and ccw(next_to_top(stack), top(stack), point) <= 0:
                pop stack
            push point to stack
        end
            */
        

        this.hullPoints = hull;
    }

    getTopItemFromStack(stack: any[]) {
        const length = stack.length;
        return stack[length-1];
    }

    getSecondToTopItemFromStack(stack: any[]) {
        const length = stack.length;
        return stack[length-2];
    }

    private sortPointsByPolarAngle(points: any[], currentPoint: Vector2D) : Vector2D[] {
        this.assignPolarAngles(points,currentPoint);
        return points.sort((a,b)=>{
            if (a.polarAngle < b.polarAngle) {
                return -1;
            } else if (a.polarAngle > b.polarAngle) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    private assignPolarAngles(points: any[], startingPoint: Vector2D): void {

        const xAxis = new Vector2D(1,0);
        for (const point of points) {
            const diff = Vector2D.subtract(point,startingPoint);
            const angle = Vector2D.angleBetweenRadians(xAxis,diff);
            point.polarAngle = angle;
        }
    }

}