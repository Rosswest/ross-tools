export class Utils {
    public static exclusiveOr(a: boolean, b: boolean): boolean {
        const result = (a || b) && !(a && b);
        return result;
    }

    public static getArrayWithoutElements(base: any[], toRemove: any[]) {
        const result = [];
        for (const item of base) {
            if (toRemove.indexOf(item) < 0) {
                result.push(item);
            }
        }
        return result;
    }

    public static appendArrayToArray(base: any[], toAppend: any[]) {
        for (const item of toAppend) {
            base.push(item);
        }
    }

    public static copyArray(array: any[]) {
        const result = [];
        for (const item of array) {
            result.push(item);
        }
        return result;
    }

    public static randomInteger(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}