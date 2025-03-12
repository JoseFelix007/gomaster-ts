import GoGame from "./game/GoGame";
import GoView from "./view/GoView";

export default class GoController {
  private view: GoView;
  private game: GoGame;

  constructor(id: string, size = 19) {
    this.view = new GoView(id, size);
    this.game = new GoGame(size);

    this.view.onMove((row: number, col: number) => {
      return this.game.handleMove(row, col);
    });
  }
}