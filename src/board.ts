import { IVector } from './interface';
import { Piece, King, Rook, Knigth, Bishop, Queen, Pawn } from './piece';

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

    getPieceAt(x: number, y: number): Piece | null {
        for (let i = 0; i < 16; i++) {
            if (!this.whitePieces[i].taken && this.whitePieces[i].matrixPosition.x == x && this.whitePieces[i].matrixPosition.y == y) {
                return this.whitePieces[i];
            }
            if (!this.blackPieces[i].taken && this.blackPieces[i].matrixPosition.x == x && this.blackPieces[i].matrixPosition.y == y) {
                return this.blackPieces[i];
            }
        }
        return null;
    }

    isDone(): boolean {
        return this.whitePieces[0].taken || this.blackPieces[0].taken;
    }

    setScore(): void {
        this.scoreWhite = 0;
        this.scoreBlack = 0;
        for (let i = 0; i < 16; i++) {
            if (this.whitePieces[i].taken) {
                this.scoreBlack += this.whitePieces[i].value;
            }
            if (this.blackPieces[i].taken) {
                this.scoreWhite += this.blackPieces[i].value;
            }
        }
        this.showScore();
    }

    showScore(): void {
        document.getElementById("score-white")!.innerText = String(this.scoreWhite);
        document.getElementById("score-black")!.innerText = String(this.scoreBlack);
    }

    movePiece(from: IVector, to: IVector): void {
        let piece: Piece | null;
        piece = this.getPieceAt(from.x, from.y);
        if (piece == null) {
            console.log(from.x + " " + from.y);
            for (var i = 0; i < this.blackPieces.length; i++) {
                console.log(this.blackPieces[i].matrixPosition.x + " " + this.blackPieces[i].matrixPosition.y);
                this.getPieceAt(from.x, from.y);
            }
        } else {
            piece.move(to.x, to.y, this);
        }
    }

    clone(): Board {
        var clone = new Board();
        var i: number;
        
        for (let i = 0; i < 16; i++) {
            // White Pieces
            clone.whitePieces[i].matrixPosition.x = this.whitePieces[i].matrixPosition.x;
            clone.whitePieces[i].matrixPosition.y = this.whitePieces[i].matrixPosition.y;
            clone.whitePieces[i].taken = this.whitePieces[i].taken;

            // Black Pieces
            clone.blackPieces[i].matrixPosition.x = this.blackPieces[i].matrixPosition.x;
            clone.blackPieces[i].matrixPosition.y = this.blackPieces[i].matrixPosition.y;
            clone.blackPieces[i].taken = this.blackPieces[i].taken;
        }
        return clone;
    }

    kingUnderAttack(king: King): void {
        let pieces: Piece[];
        let moves: IVector[];
        let colorWhite: boolean = king.white;

        if (colorWhite) {
            pieces = this.blackPieces;
        } else {
            pieces = this.whitePieces;
        }
        for (let i = 0; i < pieces.length; i++) {
            moves = pieces[i].generateMoves(this);
            for (let i = 0; i < moves.length; i++) {
                moves[i].x;
                if (king.matrixPosition.x == moves[i].x && king.matrixPosition.y == moves[i].y) {
                    if (colorWhite) {
                        this.whiteKingUnderAttack = true;
                        return;
                    }
                    else {
                        this.blackKingUnderAttack = true;
                        return;
                    }
                }
            }
        }
        if (colorWhite) {
            this.whiteKingUnderAttack = false
        }
        else {
            this.blackKingUnderAttack = false
        }
    }

}
