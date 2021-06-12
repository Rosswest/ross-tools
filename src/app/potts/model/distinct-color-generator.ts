export class DistinctColorGenerator {

    center = 128;
    width = 127;
    redFrequency = 2.4;
    greenFrequency = 2.4;
    blueFrequency = 2.4;
    redPhase = 0;
    greenPhase = 2;
    bluePhase = 4;
    
    constructor() {}

    /**
     * Generates a number of distinct colors using sine waves
     * @param numberOfColors Number of colors to generate
     * @returns A list of (hopefully) visually distinct colors
     */
    public generateColors(numberOfColors: number) {
        const colors = [];

        for (let i = 0; i < numberOfColors; ++i) {
            const r = Math.sin(this.redFrequency * i + this.redPhase) * this.width + this.center;
            const g = Math.sin(this.greenFrequency * i + this.greenPhase) * this.width + this.center;
            const b = Math.sin(this.blueFrequency * i + this.bluePhase) * this.width + this.center;
            const colorString = 'rgb(' + r + ',' + g + ',' + b + ')';
            colors.push(colorString);
        }

        console.log(colors);
        return colors;
    }
}