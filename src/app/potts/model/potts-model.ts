import { PottsCell } from "./potts-cell";
import { PottsModelDynamics } from "./potts-model-dynamics";

export class PottsModel {

    public static readonly BOLTZMANN_CONSTANT: number = 1.38064852e-23;
    public static readonly DEFAULT_TEMPERATURE: number = 0.5;
    public static readonly DEFAULT_INTERACTION_STRENGTH: number = 0.05;
    public static readonly DEFAULT_UPDATES_PER_TICK: number = 1000;
    public static readonly DEFAULT_NUMBER_OF_STATES: number = 4;

    /* Simulation Parameters */
    private temperature: number; // i.e. T
    private boltzmann: number; // i.e. K
    private interactionStrength: number; // i.e. J
    private updatesPerTick: number;
    private numberOfStates: number;
    private dynamics: PottsModelDynamics;

    /* Data Model Parameters */
    width: number;
    height: number;
    sites: PottsCell[][];
    ticks: number;

    constructor(width: number, height: number, numberOfStates: number) {
        this.width =  Math.floor(width);
        this.height =  Math.floor(height);
        this.resetSettings();
        this.numberOfStates = numberOfStates;
        this.ticks = 0;
        this.sites = this.createInitialSites();
        this.populateNeighbourAwareness();
    }

    resetSettings() {
        this.temperature = PottsModel.DEFAULT_TEMPERATURE;
        this.boltzmann = PottsModel.BOLTZMANN_CONSTANT;
        this.interactionStrength = PottsModel.DEFAULT_INTERACTION_STRENGTH;
        this.updatesPerTick = PottsModel.DEFAULT_UPDATES_PER_TICK;
        this.numberOfStates = PottsModel.DEFAULT_NUMBER_OF_STATES;
        this.dynamics = PottsModelDynamics.GLAUBER;
    }

    /**
     * Calculates the total energy of the lattice 
     */
    calculateTotalEnergy() : number {
        let totalEnergy: number = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const target: PottsCell = this.sites[y][x];
                const energy: number = this.calculateCellEnergy(target);
                totalEnergy += energy;
            }
        }
        return totalEnergy;
    }

    calculateCellEnergy(target: PottsCell): number {
        let cellEnergy: number = 0;
        const targetState: number = target.getState();
        const neighbours = target.getNeighbours();
            
        for (const neighbour of neighbours) {
            const neighbourState = neighbour.getState();
            const energyContribution = this.calculateCellPairEnergy(targetState, neighbourState);
            cellEnergy += energyContribution;
        }

        return cellEnergy;
    }

    /**
     * Creates the initial lattice without neighbour awareness and returns it
     */
    createInitialSites(): PottsCell[][] {
        const sites: PottsCell[][] = [];
        for (let y = 0; y < this.height; y++) {
            const row: PottsCell[] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = this.createRandomPottsCell();
                row.push(cell);
            }
            sites.push(row);
        }

        return sites;
    }

    /**
     * Creates an Potts Cell with a random spin (either up or down)
     */
    createRandomPottsCell(): PottsCell {
        const state = this.randomInteger(0, this.numberOfStates-1);
        const cell = new PottsCell(state);
        return cell;

    }

    populateNeighbourAwareness() {
        console.log("Populating neighbour awareness");
        let xMin = 0;
        let xMax = this.width -1;
        let yMin = 0;
        let yMax = this.height - 1;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let neighbourSet = new Set<PottsCell>();
                const target: PottsCell = this.sites[y][x];
                const leftX = (x <= xMin) ? x+1 : x-1;
                const rightX = (x >= xMax) ? x-1 : x+1;
                const topY = (y <= yMin) ? y+1 : y-1;
                const bottomY = (y >= yMax) ? y-1 : y+1;

                const leftCell = this.sites[y][leftX];
                const rightCell = this.sites[y][rightX];
                const topCell = this.sites[topY][x];
                const bottomCell = this.sites[bottomY][x];

                neighbourSet.add(leftCell);
                neighbourSet.add(rightCell);
                neighbourSet.add(topCell);
                neighbourSet.add(bottomCell);

                target.setNeighbours(neighbourSet);
            }
        }
    }

    public getTemperature(): number {
        return this.temperature;
    }

    public setTemperature(temperature: number): void {
        this.temperature = temperature;
    }

    public getBoltzmannConstant(): number {
        return this.boltzmann;
    }

    public setBoltzmannConstant(boltzmann: number): void {
        this.boltzmann = boltzmann;
    }

    public getInteractionStrength(): number {
        return this.interactionStrength;
    }

    public setInteractionStrength(interactionStrength: number): void {
        this.interactionStrength = interactionStrength;
    }

    public getUpdatesPerTick(): number {
        return this.updatesPerTick;
    }

    public setUpdatesPerTick(updatesPerTick: number): void {
        this.updatesPerTick = updatesPerTick;
    }

    public getNumberOfStates(): number {
        return this.numberOfStates;
    }

    public setNumberOfStates(numberOfStates: number): void {
        this.numberOfStates = numberOfStates;
    }

    public setDynamics(dynamics: PottsModelDynamics): void {
        this.dynamics = dynamics;
    }

    public getDynamics(): PottsModelDynamics {
        return this.dynamics;
    }

    public updateModel(attempts: number) {
        switch (this.dynamics) {
            case PottsModelDynamics.GLAUBER:
                this.updateWithGlauberDynamics(attempts);
                break;
            case PottsModelDynamics.KAWASAKI:
                this.updateWithKawasakiDynamics(attempts);
                break;
        }
    }

    /**
     * Attempts to a random cell to its opposite state
     */
    private updateWithGlauberDynamics(attempts: number) {
        for (let i = 0; i < attempts; i++) {

            const cell: PottsCell = this.getRandomCell();

            let neighbourStates = new Set<number>();
            for (let neighbour of cell.getNeighbours()) {
                const state = neighbour.getState();
                neighbourStates.add(state);
            }
    
            let nonIdenticalStates = [];
            for (const state of neighbourStates) {
                if (state !== cell.getState()) {
                    nonIdenticalStates.push(state);
                }
            }
    
            // attempt to flip to the neighbouring state if appropriate
            const hasNonIdenticalNeighbour = (nonIdenticalStates.length > 0);
            if (hasNonIdenticalNeighbour) {
                const chosenIndex = this.randomInteger(0, nonIdenticalStates.length-1);
                const targetState = nonIdenticalStates[chosenIndex];
                const energyDifference = this.getEnergyDifferenceFromFlipingCell(cell, targetState);
                this.attemptGlauberFlip(cell, targetState, energyDifference);
            }
            this.ticks++;
        }
    }

    private attemptGlauberFlip(cell: PottsCell, newState: number, energyDifference: number) {
        const probabilityOfFlip = this.getFlipProbability(energyDifference);

        // attempt the flip
        const roll = Math.random();
        if (roll < probabilityOfFlip) {;
            cell.setState(newState);
        }
        

    }

    private attemptKawasakiFlip(firstCell: PottsCell, secondCell: PottsCell, energyDifference: number) {
        const probabilityOfFlip = this.getFlipProbability(energyDifference);

        // attempt the flip
        const roll = Math.random();
        if (roll < probabilityOfFlip) {
            //swap the states of the two cells
            const firstState = firstCell.getState();
            const secondState = secondCell.getState();
            firstCell.setState(secondState);
            secondCell.setState(firstState);
        }
    }

    private getEnergyDifferenceFromFlipingCell(cell: PottsCell, newState: number) {
        const neighbours = cell.getNeighbours();
        const initialState = cell.getState();
        let initialEnergy: number = 0;
        let flippedEnergy: number = 0;
        
        // calculate the energy difference in the initial and flipped states
        for (const neighbour of neighbours) {
            const neighbourState = neighbour.getState();
            const initialEnergyContribution = this.calculateCellPairEnergy(initialState, neighbourState);
            initialEnergy += initialEnergyContribution;
            const flippedEnergyContribution = this.calculateCellPairEnergy(newState, neighbourState);
            flippedEnergy += flippedEnergyContribution;
        }

        // calculate probability of change given the energy
        const energyDifference = flippedEnergy - initialEnergy;
        return energyDifference;
    }

    private getFlipProbability(energyDifference: number) {
        const beta: number = -1.0 / (this.boltzmann * this.temperature);
        const probability = Math.exp(energyDifference * beta);
        return probability;

    }

    /* Calculates the resulting energy of two adjacent cells */
    private calculateCellPairEnergy(firstState: number, secondState: number) {
        const energy = -1.0 * this.interactionStrength * this.kroneckerDelta(firstState,secondState);
        // console.log("energy calculation", this.interactionStrength, firstState, secondState, energy);
        return energy;
    }
    
    /**
     * Attempts to swap the states of two random cells
     */
    private updateWithKawasakiDynamics(attempts: number) {
        for (let i = 0; i < attempts; i++) {
            // select two random cells to swap the states of (not the same cell)
            let sameCell = true;
            let firstCell: PottsCell = null;
            let secondCell: PottsCell = null;
            while (sameCell) {
                firstCell = this.getRandomCell();
                secondCell = this.getRandomCell();
                sameCell = (firstCell == secondCell);
            }
            
            // don't bother calculating if they both have the same state
            const sameState = (firstCell.getState() == secondCell.getState());
            if (!sameState) {
                const firstCellFlipContribution = this.getEnergyDifferenceFromFlipingCell(firstCell, secondCell.getState());
                const secondCellFlipContribution = this.getEnergyDifferenceFromFlipingCell(secondCell, firstCell.getState());
                const energyDifference = firstCellFlipContribution + secondCellFlipContribution;
                this.attemptKawasakiFlip(firstCell, secondCell, energyDifference);
            }
            
            this.ticks++;
        }
    }

    private getRandomCell() {
        const xMax: number = this.width - 1;
        const yMax: number = this.height - 1;
        const x = this.randomInteger(0,xMax);
        const y = this.randomInteger(0,yMax);
        const target: PottsCell = this.sites[y][x];
        return target;
    }


    private randomInteger(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    kroneckerDelta(firstState: number, secondState: number) {
        if (firstState == secondState) {
            return 1;
        } else {
            return -1;
        }
    }

}