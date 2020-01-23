import { Board } from "./board";
import { Piece } from "./piece";
import { IVector, IMove } from "./main";

class MyNode {
    value: number;
    childNodes: MyNode[];
    parentNode: MyNode | null;
    constructor() {
        this.value = 0;
        this.childNodes = [];
        this.parentNode = null;
    }

    public addSubNode(value: MyNode): void {
        this.childNodes.push(value);
    }

    public setParentNode(value: MyNode): void {
        this.parentNode = value;
    }
}

export abstract class AI {
    protected pieces: Piece[];
    protected board: Board;

    constructor(board: Board, whitePieces: boolean) {
        this.board = board;
        this.pieces = [];
        if (whitePieces) {
            this.pieces = board.whitePieces;
        } else {
            this.pieces = board.blackPieces;
        }
    }

    abstract decideMove(): IMove;

    abstract makeMove(from: IVector, to: IVector): void;
}

export class RandomAI extends AI {

    constructor(board: Board, whitePieces: boolean) {
        super(board, whitePieces);
    }

    makeMove(from: IVector, to: IVector): void {
        let piece: Piece;

        piece = this.board.getPieceAt(from.x, from.y);
        piece.move(to.x, to.y, this.board);
    }

    decideMove(): IMove {
        let moves: IVector[];
        let pieceNum: number;
        let moveNum: number;

        while (true) {
            pieceNum = Math.floor(Math.random() * this.pieces.length);
            if (!this.pieces[pieceNum].taken) {
                moves = this.pieces[pieceNum].generateMoves(this.board);
                if (moves.length != 0) {
                    break;
                }
            }
        }
        moveNum = Math.floor(Math.random() * moves.length);

        return { from: this.pieces[pieceNum].matrixPosition, to: moves[moveNum] } as IMove;
    }

}

function reverseArray(array: number[][]): number[][] {
    return array.slice().reverse();
}

var pawnEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

var bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

function getPieceAbsoluteValue(piece: Piece): number {
    switch (piece.letter) {
        case "P":
            return 10 + (piece.white ? pawnEvalWhite[piece.matrixPosition.y][piece.matrixPosition.x] : pawnEvalBlack[piece.matrixPosition.y][piece.matrixPosition.x]);
        case "N":
            return 30 + knightEval[piece.matrixPosition.y][piece.matrixPosition.x];
        case "B":
            return 30 + (piece.white ? bishopEvalWhite[piece.matrixPosition.y][piece.matrixPosition.x] : bishopEvalBlack[piece.matrixPosition.y][piece.matrixPosition.x]);
        case "R":
            return 50 + (piece.white ? rookEvalWhite[piece.matrixPosition.y][piece.matrixPosition.x] : rookEvalBlack[piece.matrixPosition.y][piece.matrixPosition.x]);
        case "Q":
            return 90 + evalQueen[piece.matrixPosition.y][piece.matrixPosition.x];
        case "K":
            return 900 + (piece.white ? kingEvalWhite[piece.matrixPosition.y][piece.matrixPosition.x] : kingEvalBlack[piece.matrixPosition.y][piece.matrixPosition.x]);
        default:
            console.log("Error getPieceAbsoluteValue");
            return 0;
    }
}

const maxDepth = 3;

export class MinimaxAI extends AI {
    Nodes: MyNode[];

    rootNodeIndex: number;
    branchNodeIndex: number;
    secondBranchNodeIndex: number;
    nodeIndexStack: number[];


    constructor(board: Board, whitePieces: boolean) {
        super(board, whitePieces);
        this.Nodes = [];
        this.rootNodeIndex = 0;
        this.branchNodeIndex = 0;
        this.secondBranchNodeIndex = 0;
        this.nodeIndexStack = [];
    }

    getBoardAbsoluteValue(allyPieces: Piece[], enemyPieces: Piece[]): number {
        let value: number = 0;
        for (var i = 0; i < allyPieces.length; i++) {
            if (allyPieces[i].taken) {
                value -= allyPieces[i].value;
            } else {
                value += getPieceAbsoluteValue(allyPieces[i]);
            }
        }
        for (var i = 0; i < enemyPieces.length; i++) {
            if (enemyPieces[i].taken) {
                value += enemyPieces[i].value;
            } else {
                value -= getPieceAbsoluteValue(enemyPieces[i]);
            }
        }
        return value;
    }

    private createNewBoardsWithMovesRecursiv(board: Board, boards: Board[], depth: number): void {
        let moves: IVector[] = [];
        let pieces: Piece[];

        if (depth == maxDepth) {
            return;
        }
        if (depth % 2 == 0) {
            pieces = board.blackPieces;
        } else {
            pieces = board.whitePieces;
        }
        for (let i = 0; i < pieces.length; i++) {
            moves = pieces[i].generateMoves(board);
            for (let j = 0; j < moves.length; j++) {
                boards.push(board.clone());
                boards[boards.length - 1].movePiece(pieces[i].matrixPosition, moves[j]);
                this.Nodes.push(new MyNode());
                if (depth == maxDepth - 1) {
                    this.Nodes[this.Nodes.length - 1].value = this.getBoardAbsoluteValue(boards[boards.length - 1].blackPieces, boards[boards.length - 1].whitePieces);
                }
                this.Nodes[this.nodeIndexStack[this.nodeIndexStack.length - 1]].addSubNode(this.Nodes[this.Nodes.length - 1]);
                this.Nodes[this.Nodes.length - 1].setParentNode(this.Nodes[this.nodeIndexStack[this.nodeIndexStack.length - 1]]);
                this.nodeIndexStack.push(this.Nodes.length - 1);
                this.createNewBoardsWithMovesRecursiv(boards[boards.length - 1], boards, depth + 1);
                this.nodeIndexStack.pop();
            }
        }
    }

    makeMove(from: IVector, to: IVector): void {
        let piece: Piece;

        piece = this.board.getPieceAt(from.x, from.y);
        piece.move(to.x, to.y, this.board);
    }

    vergleichen(board: Board) {
        let error: number = 0;

        for (let i = 0; i < 8; i++) {
            if ((this.board.whitePieces[i].matrixPosition.x != board.whitePieces[i].matrixPosition.x)
                || (this.board.whitePieces[i].matrixPosition.y != board.whitePieces[i].matrixPosition.y)) {
                error++;
            }
            if ((this.board.blackPieces[i].matrixPosition.x != board.blackPieces[i].matrixPosition.x)
                || (this.board.blackPieces[i].matrixPosition.y != board.blackPieces[i].matrixPosition.y)) {
                error++;
            }
        }
        console.log("Error board vergleich: " + error);
    }

    minimax(position: MyNode, depth: number, maximizingPlayer: boolean): number {
        let value: number;

        if (depth == 0) {
            return position.value;
        }
        if (maximizingPlayer) {
            value = -Infinity;
            for (let i = 0; i < position.childNodes.length; i++) {
                value = Math.max(value, this.minimax(position.childNodes[i], depth - 1, false));
            }
            position.value = value;
            return value
        } else if (!maximizingPlayer) {
            value = Infinity;
            for (let i = 0; i < position.childNodes.length; i++) {
                value = Math.min(value, this.minimax(position.childNodes[i], depth - 1, true));
            }
            position.value = value;
            return value;
        }
        console.log("Error Minimax");
        return 0;
    }

    getChildNodeIndexWithValue(node: MyNode): number {
        for (let i: number = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].value == node.value) {
                return this.Nodes.indexOf(node.childNodes[i]);
            }
        }
        console.log("Error getChildNodeIndexWithValue");
        return 0;
    }

    decideMove(): IMove {
        let boards: Board[] = [];
        this.Nodes = [];
        let bestMoveIndex: number;

        boards.push(this.board);
        this.Nodes.push(new MyNode());
        this.nodeIndexStack.push(this.Nodes.length - 1);
        this.createNewBoardsWithMovesRecursiv(this.board, boards, 0);
        console.log(boards.length + " " + this.Nodes.length);
        console.log(this.minimax(this.Nodes[0], 3, true), this.Nodes[0].value);
        bestMoveIndex = this.getChildNodeIndexWithValue(this.Nodes[0]);
        return this.boardComparePosOff(boards[bestMoveIndex]);
    }

    boardComparePosOff(destBoard: Board): IMove {
        for (let i: number = 0; i < 16; i++) {
            if (this.pieces[0].white) {
                if (this.pieces[i].matrixPosition.x != destBoard.whitePieces[i].matrixPosition.x || this.pieces[i].matrixPosition.y != destBoard.whitePieces[i].matrixPosition.y) {
                    return { from: this.pieces[i].matrixPosition, to: destBoard.whitePieces[i].matrixPosition } as IMove;
                }
            } else {
                if (this.pieces[i].matrixPosition.x != destBoard.blackPieces[i].matrixPosition.x || this.pieces[i].matrixPosition.y != destBoard.blackPieces[i].matrixPosition.y) {
                    return { from: this.pieces[i].matrixPosition, to: destBoard.blackPieces[i].matrixPosition } as IMove;
                }
            }
        }
        console.log("Error Compare Pos of Boards");
        return {} as IMove
    }

}
