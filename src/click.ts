import { App, board } from './main';
import Game, { tileSize } from './game';
import { Piece, King } from './piece';
import { RandomAI, MinimaxAI } from './AI';

document.getElementById("back")!.onclick = function(){backButtonClick()}
document.getElementById("advance")!.onclick = function(){advanceButtonClick()}
document.getElementById("sound")!.onclick = function(){soundButtonClick()}
document.getElementById("start")!.onclick = function(){startButtonClick()}
document.getElementById("newGame")!.onclick = function(){newGameButtonClick()}

export var canvas: HTMLCanvasElement;
canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
canvas.onmousemove = function(event: MouseEvent){mouseMoved(event)}
canvas.onclick = function(){canvasClick()}

export var mouseX: number;
export var mouseY: number;
var moving: boolean;
var movingPiece: Piece;
var AI: RandomAI | MinimaxAI;

function canvasClick() {
    let x: number;
    let y: number;
    
    x = Math.floor(mouseX / tileSize);
    y = Math.floor(mouseY / tileSize);    
    if(!board.isDone()){
        if (!moving){
            if (board.pieceAt(x,y)){
                movingPiece = board.getPieceAt(x,y);
                movingPiece.movingThisPiece = true;
            }else{
                return;
            }
        }else{
            if(movingPiece.canMove(x,y,board)){
                movingPiece.move(x,y,board);
                // console.log(AI.getBoardAbsoluteValue(board.blackPieces, board.whitePieces));
                board.kingUnderAttack(board.whitePieces[0] as King);
                board.kingUnderAttack(board.blackPieces[0] as King);
                AI.makeMove();
            }
            movingPiece.movingThisPiece = false;
        }
        console.log(moving);
        moving = !moving;
        console.log(moving);      
        board.setScore();
    }
}

function backButtonClick(){

}

function advanceButtonClick(){

}

function soundButtonClick(){

}

function startButtonClick(){    
    let app: App = new App(new Game());
    let el: HTMLSelectElement;
    let ai: string;
    let color: string;
    let rEl: any;
    let coc: HTMLDivElement;

    coc = document.getElementById("canvas-overlay-container") as HTMLDivElement;
    coc.style.display = "none";

    color = "";
    el = (document.getElementById("AI-Selection") as HTMLSelectElement);
    ai = (<HTMLOptionElement>el.options[el.selectedIndex]).value;
    rEl = document.getElementsByName("Color");
    app.setup();
    switch(ai){
        case "Random":{
            AI = new RandomAI(board, false);
            break;
        }
        case "MiniMax": {
            AI = new MinimaxAI(board, false);
            break;
        }
    }
    if (rEl.checked) {
        color = rEl.value as string;
    }
    console.log("Welcome " + name + " you 're playing against " + ai + " you have the " + color + " Pieces");
}

function mouseMoved(event: MouseEvent){
    getMousePos(event);
}

function getMousePos(event: MouseEvent): void{
    let rect: DOMRect
    rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

function newGameButtonClick(){
    // let coc: HTMLDivElement;

    // coc = document.getElementById("canvas-overlay-container") as HTMLDivElement;
    // coc.style.display = "initial";
}