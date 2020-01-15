import { canvas, mouseX, mouseY } from "./click";
import { board, images } from "./main";
import { Board } from "./board";
import { Piece, Pawn, Knigth, Bishop, Rook, Queen, King } from "./piece";

export var tileSize: number;

export default class Game {
    ctx: CanvasRenderingContext2D;

    constructor() {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (canvas.height == canvas.width) {
            tileSize = canvas.height / 8;
        }
    }

    public render() {
        console.log("Render");
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.showGrid();
        this.showPieces();
        // this.showPiecesAsText();
    }

    public showGrid() {
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
        let imagePos: number;
        
        imagePos = 0;
        for (let i = 0; i < board.whitePieces.length; i++) {
            switch (board.whitePieces[i].kind) {
                case "Pawn": {
                    imagePos = 5;
                    break;
                }
                case "Knigth": {
                    imagePos = 3;
                    break;
                }
                case "Bishop": {
                    imagePos = 2;
                    break;
                }
                case "Rook": {
                    imagePos = 4;
                    break;
                }
                case "Queen": {
                    imagePos = 1;
                    break;
                }
                case "King": {
                    imagePos = 0;
                    break;
                }
            }
            if (board.whitePieces[i].movingThisPiece){
                this.ctx.drawImage(images[imagePos], mouseX-tileSize/2, mouseY-tileSize/2,
                    tileSize+tileSize*0.2, tileSize+tileSize*0.2);
            }else{
                this.ctx.drawImage(images[imagePos], board.whitePieces[i].pixelPositon.x, board.whitePieces[i].pixelPositon.y,
                    tileSize, tileSize);
            }   
        }
        for (let i = 0; i < board.blackPieces.length; i++) {
            switch (board.blackPieces[i].kind) {
                case "Pawn": {
                    imagePos = 11;
                    break;
                }
                case "Knigth": {
                    imagePos = 9;
                    break;
                }
                case "Bishop": {
                    imagePos = 8;
                    break;
                }
                case "Rook": {
                    imagePos = 10;
                    break;
                }
                case "Queen": {
                    imagePos = 7;
                    break;
                }
                case "King": {
                    imagePos = 6;
                    break;
                }
            }
            if (board.blackPieces[i].movingThisPiece){
                this.ctx.drawImage(images[imagePos], mouseX-tileSize/2, mouseY-tileSize/2, tileSize+tileSize*0.2, tileSize+tileSize*0.2);
            }else{
            this.ctx.drawImage(images[imagePos], board.blackPieces[i].pixelPositon.x,
                board.blackPieces[i].pixelPositon.y,
                tileSize, tileSize);
            }
        }
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
}