import { canvas, mouseX, mouseY } from "./click";
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
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.showGrid();
        this.showPiecesAsText();
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

    private showPiecesAsText() {
        this.ctx.beginPath();
        this.ctx.font = "bold 40px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.stroke();
        this.ctx.strokeStyle = "black";
        for (let i = 0; i < board.whitePieces.length; i++) {
            if (board.whitePieces[i].movingThisPiece) {
                this.ctx.fillText(board.whitePieces[i].letter, mouseX, mouseY);
                this.ctx.strokeText(board.whitePieces[i].letter, mouseX, mouseY);
            } else {
                this.ctx.fillText(board.whitePieces[i].letter, board.whitePieces[i].pixelPositon.x, board.whitePieces[i].pixelPositon.y);
                this.ctx.strokeText(board.whitePieces[i].letter, board.whitePieces[i].pixelPositon.x, board.whitePieces[i].pixelPositon.y);
            }
        }
        this.ctx.beginPath();
        this.ctx.font = "bold 40px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.stroke();
        this.ctx.strokeStyle = "white";
        for (let i = 0; i < board.blackPieces.length; i++) {
            if (board.blackPieces[i].movingThisPiece) {
                this.ctx.fillText(board.blackPieces[i].letter, mouseX, mouseY);
                this.ctx.strokeText(board.blackPieces[i].letter, mouseX, mouseY);
            } else {
                this.ctx.fillText(board.blackPieces[i].letter, board.blackPieces[i].pixelPositon.x, board.blackPieces[i].pixelPositon.y);
                this.ctx.strokeText(board.blackPieces[i].letter, board.blackPieces[i].pixelPositon.x, board.blackPieces[i].pixelPositon.y);
            }
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