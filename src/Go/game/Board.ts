import { IntersectionState } from "./enums/IntersectionState";

export default class Board {
  private _size: number;
  private grid: IntersectionState[][];

  constructor(size = 19) {
    this._size = size;
    this.grid = [];
    this.init();
  }

  get size(): number {
    return this._size;
  }

  public init() {
    for (let row = 0; row < this._size; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this._size; col++) {
        this.grid[row][col] = IntersectionState.Empty;
      }
    }
  }

  public getIntersectionAt(row: number, col: number): IntersectionState {
    return this.grid[row][col];
  }

  public setIntersectionAt(row: number, col: number, state: IntersectionState): void {
    this.grid[row][col] = state;
  }

  public isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  public isIntersectionEmpty(row: number, col: number): boolean {
    return this.getIntersectionAt(row, col) === IntersectionState.Empty;
  }

  public getBoardState(): string {
    return this.grid.reduce((acc: string, row: IntersectionState[]) => {
      return acc + row.reduce((rowStr: string, state: IntersectionState) => {
        return rowStr + state.toString();
      }, "");
    }, "");
  }
}