import { CellularPottsCell } from "./cellular-potts-cell";

export class CellularPottsModel {

    public static readonly DEFAULT_NUMBER_OF_STATES: number = 4;
    public static readonly DEFAULT_UPDATES_PER_TICK: number = 1000;

    /* Simulation Parameters */
    private numberOfStates: number;
    private updatesPerTick: number;


    /* Data Model Parameters */
    width: number;
    height: number;
    sites: CellularPottsCell[][];
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
        this.numberOfStates = CellularPottsModel.DEFAULT_NUMBER_OF_STATES;
        this.updatesPerTick = CellularPottsModel.DEFAULT_UPDATES_PER_TICK;
    }

    /**
     * Creates the initial lattice without neighbour awareness and returns it
     */
    createInitialSites(): CellularPottsCell[][] {
        const sites: CellularPottsCell[][] = [];

        for (let y = 0; y < this.height; y++) {
            const row: CellularPottsCell[] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = new CellularPottsCell(0);
                row.push(cell);
            }
            sites.push(row);
        }

        return sites;
    }

    populateNeighbourAwareness() {
        console.log("Populating neighbour awareness");
        let xMin = 0;
        let xMax = this.width -1;
        let yMin = 0;
        let yMax = this.height - 1;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let neighbourSet = new Set<CellularPottsCell>();
                const target: CellularPottsCell = this.sites[y][x];
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

    public tick(): void {
        
    }

    public getUpdatesPerTick(): number {
        return this.updatesPerTick;
    }

    public setUpdatesPerTick(updatesPerTick: number): void {
        this.updatesPerTick = updatesPerTick;
    }

    public updateModel(attempts: number) {
        //TODO
    }


    private getFlipProbability(energyDifference: number) {
        //TODO

    }

    private getRandomCell() {
        const xMax: number = this.width - 1;
        const yMax: number = this.height - 1;
        const x = this.randomInteger(0,xMax);
        const y = this.randomInteger(0,yMax);
        const target: CellularPottsCell = this.sites[y][x];
        return target;
    }


    private randomInteger(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

}