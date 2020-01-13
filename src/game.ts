import { canvas } from "./click";
import { board } from "./main";
import { Board } from "./board";
import { Piece } from "./piece";

export var tileSize: number;

export default class Game {
    ctx: CanvasRenderingContext2D;

    constructor() {
        this.startGameLog();
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (canvas.height == canvas.width) {
            tileSize = canvas.height / 8;
        }
    }

    public render() {
        console.log("Render");
        this.showGrid();
        // board.show();
        this.showPieces();
    }

    private showGrid() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        for (let i = 0; i < 8; i++) {
            for (let ii = 0; ii < 8; ii++) {
                if ((i + ii) % 2 == 0) {
                    this.ctx.rect(i * tileSize, ii * tileSize, tileSize, tileSize);
                } else {
                    this.ctx.fillRect(i * tileSize, ii * tileSize, tileSize, tileSize);
                }
            }
        }
        this.ctx.beginPath();
        this.ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    private showPieces() {
        this.ctx.beginPath();
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        for (let i = 0; i < board.whitePieces.length; i++) {
            this.ctx.fillText(board.whitePieces[i].letter, board.whitePieces[i].pixelPositon.x, board.whitePieces[i].pixelPositon.y);
        }
        this.ctx.beginPath();
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "blue";
        this.ctx.textAlign = "center";
        for (let i = 0; i < board.blackPieces.length; i++) {
            this.ctx.fillText(board.blackPieces[i].letter, board.blackPieces[i].pixelPositon.x, board.blackPieces[i].pixelPositon.y);
        }
    }

    private startGameLog() {
        let name: string;
        let ai: string;
        let color: string;
        let el: HTMLSelectElement;
        let rEl: any;
        color = "";
        name = (<HTMLInputElement>document.getElementById("Username")).value;
        el = (document.getElementById("AI-Selection") as HTMLSelectElement);
        ai = (<HTMLOptionElement>el.options[el.selectedIndex]).value;
        rEl = document.getElementsByName("Color");
        if (rEl.checked) {
            color = rEl.value as string;
        }
        console.log("Welcome " + name + " you 're playing against " + ai + " you have the " + color + " Pieces");
    }
}