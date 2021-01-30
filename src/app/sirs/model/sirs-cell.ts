import { SirsState } from "./sirs-state";

export class SirsCell {

    private neighbours: Set<SirsCell>;
    private state: SirsState;

    constructor(state: SirsState) {
        this.state = state;
        this.neighbours = null;
    }

    public getState(): SirsState {
        return this.state;
    }

    
    public setState(state: SirsState): void {
        this.state = state;
    }

    public setNeighbours(neighbours: Set<SirsCell>): void {
        this.neighbours = neighbours;
    }

    public getNeighbours(): Set<SirsCell> {
        return this.neighbours;
    }
}