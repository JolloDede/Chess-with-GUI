import { App, board } from "./main";
import Game, { tileSize } from "./game";
import { Piece, King } from "./piece";
import { RandomAI, MinimaxAI } from "./AI";
import { IMove } from "./interface";

document.getElementById("back")!.onclick = function () { backButtonClick() }
document.getElementById("advance")!.onclick = function () { advanceButtonClick() }
var soundElement: HTMLLinkElement = document.getElementById("sound") as HTMLLinkElement;
soundElement.onclick = function () { soundButtonClick() }
document.getElementById("start")!.onclick = function () { startButtonClick() }

document.getElementById("new-game")!.onclick = function () { newGameButtonClick() }
document.getElementById("introduction")!.onclick = function () { introductionButtonCLick() }
document.getElementById("credits")!.onclick = function () { creditsButtonCLick() }

window.onkeydown = function (event: KeyboardEvent) { enterClick(event) }

export var canvas: HTMLCanvasElement;
canvas = document.getElementById("my-canvas") as HTMLCanvasElement;
canvas.onmousemove = function (event: MouseEvent) { mouseMoved(event) }
canvas.onclick = function () { canvasClick() }

export var mouseX: number;
export var mouseY: number;
var moving: boolean;
export var movingPiece: Piece | null;
var AI: RandomAI | MinimaxAI;

var color: string;
var app: App;


function enterClick(event: KeyboardEvent) {
    if (event.keyCode == 13) {
        if (document.getElementById("canvas-overlay-container")!.style.display != "none") {
            startButtonClick();
        }
    }
}

function canvasClick() {
    let x: number;
    let y: number;
    let piece: Piece | null;
    let move: IMove;

    x = Math.floor(mouseX / tileSize);
    y = Math.floor(mouseY / tileSize);
    if (!board.isDone()) {
        if (!moving) {
            movingPiece = board.getPieceAt(x, y)
            if (movingPiece != null) {
                // movingPiece = board.getPieceAt(x, y);
                if ((movingPiece.white && color == "white") || (!movingPiece.white && color == "black")) {
                    movingPiece.movingThisPiece = true;
                } else {
                    return;
                }
            } else {
                return;
            }
        } else {
            if ((movingPiece as Piece).canMove(x, y, board)) {
                piece = board.getPieceAt(x, y);
                if (piece != null) {
                    app.getGame().countPiecesDefeated(piece.kind, piece.white);
                }
                app.getGame().gameLog((movingPiece as Piece), { x: x, y: y });
                (movingPiece as Piece).move(x, y, board);
                move = AI.decideMove();
                app.getGame().gameLog(board.getPieceAt(move.from.x, move.from.y) as Piece, move.to);
                piece = board.getPieceAt(move.to.x, move.to.y);
                if (piece != null) {
                    app.getGame().countPiecesDefeated(piece.kind, piece.white);
                }
                AI.makeMove(move.from, move.to);
                board.showScore();
                board.kingUnderAttack(board.whitePieces[0] as King);
                board.kingUnderAttack(board.blackPieces[0] as King);
                if (board.blackKingUnderAttack || board.whiteKingUnderAttack) {
                    console.log("Check");
                }
            }
            (movingPiece as Piece).movingThisPiece = false;
        }
        moving = !moving;
        board.setScore();
    }
}

function backButtonClick() {

}

function advanceButtonClick() {

}

function soundButtonClick() {
    for (let i = 0; i < soundElement.classList.length; i++) {
        if (soundElement.classList[i] == "fa-volume-up") {
            soundElement.classList.remove("fa-volume-up");
            soundElement.classList.add("fa-volume-mute");
            break;
        } else if (soundElement.classList[i] == "fa-volume-mute") {
            soundElement.classList.remove("fa-volume-mute");
            soundElement.classList.add("fa-volume-up");
            break;
        }
    }
}

function startButtonClick() {
    app = new App(new Game());
    let el: HTMLSelectElement;
    let ai: string;
    let rEl: any;
    let coc: HTMLDivElement;
    let name: string;

    name = (document.getElementById("username")! as HTMLInputElement).value;
    if (name == "") {
        document.getElementById("error-noname")!.style.display = "block";
        return;
    } else {
        document.getElementById("error-noname")!.style.display = "none";
    }

    coc = document.getElementById("canvas-overlay-container") as HTMLDivElement;
    coc.style.display = "none";

    color = "";
    el = (document.getElementById("ai-selection") as HTMLSelectElement);
    ai = (<HTMLOptionElement>el.options[el.selectedIndex]).value;
    rEl = document.getElementsByName("color");
    if (rEl[0].checked) {
        color = rEl[0].value as string;
    } else {
        color = rEl[1].value as string;
    }
    app.setup();
    switch (ai) {
        case "Random": {
            AI = new RandomAI(board, color == "white" ? false : true);
            break;
        }
        case "MiniMax": {
            AI = new MinimaxAI(board, color == "white" ? false : true);
            break;
        }
    }
    console.log("Welcome " + name + " you 're playing against " + ai + " you have the " + color + " Pieces");
}

function mouseMoved(event: MouseEvent) {
    getMousePos(event);
}

function getMousePos(event: MouseEvent): void {
    let rect: DOMRect
    rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

function newGameButtonClick() {
    let coc: HTMLDivElement;

    coc = document.getElementById("canvas-overlay-container") as HTMLDivElement;
    coc.style.display = "initial";
}

function introductionButtonCLick() {
    document.getElementById("game-sitepanel")!.style.display = "none";
    document.getElementById("game-log")!.style.display = "none";
    document.getElementById("game-content")!.style.display = "none";
    document.getElementById("introcution-content")!.style.display = "block";
}

function creditsButtonCLick(){
    document.getElementById("game-sitepanel")!.style.display = "none";
    document.getElementById("game-log")!.style.display = "none";
    document.getElementById("game-content")!.style.display = "none";
    document.getElementById("credits-content")!.style.display = "block";
}