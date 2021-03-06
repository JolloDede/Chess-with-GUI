import { Board } from "./board";
import { Piece } from "./piece";
import { IVector, IMove, IMoveAssosiation } from "./interface";
import { pawnEvalWhite, pawnEvalBlack, knightEval, bishopEvalWhite, bishopEvalBlack, rookEvalWhite, rookEvalBlack, evalQueen, kingEvalWhite, kingEvalBlack } from "./evalBoard";

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

    makeMove(from: IVector, to: IVector): void {
        let piece: Piece | null;

        piece = this.board.getPieceAt(from.x, from.y);
        (piece as Piece).move(to.x, to.y, this.board);
    }
}

export class RandomAI extends AI {

    constructor(board: Board, whitePieces: boolean) {
        super(board, whitePieces);
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

const maxDepth = 4;

export class MinimaxAI extends AI {
    Nodes: MyNode[];
    nodeIndexStack: number[];
    firstMoves: IMoveAssosiation[];
    boardStack: Board[];


    constructor(board: Board, whitePieces: boolean) {
        super(board, whitePieces);
        this.Nodes = [];
        this.nodeIndexStack = [];
        this.firstMoves = [];
        this.boardStack = [];
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

    private createNewBoardsWithMovesRecursiv(board: Board, depth: number): void {
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
                this.boardStack.push(board.clone())
                if (depth == 0) {
                    this.firstMoves.push({ move: { from: pieces[i].matrixPosition, to: moves[j] }, nodeNr: this.Nodes.length })
                }
                this.boardStack[this.boardStack.length - 1].movePiece(pieces[i].matrixPosition, moves[j]);
                this.Nodes.push(new MyNode());
                if (depth == maxDepth - 1) {
                    this.Nodes[this.Nodes.length - 1].value = this.getBoardAbsoluteValue(this.boardStack[this.boardStack.length - 1].blackPieces, this.boardStack[this.boardStack.length - 1].whitePieces);
                    // console.log(this.Nodes.length+" "+this.Nodes[this.Nodes.length-1].value);
                }
                this.Nodes[this.nodeIndexStack[this.nodeIndexStack.length - 1]].addSubNode(this.Nodes[this.Nodes.length - 1]);
                this.Nodes[this.Nodes.length - 1].setParentNode(this.Nodes[this.nodeIndexStack[this.nodeIndexStack.length - 1]]);
                this.nodeIndexStack.push(this.Nodes.length - 1);
                this.createNewBoardsWithMovesRecursiv(this.boardStack[this.boardStack.length - 1], depth + 1);
                this.nodeIndexStack.pop();
                this.boardStack.pop();
            }
        }
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
        this.Nodes = [];
        let bestMoveIndex: number;

        this.firstMoves = [];
        this.Nodes.push(new MyNode());
        this.nodeIndexStack.push(this.Nodes.length - 1);
        this.createNewBoardsWithMovesRecursiv(this.board.clone(), 0);
        console.log(this.minimax(this.Nodes[0], maxDepth, true), this.Nodes[0].value);
        bestMoveIndex = this.getChildNodeIndexWithValue(this.Nodes[0]);
        return this.getMove(bestMoveIndex);
    }

    getMove(bMI: number): IMove {
        for (let i = 0; i < this.firstMoves.length; i++) {
            if (this.firstMoves[i].nodeNr == bMI) {
                return this.firstMoves[i].move;
            }
        }
        console.log("Error getMove");
        return {} as IMove;
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
