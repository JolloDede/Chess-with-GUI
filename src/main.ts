import { Board } from "./board";
import Game from "./game";

export var board: Board;
export var images: HTMLImageElement[] = [];

export class App {
    private _game: Game;

    constructor(game: Game) {
        this._game = game;
    }

    public setup() {
        for (var i = 1; i < 10; i++) {
            images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
        }
        for (var i = 10; i < 13; i++) {
            images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
        }
        board = new Board();

        this.gameLoop();
    }

    private gameLoop(): void {
        requestAnimationFrame(this.gameLoop.bind(this));
        this._game.render();
    }

    public getGame(): Game{
        return this._game;
    }
}

function loadImage(src: string): HTMLImageElement {
    let image: HTMLImageElement;
    
    image = new Image();
    image.src = src;
    return image;
}