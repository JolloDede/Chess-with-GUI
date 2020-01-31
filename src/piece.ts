import { IVector, createVector } from "./main";
import { Board } from "./board";

export abstract class Piece {
    matrixPosition: IVector;
    taken: boolean;
    white: boolean;
    letter: string;
    movingThisPiece: boolean;
    value: number;
    constructor(x: number, y: number, isWhite: boolean, letter: string) {
        this.matrixPosition = createVector(x, y);
        this.taken = false;
        this.white = isWhite;
        this.letter = letter;
        this.movingThisPiece = false;
        this.value = 0;
    }

    move(x: number, y: number, board: Board): void {
        let attacking: Piece | null;

        attacking = board.getPieceAt(x, y);
        if (attacking != null) {
            if (attacking != null) {
                attacking.taken = true;
            }
        }
        // console.log("Move "+this.letter+" from "+x+" to "+y);
        this.matrixPosition = createVector(x, y);
    }

    withinBounds(x: number, y: number): boolean {
        if (x >= 0 && y >= 0 && x < 8 && y < 8) {
            return true;
        }
        return false;
    }

    attackingAllies(x: number, y: number, board: Board): boolean {
        let attacking: Piece | null;

        attacking = board.getPieceAt(x, y);
        if (attacking != null) {
            if (attacking.white == this.white) {
                return true;
            }
        }
        return false;
    }

    moveTroughPieces(x: number, y: number, board: Board): boolean {
        var stepDirectionX = x - this.matrixPosition.x;
        if (stepDirectionX > 0) {
            stepDirectionX = 1;
        } else if (stepDirectionX < 0) {
            stepDirectionX = -1;
        }
        var stepDirectionY = y - this.matrixPosition.y;
        if (stepDirectionY > 0) {
            stepDirectionY = 1;
        } else if (stepDirectionY < 0) {
            stepDirectionY = -1;
        }
        var tempPos = createVector(this.matrixPosition.x, this.matrixPosition.y);
        tempPos.x += stepDirectionX;
        tempPos.y += stepDirectionY;
        while (tempPos.x != x || tempPos.y != y) {
            if (!this.withinBounds(tempPos.x, tempPos.y)) {
                return false;
            }
            if (board.getPieceAt(tempPos.x, tempPos.y) != null) {
                return true;
            }
            tempPos.x += stepDirectionX;
            tempPos.y += stepDirectionY;
        }
        return false;
    }

    setNewLocation(x: number, y: number): void {
        this.matrixPosition = createVector(x, y);
    }

    kingIsSave(x: number, y: number, board: Board): boolean {
        let future: Board;

        future = board.clone();
        future.movePiece(this.matrixPosition, { x: x, y: y })
        if (this.white) {
            future.kingUnderAttack(future.whitePieces[0] as King);
            return future.whiteKingUnderAttack;
        } else {
            future.kingUnderAttack(future.blackPieces[0] as King);
            return future.blackKingUnderAttack;
        }
    }

    abstract generateMoves(board: Board): IVector[];
    abstract canMove(x: number, y: number, board: Board): boolean;
}

export class King extends Piece {
    firstTurn: boolean;
    gotAttacked: boolean;
    constructor(x: number, y: number, isWhite: boolean) {
        super(x, y, isWhite, "K");
        this.firstTurn = true;
        this.gotAttacked = false;
        this.value = 99;
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        if (this.moveTroughPieces(x, y, board)) {
            return false;
        }
        if (Math.abs(x - this.matrixPosition.x) <= 1 && Math.abs(y - this.matrixPosition.y) <= 1) {
            this.firstTurn = false;
            return true;
        }
        if (this.firstTurn && !this.gotAttacked && Math.abs(x - this.matrixPosition.x) == 2 && Math.abs(y - this.matrixPosition.y) == 0) {
            return this.rochade(x, this.white, board);
        }
        if (this.firstTurn && !this.gotAttacked && Math.abs(x - this.matrixPosition.x) == -2 && Math.abs(y - this.matrixPosition.y) == 0) {
            return this.rochade(x, this.white, board);
        }
        return false;
    }

    generateMoves(board: Board): IVector[] {
        var moves = [];
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var x = this.matrixPosition.x + i;
                var y = this.matrixPosition.y + j;
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }
        return moves;
    }

    clone(): King {
        var cloneKing = new King(this.matrixPosition.x, this.matrixPosition.y, this.white);
        cloneKing.taken = this.taken;
        return cloneKing;
    }

    rochade(kingX: number, white: boolean, board: Board): boolean {
        if (white) {
            for (let i = 0; i < board.whitePieces.length; i++) {
                if (board.whitePieces[i] instanceof Rook) {
                    if (Math.abs(kingX - board.whitePieces[i].matrixPosition.x) <= 2) {
                        if ((board.whitePieces[i] as Rook).firstTurn) {
                            if (kingX > this.matrixPosition.x) {
                                board.whitePieces[i].setNewLocation(this.matrixPosition.x + 1, this.matrixPosition.y)
                            } else {
                                board.whitePieces[i].setNewLocation(this.matrixPosition.x - 1, this.matrixPosition.y)
                            }
                            return true;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < board.blackPieces.length; i++) {
                if (board.blackPieces[i] instanceof Rook) {
                    if (Math.abs(kingX - board.blackPieces[i].matrixPosition.x) <= 2) {
                        if ((board.blackPieces[i] as Rook).firstTurn) {
                            if (kingX > this.matrixPosition.x) {
                                board.blackPieces[i].setNewLocation(this.matrixPosition.x + 1, this.matrixPosition.y);
                            } else {
                                board.blackPieces[i].setNewLocation(this.matrixPosition.x - 1, this.matrixPosition.y);
                            }
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

}

export class Queen extends Piece {
    constructor(x: number, y: number, isWhite: boolean) {
        super(x, y, isWhite, "Q");
        this.value = 9;
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        if (x == this.matrixPosition.x || y == this.matrixPosition.y) {
            if (this.moveTroughPieces(x, y, board)) {
                return false;
            }
            return true;
        }
        if (Math.abs(x - this.matrixPosition.x) == Math.abs(y - this.matrixPosition.y)) {
            if (this.moveTroughPieces(x, y, board)) {
                return false;
            }
            return true;
        }
        return false;
    }

    generateMoves(board: Board): IVector[] {
        var moves: IVector[] = [];
        if (this.taken) {
            return [];
        }
        // Horizontal
        for (var i = 0; i < 8; i++) {
            var x: number = i;
            var y: number = this.matrixPosition.y;
            if (x != this.matrixPosition.x) {
                if (!this.attackingAllies(x, y, board)) {
                    if (!this.moveTroughPieces(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }
        // Vertikal
        for (var i: number = 0; i < 8; i++) {
            x = this.matrixPosition.x;
            y = i;
            if (y != this.matrixPosition.y) {
                if (!this.attackingAllies(x, y, board)) {
                    if (!this.moveTroughPieces(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }
        // Diagonal
        // Right to Left
        for (var i: number = 7; i >= 0; i--) {
            x = i;
            y = this.matrixPosition.y + this.matrixPosition.x - i;
            if (i != this.matrixPosition.x) {
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        if (!this.moveTroughPieces(x, y, board)) {
                            moves.push(createVector(x, y));
                        }
                    }
                }
            }
        }
        // Left to Right
        for (var i = 0; i < 8; i++) {
            x = this.matrixPosition.x - (this.matrixPosition.y - i);
            y = i;
            if (i != this.matrixPosition.y) {
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        if (!this.moveTroughPieces(x, y, board)) {
                            moves.push(createVector(x, y));
                        }
                    }
                }
            }
        }
        return moves;
    }

    clone(): Queen {
        var cloneQueen = new Queen(this.matrixPosition.x, this.matrixPosition.y, this.white);
        cloneQueen.taken = this.taken;
        return cloneQueen;
    }

}

export class Rook extends Piece {
    firstTurn: boolean;
    constructor(x: number, y: number, isWhite: boolean) {
        super(x, y, isWhite, "R");
        this.firstTurn = true;
        this.value = 5;
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        if (x == this.matrixPosition.x || y == this.matrixPosition.y) {
            if (this.moveTroughPieces(x, y, board)) {
                return false;
            }
            this.firstTurn = false;
            return true;
        }
        return false;
    }

    generateMoves(board: Board): IVector[] {
        var moves: IVector[] = [];
        if (this.taken) {
            return [];
        }
        for (var i = 0; i < 8; i++) {
            var x: number = i;
            var y: number = this.matrixPosition.y;
            if (i != this.matrixPosition.x) {
                if (!this.attackingAllies(x, y, board)) {
                    if (!this.moveTroughPieces(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }

        for (var i = 0; i < 8; i++) {
            x = this.matrixPosition.x;
            y = i;
            if (i != this.matrixPosition.y) {
                if (!this.attackingAllies(x, y, board)) {
                    if (!this.moveTroughPieces(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }
        return moves;
    }

    clone(): Rook {
        var cloneRook = new Rook(this.matrixPosition.x, this.matrixPosition.y, this.white);
        cloneRook.taken = this.taken;
        return cloneRook;
    }

}

export class Bishop extends Piece {
    constructor(x: number, y: number, isWhite: boolean) {
        super(x, y, isWhite, "B");
        this.value = 3;
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        if (Math.abs(x - this.matrixPosition.x) == Math.abs(y - this.matrixPosition.y)) {
            if (this.moveTroughPieces(x, y, board)) {
                return false;
            }
            return true;
        }
        return false;
    }

    generateMoves(board: Board): IVector[] {
        var moves: IVector[] = [];
        if (this.taken) {
            return [];
        }
        for (var i = 7; i >= 0; i--) {
            var x = i;
            var y = this.matrixPosition.y + this.matrixPosition.x - i;
            if (i != this.matrixPosition.x) {
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        if (!this.moveTroughPieces(x, y, board)) {
                            moves.push(createVector(x, y));
                        }
                    }
                }
            }
        }

        for (var i = 0; i < 8; i++) {
            var x = this.matrixPosition.x - (this.matrixPosition.y - i);
            var y = i;
            if (i != this.matrixPosition.y) {
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        if (!this.moveTroughPieces(x, y, board)) {
                            moves.push(createVector(x, y));
                        }
                    }
                }
            }
        }
        return moves;
    }

    clone(): Bishop {
        var cloneBishop = new Bishop(this.matrixPosition.x, this.matrixPosition.y, this.white);
        cloneBishop.taken = this.taken;
        return cloneBishop;
    }

}

export class Knigth extends Piece {
    constructor(x: number, y: number, isWhite: boolean) {
        super(x, y, isWhite, "N");
        this.value = 3;
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        if (Math.abs(x - this.matrixPosition.x) == 1 && Math.abs(y - this.matrixPosition.y) == 2 ||
            Math.abs(x - this.matrixPosition.x) == 2 && Math.abs(y - this.matrixPosition.y) == 1) {
            return true;
        }
        return false;
    }

    generateMoves(board: Board): IVector[] {
        var moves: IVector[] = [];
        if (this.taken) {
            return [];
        }
        for (var i = -2; i < 3; i += 4) {
            for (var j = -1; j < 2; j += 2) {
                var x = this.matrixPosition.x + i;
                var y = this.matrixPosition.y + j;
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }

        for (var i = -1; i < 2; i += 2) {
            for (var j = -2; j < 3; j += 4) {
                var x = this.matrixPosition.x + i;
                var y = this.matrixPosition.y + j;
                if (this.withinBounds(x, y)) {
                    if (!this.attackingAllies(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        }
        return moves;
    }

    clone(): Knigth {
        var cloneKnight = new Knigth(this.matrixPosition.x, this.matrixPosition.y, this.white);
        cloneKnight.taken = this.taken;
        return cloneKnight;
    }

}

export class Pawn extends Piece {
    firstTurn: boolean;
    constructor(x: number, y: number, isWhite: boolean) {
        super(x, y, isWhite, "P");
        this.firstTurn = true;
        this.value = 1;
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        if (board.getPieceAt(x, y) != null) {
            if (Math.abs(x - this.matrixPosition.x) == Math.abs(y - this.matrixPosition.y) &&
                ((this.white && (y - this.matrixPosition.y) == -1) || (!this.white && (y - this.matrixPosition.y) == 1))) {
                this.firstTurn = false;
                return true;
            } else {
                return false
            }
        }
        if (x - this.matrixPosition.x != 0) {
            return false;
        }
        if (this.white) {
            if (y - this.matrixPosition.y == -1) {
                return true;
            }
            if (this.firstTurn && y - this.matrixPosition.y == -2) {
                if (this.moveTroughPieces(x, y, board)) {
                    return false;
                }
                this.firstTurn = false;
                return true;
            }
        }
        if (!this.white) {
            if (y - this.matrixPosition.y == 1) {
                return true;
            }
            if (this.firstTurn && y - this.matrixPosition.y == 2) {
                if (this.moveTroughPieces(x, y, board)) {
                    return false;
                }
                this.firstTurn = false;
                return true;
            }
        }
        return false;
    }

    generateMoves(board: Board): IVector[] {
        var moves: IVector[] = [];
        var x: number;
        var y: number;
        let piece: Piece | null;

        if (this.taken) {
            return [];
        }
        if ((this.white && !board.whiteKingUnderAttack) || (!this.white && !board.blackKingUnderAttack)) {
            for (var i = -1; i < 2; i += 2) {
                x = this.matrixPosition.x + i;
                if (this.white) {
                    y = this.matrixPosition.y - 1;
                } else {
                    y = this.matrixPosition.y + 1;
                }
                piece = board.getPieceAt(x,y);
                if (piece != null) {
                    if (this.white != piece.white) {
                        moves.push(createVector(x, y));
                    }
                }
            }
            x = this.matrixPosition.x;
            if (this.white) {
                y = this.matrixPosition.y - 1;
            } else {
                y = this.matrixPosition.y + 1;
            }
            if (this.withinBounds(x, y) && !board.getPieceAt(x, y)) {
                moves.push(createVector(x, y));
            }

            if (this.firstTurn) {
                x = this.matrixPosition.x;
                if (this.white) {
                    y = this.matrixPosition.y - 2;
                } else {
                    y = this.matrixPosition.y + 2;
                }
                if (this.withinBounds(x, y) && !board.getPieceAt(x, y)) {
                    if (!this.moveTroughPieces(x, y, board)) {
                        moves.push(createVector(x, y));
                    }
                }
            }
        } else {

        }
        return moves;
    }

    clone(): Pawn {
        var clonePawn = new Pawn(this.matrixPosition.x, this.matrixPosition.y, this.white);
        clonePawn.taken = this.taken;
        clonePawn.firstTurn = this.firstTurn;
        return clonePawn;
    }

}
