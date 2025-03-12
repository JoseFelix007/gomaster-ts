
export default class Marker {
  private id: string;
  private element: HTMLElement;

  constructor(id = "marker") {
    this.id = id;

    this.element = document.createElement("div");
    this.element.id = this.id;
    this.element.className = "marker";
  }

  public render(element: HTMLElement) {
    this.element.appendChild(this.renderPlayers());
    this.element.appendChild(this.renderActions());
    this.element.appendChild(this.renderStatus());
    this.element.appendChild(this.renderChat());

    element.appendChild(this.element);
  }

  private renderPlayers(): HTMLElement {
    const players = document.createElement("div");
    players.className = "players";

    const white = document.createElement("div");
    white.className = "white";
    white.appendChild(document.createTextNode("Blancas"));
    players.appendChild(white);

    const black = document.createElement("div");
    black.className = "black";
    black.appendChild(document.createTextNode("Negras"));
    players.appendChild(black);

    return players;
  }

  private renderActions(): HTMLElement {
    const actions = document.createElement("div");
    actions.className = "actions";

    const startButton = document.createElement("button");
    startButton.className = "btn btn-start";
    startButton.appendChild(document.createTextNode("Iniciar"));
    actions.appendChild(startButton);

    const resetButton = document.createElement("button");
    resetButton.className = "btn btn-reset";
    resetButton.appendChild(document.createTextNode("Reiniciar"));
    actions.appendChild(resetButton);

    const passButton = document.createElement("button");
    passButton.className = "btn btn-pass";
    passButton.appendChild(document.createTextNode("Pasar"));
    actions.appendChild(passButton);

    return actions;
  }

  private renderStatus(): HTMLElement {
    const status = document.createElement("div");
    status.className = "status";
    status.appendChild(document.createTextNode("Juegan negras"));
    return status;
  }

  private renderChat(): HTMLElement {
    const chat = document.createElement("div");
    chat.className = "chat";

    return chat;
  }

  public addMessage(message: string): void {
    const status = this.element.querySelector(".status")!;
    status.textContent = "";
    status.appendChild(document.createTextNode(message));
  }
}