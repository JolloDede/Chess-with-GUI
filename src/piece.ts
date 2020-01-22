import { IVector, createVector } from "./main";
import { Board } from "./board";
import { tileSize } from "./game";
import { countPiecesDefeated } from "./click";

export abstract class Piece {
    matrixPosition: IVector;
    pixelPositon: IVector;
    taken: boolean;
    white: boolean;
    letter: string;
    pic?: HTMLImageElement;
    movingThisPiece: boolean;
    value: number;
    kind: string;
    static images: HTMLImageElement[];
    constructor(x: number, y: number, isWhite: boolean, letter: string) {
        this.matrixPosition = createVector(x, y);
        // pixelPositon for Text
        // this.pixelPositon = createVector(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2 + 10);
        // pixelPositon for Images
        this.pixelPositon = createVector(x*tileSize, y*tileSize);

        this.taken = false;
        this.white = isWhite;
        this.letter = letter;
        this.movingThisPiece = false;
        this.value = 0;
        this.kind = "";
    }

    move(x: number, y: number, board: Board): void {
        if (board.pieceAt(x, y)) {
            var attacking = board.getPieceAt(x, y);
            if (attacking != null) {
                countPiecesDefeated(attacking.kind, attacking.white);
                attacking.taken = true;
            }
        }
        // console.log("Move "+this.kind+" from "+x+" to "+y);
        this.matrixPosition = createVector(x, y);
        this.pixelPositon = createVector(x*tileSize, y*tileSize);
    }

    withinBounds(x: number, y: number): boolean {
        if (x >= 0 && y >= 0 && x < 8 && y < 8) {
            return true;
        }
        return false;
    }

    attackingAllies(x: number, y: number, board: Board): boolean {
        if (board.pieceAt(x, y)) {
            var attacking = board.getPieceAt(x, y);
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
            if (board.pieceAt(tempPos.x, tempPos.y)) {
                return true;
            }
            tempPos.x += stepDirectionX;
            tempPos.y += stepDirectionY;
        }
        return false;
    }

    setNewLocation(x: number, y: number) {
        this.matrixPosition = createVector(x, y);
        this.pixelPositon = createVector(x * tileSize, y * tileSize);
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
        // if (isWhite) {
        //     this.pic = King.images[0];
        // } else {
        //     this.pic = King.images[6];
        // }
        this.value = 99;
        this.kind = "King";
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
        // if (isWhite) {
        //     this.pic = Queen.images[1];
        // } else {
        //     this.pic = Queen.images[7];
        // }
        this.value = 9;
        this.kind = "Queen";
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
        for (var i: number = 7; i >=0; i--) {
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
        // if (isWhite) {
        //     this.pic = Rook.images[4];
        // } else {
        //     this.pic = Rook.images[10];
        // }
        this.value = 5;
        this.kind = "Rook";
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
        // if (isWhite) {
        //     this.pic = Bishop.images[2];
        // } else {
        //     this.pic = Bishop.images[8];
        // }
        this.value = 3;
        this.kind = "Bishop";
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
        super(x, y, isWhite, "Kn");
        // if (isWhite) {
        //     this.pic = Knigth.images[3];
        // } else {
        //     this.pic = Knigth.images[9];
        // }
        this.value = 3;
        this.kind = "Knigth";
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
        super(x, y, isWhite, "p");
        this.firstTurn = true;
        // if (isWhite) {
        //     this.pic = Pawn.images[5];
        // } else {
        //     this.pic = Pawn.images[11];
        // }
        this.value = 1;
        this.kind = "Pawn";
    }

    canMove(x: number, y: number, board: Board): boolean {
        if (!this.withinBounds(x, y)) {
            return false;
        }
        if (this.attackingAllies(x, y, board)) {
            return false;
        }
        var attacking = board.pieceAt(x, y);
        if (attacking) {
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
                var attacking = board.pieceAt(x, y);
                if (attacking) {
                    if (!this.attackingAllies(x, y, board)) {
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
            if (this.withinBounds(x, y) && !board.pieceAt(x, y)) {
                moves.push(createVector(x, y));
            }

            if (this.firstTurn) {
                x = this.matrixPosition.x;
                if (this.white) {
                    y = this.matrixPosition.y - 2;
                } else {
                    y = this.matrixPosition.y + 2;
                }
                if (this.withinBounds(x, y) && !board.pieceAt(x, y)) {
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
