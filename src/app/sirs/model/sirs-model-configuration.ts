export class SirsModelConfiguration {

    public static readonly DEFAULT_SUSCEPTIBLE_TO_INFECTED_PROBABILITY = 0.7;
    public static readonly DEFAULT_INFECTED_TO_RECOVERED_PROBABILITY = 0.6
    public static readonly DEFAULT_RECOVERED_TO_SUSCEPTIBLE_PROBABILITY = 0.1;

    susceptibleToInfectedProbability: number;
    infectedToRecoveredProbability: number;
    recoveredToSusceptibleProbability: number;

    initialSusceptibleWeight: number = 100;
    initialInfectedWeight: number = 1;
    initialRecoveredWeight: number = 0 ;
    initialImmuneWeight: number = 0;

    constructor() {
       this.reset();
    }

    reset() {
        this.susceptibleToInfectedProbability = SirsModelConfiguration.DEFAULT_SUSCEPTIBLE_TO_INFECTED_PROBABILITY;
        this.infectedToRecoveredProbability = SirsModelConfiguration.DEFAULT_INFECTED_TO_RECOVERED_PROBABILITY;
        this.recoveredToSusceptibleProbability = SirsModelConfiguration.DEFAULT_RECOVERED_TO_SUSCEPTIBLE_PROBABILITY;
    }
}