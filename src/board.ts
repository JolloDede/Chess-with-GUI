import {IVector} from './main';
import {Piece, King, Rook, Knigth, Bishop, Queen, Pawn} from './piece';

export class Board {
    whitePieces: Piece[];
    blackPieces: Piece[];
    scoreWhite: number;
    scoreBlack: number;
    whiteKingUnderAttack: boolean;
    blackKingUnderAttack: boolean;
    constructor() {
        this.scoreWhite = 0;
        this.scoreBlack = 0;
        this.whitePieces = [];
        this.blackPieces = [];
        this.whiteKingUnderAttack = false;
        this.blackKingUnderAttack = false;
        this.setupPieces();
    }

    setupPieces(): void {
        this.whitePieces.push(new King(4, 7, true));
        this.whitePieces.push(new Rook(0, 7, true));
        this.whitePieces.push(new Rook(7, 7, true));
        this.whitePieces.push(new Knigth(1, 7, true));
        this.whitePieces.push(new Knigth(6, 7, true));
        this.whitePieces.push(new Bishop(2, 7, true));
        this.whitePieces.push(new Bishop(5, 7, true));
        this.whitePieces.push(new Queen(3, 7, true));
        for (var i = 0; i < 8; i++) {
            this.whitePieces.push(new Pawn(i, 6, true));
        }

        this.blackPieces.push(new King(4, 0, false));
        this.blackPieces.push(new Rook(0, 0, false));
        this.blackPieces.push(new Rook(7, 0, false));
        this.blackPieces.push(new Knigth(1, 0, false));
        this.blackPieces.push(new Knigth(6, 0, false));
        this.blackPieces.push(new Bishop(2, 0, false));
        this.blackPieces.push(new Bishop(5, 0, false));
        this.blackPieces.push(new Queen(3, 0, false));
        for (var i = 0; i < 8; i++) {
            this.blackPieces.push(new Pawn(i, 1, false));
        }
    }

    show(): void {
        for (var i = 0; i < this.whitePieces.length; i++) {
            this.whitePieces[i].show();
        }
        for (var i = 0; i < this.blackPieces.length; i++) {
            this.blackPieces[i].show();
        }
    }

    pieceAt(x: number, y: number): boolean {
        for (var i = 0; i < this.whitePieces.length; i++) {
            if (this.whitePieces[i].matrixPosition.x == x && this.whitePieces[i].matrixPosition.y == y) {
                if (!this.whitePieces[i].taken) {
                    return true;
                }
            }
        }
        for (var i = 0; i < this.blackPieces.length; i++) {
            if (this.blackPieces[i].matrixPosition.x == x && this.blackPieces[i].matrixPosition.y == y) {
                if (!this.blackPieces[i].taken) {
                    return true;
                }
            }
        }
        return false;
    }

    getPieceAt(x: number, y: number): Piece{
        for (var i = 0; i < this.whitePieces.length; i++) {
            if (!this.whitePieces[i].taken && this.whitePieces[i].matrixPosition.x == x && this.whitePieces[i].matrixPosition.y == y) {
                return this.whitePieces[i];
            }
        }
        for (var i = 0; i < this.blackPieces.length; i++) {
            if (!this.blackPieces[i].taken && this.blackPieces[i].matrixPosition.x == x && this.blackPieces[i].matrixPosition.y == y) {
                return this.blackPieces[i];
            }
        }
        // If you get here there is something wrong in the Application
        alert("Error");
        return new King(1,2,true);
    }

    isDone(): boolean {
        return this.whitePieces[0].taken || this.blackPieces[0].taken;
    }

    setScore(): void {
        this.scoreWhite = 0;
        for (var i = 0; i < this.whitePieces.length; i++) {
            if (this.whitePieces[i].taken) {
                this.scoreBlack += this.whitePieces[i].value;
            }
        }
        this.scoreBlack = 0;
        for (var i = 0; i < this.blackPieces.length; i++) {
            if (this.blackPieces[i].taken) {
                this.scoreWhite += this.blackPieces[i].value;
            }
        }
        this.showScore();
    }

    showScore(): void{
        document.getElementById("scoreWhite")!.innerText = String(this.scoreWhite);
        document.getElementById("scoreBlack")!.innerText = String(this.scoreBlack);
    }

    movePiece(from: IVector, to: IVector): void {
        var piece = this.getPieceAt(from.x, from.y);
        if (piece == null) {
            console.log(from.x + " " + from.y);
            for (var i = 0; i < this.blackPieces.length; i++) {
                console.log(this.blackPieces[i].matrixPosition.x + " " + this.blackPieces[i].matrixPosition.y);
                this.getPieceAt(from.x, from.y);
            }
        }
        if(piece.canMove(to.x, to.y, this)){
            piece.move(to.x, to.y, this);
        }
    }

    clone(): Board {
        var clone = new Board();
        var i: number
        for (i = 0; i < this.whitePieces.length; i++) {
            clone.whitePieces[i].matrixPosition.x = this.whitePieces[i].matrixPosition.x;
            clone.whitePieces[i].matrixPosition.y = this.whitePieces[i].matrixPosition.y;
            clone.whitePieces[i].taken = this.whitePieces[i].taken;
        }
        for (i = 0; i < this.blackPieces.length; i++) {
            clone.blackPieces[i].matrixPosition.x = this.blackPieces[i].matrixPosition.x;
            clone.blackPieces[i].matrixPosition.y = this.blackPieces[i].matrixPosition.y;
            clone.blackPieces[i].taken = this.blackPieces[i].taken;
        }
        return clone;
    }

    adjustBoards(dest: Board): void {
        for (let i: number = 0; i < this.blackPieces.length; i++) {
            if ((this.blackPieces[i].matrixPosition.x != dest.blackPieces[i].matrixPosition.x) || (this.blackPieces[i].matrixPosition.y != dest.blackPieces[i].matrixPosition.y)) {
                this.movePiece(this.blackPieces[i].matrixPosition, dest.blackPieces[i].matrixPosition);
            }
        }
    }

    kingUnderAttack(king: King): void{
        let pieces: Piece[];
        let moves: IVector[];
        let colorWhite: boolean = king.white
        if(colorWhite){
            pieces = this.blackPieces;
        }else{
            pieces = this.whitePieces;
        }
        for (let i = 0; i < pieces.length; i++) {
            moves = pieces[i].generateMoves(this);
            for (let i = 0; i < moves.length; i++) {
                moves[i].x;
                if(king.matrixPosition.x == moves[i].x && king.matrixPosition.y == moves[i].y){
                    if(colorWhite){this.whiteKingUnderAttack = true}
                    else{this.blackKingUnderAttack = true}
                }
            }
        }
        if(colorWhite){this.whiteKingUnderAttack = false}
        else{this.blackKingUnderAttack = false}
    }

}
