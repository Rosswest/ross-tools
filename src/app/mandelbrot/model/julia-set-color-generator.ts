export class JuliaSetColorGenerator {

    center = 128;
    width = 127;
    redFrequency = 2.4;
    greenFrequency = 2.4;
    blueFrequency = 2.4;
    redPhase = 1;
    greenPhase = 2;
    bluePhase = 3;

    public generateColor(i: number, opacity: number) {
        i = i / 2;
        const r = Math.sin(this.redFrequency * i + this.redPhase) * this.width + this.center;
        const g = Math.sin(this.greenFrequency * i + this.greenPhase) * this.width + this.center;
        const b = Math.sin(this.blueFrequency * i + this.bluePhase) * this.width + this.center;
        const colorString = 'rgb(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        return colorString;
    }
}