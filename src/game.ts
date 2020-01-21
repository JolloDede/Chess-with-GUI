import { canvas, mouseX, mouseY, movingPiece } from "./click";
import { board, images, IVector } from "./main";

export var tileSize: number;

export default class Game {
    ctx: CanvasRenderingContext2D;

    constructor() {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;        
        if (canvas.offsetHeight == canvas.offsetWidth) {
            tileSize = canvas.offsetHeight / 8;
        }else{
            alert("Canvas is not a square");
        }
    }

    public render() {
        console.log("Render");
        this.ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        this.showGrid();
        this.showPieces();
        // this.showPiecesAsText();
        this.showMovesMovingPiece();
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
        this.ctx.strokeRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }

    private showMovesMovingPiece(){
        let moves: IVector[] = [];
        
        if(movingPiece == undefined || movingPiece.movingThisPiece == false){
            return;
        }
        moves = movingPiece.generateMoves(board);
        this.ctx.beginPath();
        this.ctx.fillStyle = "green";
        for (let i = 0; i < moves.length; i++) {
            this.ctx.moveTo(moves[i].x*tileSize+tileSize/2, moves[i].y*tileSize+tileSize/2);
            this.ctx.arc(moves[i].x*tileSize+tileSize/2, moves[i].y*tileSize+tileSize/2, 15, 0, 2 * Math.PI);
        }
        this.ctx.fill();
    }

    private showPieces() {
        let imagePos: number;
        
        imagePos = 0;
        for (let i = 0; i < board.whitePieces.length; i++) {
            if (board.whitePieces[i].taken){continue;}
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
            if (board.blackPieces[i].taken){continue;}
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

}