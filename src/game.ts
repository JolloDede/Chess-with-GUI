import { canvas, mouseX, mouseY, movingPiece } from "./click";
import { board, images } from "./main";
import { Piece } from "./piece";
import { IVector } from "./interface";

export var tileSize: number;

export default class Game {
    ctx: CanvasRenderingContext2D;

    constructor() {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (canvas.offsetHeight == canvas.offsetWidth) {
            tileSize = canvas.offsetHeight / 8;
        } else {
            alert("Canvas is not a square");
        }
    }

    public render(): void {
        console.log("Render");
        this.ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        this.showGrid();
        this.showPieces();
        // this.showPiecesAsText();
        this.showMovesMovingPiece();
    }

    public showGrid(): void {
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
        this.drawCoordinates();
    }

    private drawCoordinates(): void {
        this.ctx.beginPath();
        this.ctx.font = "20px Arial"
        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "black";
        for (let i = 0; i < 8; i++) {
            if (i % 2 == 0) {
                this.ctx.fillText(String(8 - i), 5, i * tileSize + 20);
                this.ctx.fillText(String.fromCharCode(64 + i), i * tileSize - 20, tileSize * 8 - 10);
            } else {
                this.ctx.strokeText(String(8 - i), 5, i * tileSize + 20);
                this.ctx.strokeText(String.fromCharCode(64 + i), i * tileSize - 20, tileSize * 8 - 10);
            }
        }
    }

    private showMovesMovingPiece(): void {
        let moves: IVector[] = [];

        if (movingPiece == undefined || movingPiece.movingThisPiece == false) {
            return;
        }
        moves = movingPiece.generateMoves(board);
        this.ctx.beginPath();
        this.ctx.fillStyle = "green";
        for (let i = 0; i < moves.length; i++) {
            this.ctx.moveTo(moves[i].x * tileSize + tileSize / 2, moves[i].y * tileSize + tileSize / 2);
            this.ctx.arc(moves[i].x * tileSize + tileSize / 2, moves[i].y * tileSize + tileSize / 2, 15, 0, 2 * Math.PI);
        }
        this.ctx.fill();
    }

    gameLog(piece: Piece, to: IVector): void {
        let logTextEl: HTMLTextAreaElement;

        logTextEl = document.getElementById("game-log-text") as HTMLTextAreaElement;
        logTextEl.value = piece.letter + String.fromCharCode(piece.matrixPosition.x + 65) + (8 - piece.matrixPosition.y) + "-" + String.fromCharCode(to.x + 65) + (8 - to.y) + "\n" + logTextEl.value;
    }

    private showPieces(): void {
        let imagePos: number;

        imagePos = 0;
        for (let i = 0; i < 16; i++) {
            if (!board.whitePieces[i].taken) {
                imagePos = this.getImagePos(board.whitePieces[i].letter, true);
                if (board.whitePieces[i].movingThisPiece) {
                    this.ctx.drawImage(images[imagePos], mouseX - tileSize / 2, mouseY - tileSize / 2,
                        tileSize + tileSize * 0.2, tileSize + tileSize * 0.2);
                } else {
                    this.ctx.drawImage(images[imagePos], board.whitePieces[i].matrixPosition.x * tileSize, board.whitePieces[i].matrixPosition.y * tileSize,
                        tileSize, tileSize);
                }
            }
            if (!board.blackPieces[i].taken) {
                imagePos = this.getImagePos(board.blackPieces[i].letter, false);
                if (board.blackPieces[i].movingThisPiece) {
                    this.ctx.drawImage(images[imagePos], mouseX - tileSize / 2, mouseY - tileSize / 2, tileSize + tileSize * 0.2, tileSize + tileSize * 0.2);
                } else {
                    this.ctx.drawImage(images[imagePos], board.blackPieces[i].matrixPosition.x * tileSize,
                        board.blackPieces[i].matrixPosition.y * tileSize,
                        tileSize, tileSize);
                }
            }
        }
    }

    private getImagePos(letter: string, white: boolean): number {
        switch (letter) {
            case "P": {
                return white ? 5 : 11;
            }
            case "N": {
                return white ? 3 : 9;
            }
            case "B": {
                return white ? 2 : 8;
            }
            case "R": {
                return white ? 4 : 10;
            }
            case "Q": {
                return white ? 1 : 7;
            }
            case "K": {
                return white ? 0 : 6;
            }
            default:
                console.log("getImagePos Error");
                return Infinity;
        }
    }

    public countPiecesDefeated(type: string, white: boolean): void {
        let value: number;

        switch (type) {
            case "p": {
                if (white) {
                    value = Number(document.getElementById("pawn-score-white")!.innerText);
                    value++;
                    document.getElementById("pawn-score-white")!.innerText = String(value);
                } else {
                    value = Number(document.getElementById("pawn-score-black")!.innerText);
                    value++;
                    document.getElementById("pawn-score-black")!.innerText = String(value);
                }
                break;
            }
            case "b": {
                if (white) {
                    value = Number(document.getElementById("bishop-score-white")!.innerText);
                    value++;
                    document.getElementById("bishop-score-white")!.innerText = String(value);
                } else {
                    value = Number(document.getElementById("bishop-score-black")!.innerText);
                    value++;
                    document.getElementById("bishop-score-black")!.innerText = String(value);
                }
                break;
            }
            case "n": {
                if (white) {
                    value = Number(document.getElementById("knigth-score-white")!.innerText);
                    value++;
                    document.getElementById("knigth-score-white")!.innerText = String(value);
                } else {
                    value = Number(document.getElementById("knigth-score-black")!.innerText);
                    value++;
                    document.getElementById("knigth-score-black")!.innerText = String(value);
                }
                break;
            }
            case "r": {
                if (white) {
                    value = Number(document.getElementById("rook-score-white")!.innerText);
                    value++;
                    document.getElementById("rook-score-white")!.innerText = String(value);
                } else {
                    value = Number(document.getElementById("rook-score-black")!.innerText);
                    value++;
                    document.getElementById("rook-score-black")!.innerText = String(value);
                }
                break;
            }
            case "q": {
                if (white) {
                    value = Number(document.getElementById("queen-score-white")!.innerText);
                    value++;
                    document.getElementById("queen-score-white")!.innerText = String(value);
                } else {
                    value = Number(document.getElementById("queen-score-black")!.innerText);
                    value++;
                    document.getElementById("queen-score-black")!.innerText = String(value);
                }
                break;
            }
        }
    }

}