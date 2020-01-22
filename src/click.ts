import { App, board } from "./main";
import Game, { tileSize } from "./game";
import { Piece, King } from "./piece";
import { RandomAI, MinimaxAI } from "./AI";

document.getElementById("back")!.onclick = function () { backButtonClick() }
document.getElementById("advance")!.onclick = function () { advanceButtonClick() }
var soundElement: HTMLLinkElement = document.getElementById("sound") as HTMLLinkElement;
soundElement.onclick = function () { soundButtonClick() }
document.getElementById("start")!.onclick = function () { startButtonClick() }
document.getElementById("new-game")!.onclick = function () { newGameButtonClick() }

window.onkeydown = function (event: KeyboardEvent) { enterClick(event)}

export var canvas: HTMLCanvasElement;
canvas = document.getElementById("my-canvas") as HTMLCanvasElement;
canvas.onmousemove = function (event: MouseEvent) { mouseMoved(event) }
canvas.onclick = function () { canvasClick() }

export var mouseX: number;
export var mouseY: number;
var moving: boolean;
export var movingPiece: Piece;
var AI: RandomAI | MinimaxAI;

var color: string;


function enterClick(event: KeyboardEvent){
    if (event.keyCode == 13) {
        if (document.getElementById("canvas-overlay-container")!.style.display != "none"){
            startButtonClick();
        }
    }
}

function canvasClick() {
    let x: number;
    let y: number;

    x = Math.floor(mouseX / tileSize);
    y = Math.floor(mouseY / tileSize);
    if (!board.isDone()) {
        if (!moving) {
            if (board.pieceAt(x, y)) {
                movingPiece = board.getPieceAt(x, y);
                if ((movingPiece.white && color == "white") || (!movingPiece.white && color == "black")) {
                    movingPiece.movingThisPiece = true;
                } else {
                    return;
                }
            } else {
                return;
            }
        } else {
            if (movingPiece.canMove(x, y, board)) {
                movingPiece.move(x, y, board);
                // console.log(AI.getBoardAbsoluteValue(board.blackPieces, board.whitePieces));
                board.kingUnderAttack(board.whitePieces[0] as King);
                board.kingUnderAttack(board.blackPieces[0] as King);
                AI.makeMove();
                board.showScore();
            }
            movingPiece.movingThisPiece = false;
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
    let app: App = new App(new Game());
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

export function countPiecesDefeated(type: string, white: boolean) {
    let value: number;
    switch (type) {
        case "Pawn": {
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
        case "Bishop": {
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
        case "Knigth": {
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
        case "Rook": {
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
        case "Queen": {
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