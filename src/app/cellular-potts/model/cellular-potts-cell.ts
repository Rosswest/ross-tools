export class CellularPottsCell {
    private neighbours: Set<CellularPottsCell>;
    private state: number;

    constructor(state: number) {
        this.state = state;
        this.neighbours = null;
    }

    public getState(): number {
        return this.state;
    }

    
    public setState(state: number): void {
        this.state = state;
    }

    public setNeighbours(neighbours: Set<CellularPottsCell>): void {
        this.neighbours = neighbours;
    }

    public getNeighbours(): Set<CellularPottsCell> {
        return this.neighbours;
    }
}