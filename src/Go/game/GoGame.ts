import Board from "./Board";
import { Color } from "./enums/Color";
import { IntersectionState } from "./enums/IntersectionState";

export default class GoGame {
  private board: Board;
  private turn: Color;
  private history: string[];

  constructor(size = 19) {
    this.board = new Board(size);
    this.turn = Color.Black;
    this.history = [];
  }

  public switchTurn() {
    this.turn = this.turn === Color.White ? Color.Black : Color.White;
  }

  public handleMove(row: number, col: number): { done: boolean, turn: string, captured: { row: number, col: number }[], error?: string } {
    if (!this.board.isIntersectionEmpty(row, col)) {
      return {
        done: false,
        turn: this.turn.toString(),
        captured: [],
        error: '',
      };
    }

    if (this.isSuicide(row, col)) {
      return {
        done: false,
        turn: this.turn.toString(),
        captured: [],
        error: 'suicide',
      };
    }

    const state = this.turn === Color.Black ? IntersectionState.Black : IntersectionState.White;
    this.board.setIntersectionAt(row, col, state);

    const captured = this.captureBy(row, col);
    if (captured.length > 0) {
      captured.forEach(pos => {
        this.board.setIntersectionAt(pos.row, pos.col, IntersectionState.Empty);
      });
    }

    if (this.isKoRestricted()) {
      this.board.setIntersectionAt(row, col, IntersectionState.Empty);
      captured.forEach(pos => {
        this.board.setIntersectionAt(pos.row, pos.col, this.turn === Color.Black ? IntersectionState.White : IntersectionState.Black);
      });

      return {
        done: false,
        turn: this.turn.toString(),
        captured: [],
        error: 'ko'
      };
    }

    this.history.push(this.board.getBoardState());
    this.switchTurn();
    return {
      done: true,
      turn: this.turn.toString(),
      captured: captured
    };
  }

  public isSuicide(row: number, col: number): boolean {
    const state = this.turn === Color.Black ? IntersectionState.Black : IntersectionState.White;
    this.board.setIntersectionAt(row, col, state);

    const group = this.getGroup(row, col);
    if (this.countLiberties(group) === 0) {
      const captured = this.captureBy(row, col);
      this.board.setIntersectionAt(row, col, IntersectionState.Empty);

      if (captured.length === 0) {
        return true;
      }
    }

    this.board.setIntersectionAt(row, col, IntersectionState.Empty);
    return false;
  }

  public captureBy(row: number, col: number): { row: number, col: number }[] {
    const opponent = this.turn === Color.Black ? IntersectionState.White : IntersectionState.Black;
    const captured: { row: number, col: number }[] = [];
    const directions = [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 }
    ];

    for (const dir of directions) {
      const nr = row + dir.dr;
      const nc = col + dir.dc;

      if (this.board.isWithinBounds(nr, nc) && this.board.getIntersectionAt(nr, nc) === opponent) {
        const group = this.getGroup(nr, nc);
        if (this.countLiberties(group) === 0) {
          captured.push(...group);
        }
      }
    }

    return captured;
  }

  private getGroup(row: number, col: number): { row: number, col: number }[] {
    const color = this.board.getIntersectionAt(row, col);
    const group: { row: number, col: number }[] = [];
    const visited = new Set<string>();
    const directions = [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 }
    ];

    const stack: { row: number, col: number }[] = [{ row, col }];
    while (stack.length > 0) {
      const { row, col } = stack.pop()!;
      const key = `${row}${col}`;
      if (visited.has(key)) continue;

      visited.add(key);
      group.push({ row, col });

      for (const { dr, dc } of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (this.board.isWithinBounds(nr, nc) && this.board.getIntersectionAt(nr, nc) === color) {
          stack.push({ row: nr, col: nc });
        }
      }
    }

    return group;
  }

  private countLiberties(group: { row: number, col: number }[]): number {
    let liberties = 0;
    const visited = new Set<string>();
    const directions = [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 }
    ];

    for (const { row, col } of group) {
      for (const { dr, dc } of directions) {
        const nr = row + dr;
        const nc = col + dc;
        const key = `${nr}${nc}`;

        if (this.board.isWithinBounds(nr, nc) && this.board.getIntersectionAt(nr, nc) === IntersectionState.Empty && !visited.has(key)) {
          visited.add(key);
          liberties++;
        }
      }
    }

    return liberties;
  }

  private isKoRestricted(): boolean {
    if (this.history.length < 1) {
      return false;
    }

    const previousState = this.history[this.history.length - 2];
    const currentState = this.board.getBoardState();

    return previousState === currentState;
  }
}