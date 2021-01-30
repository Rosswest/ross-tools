import { SirsCell } from "./sirs-cell";
import { SirsModelConfiguration } from "./sirs-model-configuration";
import { SirsState } from "./sirs-state";

export class SirsModel {

    public static readonly DEFAULT_UPDATES_PER_TICK: number = 1000;
    
    /* Simulation Parameters */
    config: SirsModelConfiguration;
    private probabilityMap: Map<SirsState, number>  = new Map<SirsState, number>();
    private nextStateMap: Map<SirsState, SirsState> = new Map<SirsState, SirsState>();
    private updatesPerTick: number;

    /* Data Model Parameters */
    width: number;
    height: number;
    sites: SirsCell[][];
    ticks: number;

    constructor(width: number, height: number, config: SirsModelConfiguration) {
        this.config = config;
        this.width =  Math.floor(width);
        this.height =  Math.floor(height);
        this.initStateMaps();
        this.ticks = 0;
        this.sites = this.createInitialSites();
        this.populateSitesFromConfig();
        this.populateNeighbourAwareness();
    }

    initStateMaps() {

        this.updateProbabilityMaps();

        // next state map
        this.nextStateMap.set(SirsState.SUSCEPTIBLE, SirsState.INFECTED); // S -> I
        this.nextStateMap.set(SirsState.INFECTED, SirsState.RECOVERED); // I -> R
        this.nextStateMap.set(SirsState.RECOVERED, SirsState.SUSCEPTIBLE); // R -> S
    }

    updateProbabilityMaps() {
        // probability map
        this.probabilityMap.set(SirsState.SUSCEPTIBLE, this.config.susceptibleToInfectedProbability); // S -> I
        this.probabilityMap.set(SirsState.INFECTED, this.config.infectedToRecoveredProbability); // I -> R
        this.probabilityMap.set(SirsState.RECOVERED, this.config.recoveredToSusceptibleProbability); // R -> S
    }
    resetSettings() {
        this.config.reset();
        this.updatesPerTick = SirsModel.DEFAULT_UPDATES_PER_TICK;
    }

    /**
     * Creates the initial lattice without neighbour awareness and returns it
     */
    createInitialSites(): SirsCell[][] {
        const sites: SirsCell[][] = [];

        for (let y = 0; y < this.height; y++) {
            const row: SirsCell[] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = new SirsCell(SirsState.SUSCEPTIBLE);
                row.push(cell);
            }
            sites.push(row);
        }

        return sites;
    }

    populateSitesFromConfig() {
        const unassigned: Set<SirsCell> = new Set<SirsCell>();
        for (const cells of this.sites) {
            for (const cell of cells) {
                unassigned.add(cell);
            }
        }
        console.log("unassigned", unassigned);

        const cellCount = this.width * this.height;

        // calculate weighting
        let totalWeight: number = 0;
        const immuneWeight = this.config.initialImmuneWeight;
        const susceptibleWeight = this.config.initialSusceptibleWeight;
        const infectedWeight = this.config.initialInfectedWeight;
        const recoveredWeight = this.config.initialRecoveredWeight;
        totalWeight += immuneWeight + susceptibleWeight + infectedWeight + recoveredWeight;
        // convert weighting to state counts
        const immuneCount = Math.floor(cellCount * immuneWeight / totalWeight);
        const susceptibleCount = Math.floor(cellCount * susceptibleWeight / totalWeight);
        const infectedCount = Math.floor(cellCount * infectedWeight / totalWeight);
        const recoveredCount = Math.floor(cellCount * recoveredWeight / totalWeight);
        
        console.log("immune", immuneWeight, immuneCount);
        console.log("sus", susceptibleWeight, susceptibleCount);
        console.log("inf", infectedWeight, infectedCount);
        console.log("rec", recoveredWeight, recoveredCount);

        // assign states based on counts
        this.populateUnassignedCellsWithState(immuneCount, SirsState.IMMUNE, unassigned);
        this.populateUnassignedCellsWithState(susceptibleCount, SirsState.SUSCEPTIBLE, unassigned);
        this.populateUnassignedCellsWithState(infectedCount, SirsState.INFECTED, unassigned);
        this.populateUnassignedCellsWithState(recoveredCount, SirsState.RECOVERED, unassigned);

        console.log("unassigned", unassigned);
        // assign any remaining as susceptible
        for (const cell of unassigned) {
            cell.setState(SirsState.SUSCEPTIBLE);
        }
    }

    populateUnassignedCellsWithState(count: number, state: SirsState, unassigned: Set<SirsCell>) {
        for (let i = 0; i < count; i++) {
            this.populateUnassignedCellWithState(state, unassigned);
        }
    }

    populateUnassignedCellWithState(state: SirsState, unassigned: Set<SirsCell>) {
        let asArray = Array.from(unassigned);
        const result: SirsCell = asArray[Math.floor(Math.random() * asArray.length)];
        result.setState(state);
        unassigned.delete(result);
        return result;
    }

    populateNeighbourAwareness() {
        console.log("Populating neighbour awareness");
        let xMin = 0;
        let xMax = this.width -1;
        let yMin = 0;
        let yMax = this.height - 1;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let neighbourSet = new Set<SirsCell>();
                const target: SirsCell = this.sites[y][x];
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

    public getUpdatesPerTick(): number {
        return this.updatesPerTick;
    }

    public setUpdatesPerTick(updatesPerTick: number): void {
        this.updatesPerTick = updatesPerTick;
    }

    public getSIProbability() {
        return this.config.susceptibleToInfectedProbability;
    }

    public getIRProbability() {
        return this.config.infectedToRecoveredProbability;
    }

    public getRSProbability() {
        return this.config.recoveredToSusceptibleProbability;
    }

    public setConfig(config: SirsModelConfiguration) {
        this.config = config;
        this.updateProbabilityMaps();
    }

    public updateModel(attempts: number) {
        this.updateCells(attempts);
    }

    /**
     * Attempts to a random cell to its opposite state
     */
    private updateCells(attempts: number) {
        for (let i = 0; i < attempts; i++) {
            const target: SirsCell = this.getRandomCell();
            const neighbours = target.getNeighbours();
            const initialState: SirsState = target.getState();
            if (initialState == SirsState.SUSCEPTIBLE ) {
                const hasInfectedNeighbour = this.hasInfectedCells(neighbours);
                if (hasInfectedNeighbour) {
                    this.attemptAdvancementOnCell(target);
                }
            } else {
                this.attemptAdvancementOnCell(target);
            }
            
            this.ticks++;
        }
    }

    attemptAdvancementOnCell(cell: SirsCell) {
        const initialState: SirsState = cell.getState();
        // calculate probability of advancing to next state
        const probabilityOfFlip = this.getCellTransitionProbability(initialState);
        // attempt the advancement
        const roll = Math.random();
        if (roll < probabilityOfFlip) {
            const nextState = this.nextStateMap.get(initialState);
            cell.setState(nextState);
        }
    }
    hasInfectedCells(cells: Set<SirsCell>) {
        for (const target of cells) {
            const targetState: SirsState = target.getState();
            if (targetState == SirsState.INFECTED) {
                return true;
            }
        }

        return false;
    }
    
    getCellTransitionProbability(state: SirsState) {
        return this.probabilityMap.get(state);
    }

    private getRandomCell() {
        const xMax: number = this.width - 1;
        const yMax: number = this.height - 1;
        const x = this.randomInteger(0,xMax);
        const y = this.randomInteger(0,yMax);
        const target: SirsCell = this.sites[y][x];
        return target;
    }


    private randomInteger(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

}