import { Utils } from "src/app/shared/utils";
import { IsingCell } from "./ising-cell";
import { IsingModelDynamics } from "./ising-model-dynamics";
import { IsingState } from "./ising-state";

export class IsingModel {

    public static readonly BOLTZMANN_CONSTANT: number = 1.38064852e-23;
    public static readonly DEFAULT_TEMPERATURE: number = 0.5;
    public static readonly DEFAULT_INTERACTION_STRENGTH: number = 0.05;
    public static readonly DEFAULT_UPDATES_PER_TICK: number = 1000;

    /* Simulation Parameters */
    private temperature: number; // i.e. T
    private boltzmann: number; // i.e. K
    private interactionStrength: number; // i.e. J
    private updatesPerTick: number;
    private dynamics: IsingModelDynamics;

    /* Data Model Parameters */
    width: number;
    height: number;
    sites: IsingCell[][];
    ticks: number;

    constructor(width: number, height: number) {
        this.width =  Math.floor(width);
        this.height =  Math.floor(height);
        this.resetSettings();
        this.ticks = 0;
        this.sites = this.createInitialSites();
        this.populateNeighbourAwareness();
    }

    resetSettings() {
        this.temperature = IsingModel.DEFAULT_TEMPERATURE;
        this.boltzmann = IsingModel.BOLTZMANN_CONSTANT;
        this.interactionStrength = IsingModel.DEFAULT_INTERACTION_STRENGTH;
        this.updatesPerTick = IsingModel.DEFAULT_UPDATES_PER_TICK;
        this.dynamics = IsingModelDynamics.GLAUBER;
    }

    /**
     * Calculates the total energy of the lattice 
     */
    calculateTotalEnergy() : number {
        let totalEnergy: number = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const target: IsingCell = this.sites[y][x];
                const energy: number = this.calculateCellEnergy(target);
                totalEnergy += energy;
            }
        }

        return totalEnergy;
    }

    calculateCellEnergy(target: IsingCell): number {
        let cellEnergy: number = 0;
        const targetState: IsingState = target.getState();
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
    createInitialSites(): IsingCell[][] {
        const sites: IsingCell[][] = [];

        for (let y = 0; y < this.height; y++) {
            const row: IsingCell[] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = this.createRandomIsingCell();
                row.push(cell);
            }
            sites.push(row);
        }

        return sites;
    }

    /**
     * Creates an Ising Cell with a random spin (either up or down)
     */
    createRandomIsingCell(): IsingCell {
        let cellState = IsingState.UP;
        let r = Math.random();
        if (r < 0.5) {
            cellState = IsingState.DOWN;
        }

        const cell = new IsingCell(cellState);
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
                let neighbourSet = new Set<IsingCell>();
                const target: IsingCell = this.sites[y][x];
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

    public setDynamics(dynamics: IsingModelDynamics): void {
        this.dynamics = dynamics;
    }

    public getDynamics(): IsingModelDynamics {
        return this.dynamics;
    }

    public updateModel(attempts: number) {
        switch (this.dynamics) {
            case IsingModelDynamics.GLAUBER:
                console.log("glauber");
                this.updateWithGlauberDynamics(attempts);
                break;
            case IsingModelDynamics.KAWASAKI:
                console.log("kawasaki");
                this.updateWithKawasakiDynamics(attempts);
                break;
        }
    }

    /**
     * Attempts to a random cell to its opposite state
     */
    private updateWithGlauberDynamics(attempts: number) {
        for (let i = 0; i < attempts; i++) {

            // calculate probability of change given the energy
            const target: IsingCell = this.getRandomCell();
            const energyDifference = this.getEnergyDifferenceFromFlipingCell(target);
            this.attemptGlauberFlip(target, energyDifference);
            this.ticks++;
        }
    }

    private attemptGlauberFlip(cell: IsingCell, energyDifference: number) {
        const probabilityOfFlip = this.getFlipProbability(energyDifference);

        // attempt the flip
        const roll = Math.random();
        if (roll < probabilityOfFlip) {
            const flippedState = this.getFlippedState(cell.getState());
            cell.setState(flippedState);
        }
    }

    private attemptKawasakiFlip(firstCell: IsingCell, secondCell: IsingCell, energyDifference: number) {
        const probabilityOfFlip = this.getFlipProbability(energyDifference);

        // attempt the flip
        const roll = Math.random();
        if (roll < probabilityOfFlip) {
            //swap the states of the two cells
            const firstState = firstCell.getState();
            const secondState = secondCell.getState();
            firstCell.setState(this.getFlippedState(firstState));
            secondCell.setState(this.getFlippedState(secondState));
        }
    }

    private getEnergyDifferenceFromFlipingCell(cell: IsingCell) {
        const neighbours = cell.getNeighbours();
        const initialState = cell.getState();
        const flippedState = this.getFlippedState(initialState);
        let initialEnergy: number = 0;
        let flippedEnergy: number = 0;
        
        // calculate the energy difference in the initial and flipped states
        for (const neighbour of neighbours) {
            const neighbourState = neighbour.getState();
            const initialEnergyContribution = this.calculateCellPairEnergy(initialState, neighbourState);
            initialEnergy += initialEnergyContribution;
            const flippedEnergyContribution = this.calculateCellPairEnergy(flippedState, neighbourState);
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
    private getFlippedState(state: IsingState) {
        switch (state) {
            case IsingState.UP:
                return IsingState.DOWN;
            case IsingState.DOWN:
                return IsingState.UP;
        }
    }

    /* Calculates the resulting energy of two adjacent cells */
    private calculateCellPairEnergy(firstState: IsingState, secondState: IsingState) {
        const energy = -1.0 * this.interactionStrength * firstState * secondState;
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
            let firstCell: IsingCell = null;
            let secondCell: IsingCell = null;
            while (sameCell) {
                firstCell = this.getRandomCell();
                secondCell = this.getRandomCell();
                sameCell = (firstCell == secondCell);
            }
            
            // don't bother calculating if they both have the same state
            const sameState = (firstCell.getState() == secondCell.getState());
            if (!sameState) {
                const firstCellFlipContribution = this.getEnergyDifferenceFromFlipingCell(firstCell);
                const secondCellFlipContribution = this.getEnergyDifferenceFromFlipingCell(secondCell);
                const energyDifference = firstCellFlipContribution + secondCellFlipContribution;
                this.attemptKawasakiFlip(firstCell, secondCell, energyDifference);
            }
            
            this.ticks++;
        }
    }

    private getRandomCell() {
        const xMax: number = this.width - 1;
        const yMax: number = this.height - 1;
        const x = Utils.randomInteger(0,xMax);
        const y = Utils.randomInteger(0,yMax);
        const target: IsingCell = this.sites[y][x];
        return target;
    }

}