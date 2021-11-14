import { Utils } from "src/app/shared/utils";

export class Vector2D {
    x: number;
    y: number;

    public static readonly ORIGIN: Vector2D = new Vector2D(0,0);

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static add(base: Vector2D, toAdd: Vector2D): Vector2D {
        const x = (base.x + toAdd.x);
        const y = (base.y + toAdd.y);
        const result = new Vector2D(x,y);
        return result;
    }

    public static subtract(base: Vector2D, toSubtract: Vector2D): Vector2D {
        const x = (base.x - toSubtract.x);
        const y = (base.y - toSubtract.y);
        const result = new Vector2D(x,y);
        return result;
    }

    public static euclideanDistance(a: Vector2D, b: Vector2D) {
        const xDiff = b.x - a.x;
        const yDiff = b.y - a.y;
        const relativeVector = new Vector2D(xDiff, yDiff);
        const distance = relativeVector.magnitude();
        return distance;
    }

    public static manhattanDistance(a: Vector2D, b: Vector2D) {
        const xDiff = b.x - a.x;
        const yDiff = b.y - a.y;
        const distance = Math.abs(xDiff) + Math.abs(yDiff);
        return distance;
    }

    public magnitude(): number {
        const magnitude = Math.sqrt(this.x*this.x + this.y*this.y);
        return magnitude;
    }

    public static dotProduct(a: Vector2D, b: Vector2D): number {
        const result = (a.x*b.x) + (a.y*b.y);
        return result;
    }

    /**
     * Returns whether line is to the left or right of the given line (facing from line start to line end):
     *  1 = to the right
     *  0 = on the line
     *  -1 = to the left
     * @param lineStart Starting point of the line
     * @param lineEnd End point of the line
     * @param queryPoint The line to check the orientation of
     */
    public static calculateOrientation(lineStart: Vector2D, lineEnd: Vector2D, queryPoint: Vector2D) {
        const lineVector = Vector2D.subtract(lineEnd,lineStart);
        const aqVector = Vector2D.subtract(queryPoint,lineStart);
        const determinant = Vector2D.determinant(aqVector,lineVector);
        if (determinant == 0) {
            return 0;
        } else {
            return Math.sign(determinant);
        }
    }

    public static determinant(a: Vector2D, b: Vector2D) {
        const result = (a.x*b.y) - (a.y*b.x);
        return result;
    }

    public static distanceFromPointToLine(lineStart: Vector2D, lineEnd: Vector2D, point: Vector2D) {
        const line = Vector2D.subtract(lineEnd,lineStart);
        const numerator = Math.abs(line.x * (lineStart.y - point.y) - line.y * (lineStart.x - point.x));
        const value = numerator / line.magnitude();
        return value;
        // return Math.abs((point.y - lineStart.y) * (lineEnd.x - lineStart.x) - (lineEnd.y - lineStart.y) * (point.x - lineStart.x));
    }

    public static isInsidePolygon(polygon: Vector2D[], point: Vector2D): boolean {
                  
        // Create a point for line segment from p to infinite
        let extreme = new Vector2D(99999999999999, point.y);
    
        // Count intersections of the above line
        // with sides of polygon
        let count = 0, i = 0;
        do
        {
            let next = (i + 1) % polygon.length;
    
            // Check if the line segment from 'p' to
            // 'extreme' intersects with the line
            // segment from 'polygon[i]' to 'polygon[next]'
            if (Vector2D.doIntersect(polygon[i], polygon[next], point, extreme))
            {
                // If the point 'p' is colinear with line
                // segment 'i-next', then check if it lies
                // on segment. If it lies, return true, otherwise false
                if (this.orientation(polygon[i], point, polygon[next]) == 0)
                {
                    return this.onSegment(polygon[i], point,
                                    polygon[next]);
                }
    
                count++;
            }
            i = next;
        } while (i != 0);
    
        // Return true if count is odd, false otherwise
        return (count % 2 == 1); // Same as (count%2 == 1)
        
         
    }

    // Given three colinear points p, q, r,
    // the function checks if point q lies
    // on line segment 'pr'
static onSegment(p:any,q:any,r:any)
{
     if (q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y))
        {
            return true;
        }
        return false;
}
 
// To find orientation of ordered triplet (p, q, r).
    // The function returns following values
    // 0 --> p, q and r are colinear
    // 1 --> Clockwise
    // -1 --> Counterclockwise
static orientation(p:any,q:any,r:any)
{
    let val = (q.y - p.y) * (r.x - q.x)
                - (q.x - p.x) * (r.y - q.y);
  
        if (val == 0)
        {
            return 0; // colinear
        }
        return (val > 0) ? 1 : -1; // clock or counterclock wise
}
 
// The function that returns true if
    // line segment 'p1q1' and 'p2q2' intersect.
static doIntersect(p1:any,q1:any,p2:any,q2:any)
{
    // Find the four orientations needed for
        // general and special cases
        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);
  
        // General case
        if (o1 != o2 && o3 != o4)
        {
            return true;
        }
  
        // Special Cases
        // p1, q1 and p2 are colinear and
        // p2 lies on segment p1q1
        if (o1 == 0 && this.onSegment(p1, p2, q1))
        {
            return true;
        }
  
        // p1, q1 and p2 are colinear and
        // q2 lies on segment p1q1
        if (o2 == 0 && this.onSegment(p1, q2, q1))
        {
            return true;
        }
  
        // p2, q2 and p1 are colinear and
        // p1 lies on segment p2q2
        if (o3 == 0 && this.onSegment(p2, p1, q2))
        {
            return true;
        }
  
        // p2, q2 and q1 are colinear and
        // q1 lies on segment p2q2
        if (o4 == 0 && this.onSegment(p2, q1, q2))
        {
            return true;
        }
  
        // Doesn't fall in any of the above cases
        return false;
    }

    public static groupPointsByOrientation(lineStart: Vector2D, lineEnd: Vector2D, pointsToGroup: Vector2D[]) {
        const antiClockwisePoints: Vector2D[] = [];
        const clockwisePoints: Vector2D[]  = [];
        for (const point of pointsToGroup) {
            const orientation = Vector2D.orientation(lineStart,point,lineEnd);
            if (orientation == 1) {
                clockwisePoints.push(point);
            } else if (orientation == -1) {
                antiClockwisePoints.push(point);
            }
        }

        const result = {
            clockwise: clockwisePoints,
            antiClockwise: antiClockwisePoints
        };

        return result;
    }

    /**
     * @param a The first vector
     * @param b The second vector
     * @returns The cross product of the the vectors as a scalar
     */
    public static crossProduct(a: Vector2D, b: Vector2D): number {
        const z = (a.x * b.y) - (a.y * b.x);
        return z;
    }

    /**
     *  |aXb| = |a||b|sin(angle)
     * @param a The first vector
     * @param b The second vector
     * @returns The angle between the two vectors in radians. Positive indicates a counter-clockwise turn between A and B.
     */
    public static angleBetweenRadiansDirectional(a: Vector2D, b: Vector2D): number {
        const crossProduct = Vector2D.crossProduct(a,b);
        const aMagnitude = a.magnitude();
        const bMagnitude = b.magnitude();
        const angle = Math.asin(crossProduct/(aMagnitude*bMagnitude));
        return angle;
    }

    /**
     * @param a The first vector
     * @param b The second vector
     * @returns The angle between the two vectors in degrees. Positive indicates a clockwise turn between A and B.
     */
    public static angleBetweenDegreesDirectional(a: Vector2D, b: Vector2D): number {
        const angleInRadians = this.angleBetweenRadiansDirectional(a,b);
        const angleInDegrees = Utils.radiansToDegrees(angleInRadians);
        return angleInDegrees;
    }

    /* a.b = |a||b|cos(angle) */
    public static angleWithXAxis(a: Vector2D,b: Vector2D): number {
        const dot = Vector2D.dotProduct(a,b);
        const angle = Math.acos(dot/(a.magnitude()*b.magnitude()));
        return angle;
    }

    public static removeDuplicatePoints(points: Vector2D[]): Vector2D[] {
        const uniquePoints = new Map<string,Vector2D>();
        for (const point of points) {
            const key = point.x + ',' + point.y;
            uniquePoints.set(key,point);
        }
        
        return Array.from(uniquePoints.values());
    }

    public static ccw(start: Vector2D, a: Vector2D, b: Vector2D) : boolean {
        const oa = Vector2D.subtract(a,start);
        const ob = Vector2D.subtract(b,start);
        const angle = Vector2D.angleBetweenRadiansDirectional(oa,ob);
        const isCounterClockwise = (angle > 0);
        return isCounterClockwise;
    }

    public static angleBetweenDegrees(a: Vector2D,b: Vector2D) {
        const angleInRadians = this.angleBetweenRadians(a,b);
        const angleInDegrees = Utils.radiansToDegrees(angleInRadians);
        return angleInDegrees;
    }

    public static angleBetweenRadians(a: Vector2D,b: Vector2D) {
        const dot = Vector2D.dotProduct(a,b);
        const angle = Math.acos(dot/(a.magnitude()*b.magnitude()));
        return angle
    }

    public toString(): string {
        const result = `{${this.x},${this.y}}`;
        return result;
    }
}