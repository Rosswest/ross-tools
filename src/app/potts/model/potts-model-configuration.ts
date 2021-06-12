export class PottsModelConfiguration {
    temperature: number;
    boltzmann: number;
    interactionStrength: number;

    constructor(temperature: number, boltzmann: number, interactionStrength: number) {
        this.temperature = temperature;
        this.boltzmann = boltzmann;
        this.interactionStrength = interactionStrength;
    }
}