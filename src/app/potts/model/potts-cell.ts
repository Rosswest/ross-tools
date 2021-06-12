export class PottsCell {

    private neighbours: Set<PottsCell>;
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

    public setNeighbours(neighbours: Set<PottsCell>): void {
        this.neighbours = neighbours;
    }

    public getNeighbours(): Set<PottsCell> {
        return this.neighbours;
    }
}