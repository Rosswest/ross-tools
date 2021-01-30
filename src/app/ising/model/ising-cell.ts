import { IsingState } from "./ising-state";

export class IsingCell {

    private neighbours: Set<IsingCell>;
    private state: IsingState;

    constructor(state: IsingState) {
        this.state = state;
        this.neighbours = null;
    }

    public getState(): IsingState {
        return this.state;
    }

    
    public setState(state: IsingState): void {
        this.state = state;
    }

    public setNeighbours(neighbours: Set<IsingCell>): void {
        this.neighbours = neighbours;
    }

    public getNeighbours(): Set<IsingCell> {
        return this.neighbours;
    }
}