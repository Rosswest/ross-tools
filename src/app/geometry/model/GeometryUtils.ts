import { Edge2D } from "./edge-2d";
import { Vector2D } from "./vector2D";

export class GeometryUtils {
    public static getUniqueEdges(edges: Edge2D[]): Edge2D[] {
        const unique = new Map<string,Edge2D>();

        for (const edge of edges) {
            const startDiff = Vector2D.subtract(edge.start,Vector2D.ORIGIN);
            const endDiff = Vector2D.subtract(edge.end,Vector2D.ORIGIN);
            const startMag = startDiff.magnitude();
            const endMag = endDiff.magnitude();
            const firstVector = (startMag < endMag) ? edge.start : edge.end;
            const secondVector = (startMag < endMag) ? edge.end : edge.start;
            const edgeKey = firstVector.x + ',' + firstVector.y + ':' + secondVector.x + ',' + secondVector.y;
            console.log(edgeKey);
            if (!unique.has(edgeKey)) {
                unique.set(edgeKey,edge);
            } else {
                console.log("removing duplicate", edge);
            }
        }

        return Array.from(unique.values());
    }

    public static removeEdgesWithSameStartAndEnd(edges: Edge2D[]): Edge2D[] {
        const result = [];
        for (const edge of edges) {
            if (edge.start != edge.end) {
                result.push(edge);
            }
        }
        return result;
    }

    
}