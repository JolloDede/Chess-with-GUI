import { Board } from "./board";
import Game from "./game";

var board: Board;
export var images: HTMLImageElement[] = [];

export class App{
    private _game: Game;

    constructor(game: Game){
        this._game = game;
    }

    public setup(){
        for (var i = 1; i < 10; i++) {
            images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
        }
        for (var i = 10; i < 13; i++) {
            images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
        }
        board = new Board();

        this.gameLoop();
    }

    private gameLoop(): void{
        requestAnimationFrame(this.gameLoop.bind(this));
        this._game.render();
    }
}

function loadImage(src: string): HTMLImageElement{
    var image: HTMLImageElement;
    image = new Image();
    image.src = src;
    return image;
}

export interface IVector{
    x: number;
    y: number;
}

export function createVector(x: number, y: number){
    return {x: x, y: y} as IVector
}