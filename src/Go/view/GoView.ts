import Marker from "./Marker";

type MoveCallback = (row: number, col: number) => { done: boolean, turn: string, captured: { row: number, col: number }[], error?: string };

export default class GoView {
  private element: HTMLElement;
  private marker: Marker;
  private size: number;
  private turn: string;
  private onMoveCallback: MoveCallback | null = null;

  private STARS: { [key: number]: { row: number; col: number }[] } = {
    9: [
      { row: 2, col: 2 },
      { row: 2, col: 6 },
      { row: 6, col: 2 },
      { row: 6, col: 6 },
      { row: 4, col: 4 }
    ],
    13: [
      { row: 3, col: 3 },
      { row: 3, col: 9 },
      { row: 9, col: 3 },
      { row: 9, col: 9 },
      { row: 6, col: 6 }
    ],
    19: [
      { row: 3, col: 3 },
      { row: 3, col: 9 },
      { row: 3, col: 15 },
      { row: 9, col: 3 },
      { row: 9, col: 9 },
      { row: 9, col: 15 },
      { row: 15, col: 3 },
      { row: 15, col: 9 },
      { row: 15, col: 15 }
    ]
  };

  constructor(id: string, size = 19) {
    const parent = document.getElementById(id);
    if (parent === null) {
      throw new Error('Element not found');
    }

    this.element = document.createElement("div");
    this.element.id = "game";
    parent.appendChild(this.element);

    this.size = size;
    this.turn = 'black';

    this.render();
    this.addEventListeners();

    this.marker = new Marker();
    this.marker.render(parent);
  }

  public render() {
    this.element.className = `board size-${this.size}`;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const square = this.renderSquare(row, col);
        this.element.appendChild(square);
      }
    }
  }

  public renderSquare(row: number, col: number): HTMLElement {
    const square = document.createElement("div");
    let classes = "square";

    if (row === 0 && col === 0) {
      classes += " square-top-left";
    } else if (row === 0 && col === this.size - 1) {
      classes += " square-top-right";
    } else if (row === this.size - 1 && col === 0) {
      classes += " square-bottom-left";
    } else if (row === this.size - 1 && col === this.size - 1) {
      classes += " square-bottom-right";
    } else if (row === 0) {
      classes += " square-top";
    } else if (row === this.size - 1) {
      classes += " square-bottom";
    } else if (col === 0) {
      classes += " square-left";
    } else if (col === this.size - 1) {
      classes += " square-right";
    } else {
      classes += " square-center";
    }

    const symbols = document.createElement("div");
    symbols.className = "symbols";
    square.appendChild(symbols);

    const starPositions: { row: number; col: number }[] = this.STARS[this.size];
    if (starPositions.some((pos) => pos.row === row && pos.col === col)) {
      const star = document.createElement("div");
      star.className = "star";
      square.appendChild(star);
    }

    square.className = classes;
    square.dataset.row = row.toString();
    square.dataset.col = col.toString();

    return square;
  }

  public renderStone(color: string): HTMLElement {
    const stone = document.createElement("div");
    stone.className = `stone ${color}`;
    return stone;
  }

  public renderIllegalSymbol(square: HTMLElement): void {
    const symbols = square.querySelector(".symbols");
    symbols?.classList.add('illegal');
  }

  public removeStone(row: number, col: number): void {
    const square = this.element.querySelector(`[data-row="${row}"][data-col="${col}"]`)!;
    const stone = square.querySelector(".stone");
    stone?.remove();
  }

  public addEventListeners(): void {
    this.element.addEventListener("click", this.onClick.bind(this));
  }

  public onMove(callback: MoveCallback): void {
    this.onMoveCallback = callback;
  }

  public onClick(e: MouseEvent): void {
    const symbols = document.querySelectorAll(".symbols");
    for (const symbol of symbols) {
      symbol.classList.remove('illegal');
    }

    const target = e.target as HTMLElement;
    if (target.querySelector(".stone")) {
      return;
    }

    const result = this.onMoveCallback!(
      parseInt(target.dataset.row!),
      parseInt(target.dataset.col!)
    );

    if (!result.done) {
      console.log(result.error);
      this.renderIllegalSymbol(target);
      return;
    }

    const stone = this.renderStone(this.turn);
    target.appendChild(stone);

    this.turn = result.turn;
    for (const { row, col } of result.captured) {
      this.removeStone(row, col);
    }

    this.marker.addMessage(`Juegan ${this.turn === 'white' ? 'blancas' : 'negras'}`);
  }
}