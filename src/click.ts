import { App } from './main';
import Game from './game';

document.getElementById("back")!.onclick = function(){backButtonClick()}
document.getElementById("advance")!.onclick = function(){advanceButtonClick()}
document.getElementById("sound")!.onclick = function(){soundButtonClick()}
document.getElementById("start")!.onclick = function(){startButtonClick()}
document.getElementById("newGame")!.onclick = function(){newGameButtonClick()}

export var canvas: HTMLCanvasElement;
canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
canvas.onmousemove = function(event: MouseEvent){mouseMoved(event)}

export var mouseX: number;
export var mouseY: number;

// window.onload = () => {
// 	let app = new App(new Game());

// 	app.setup();
// }

function backButtonClick(){

}

function advanceButtonClick(){

}

function soundButtonClick(){

}

function startButtonClick(){    
    let app: App = new App(new Game());
    
    app.setup();
}

function mouseMoved(event: MouseEvent){
    mouseX = event.pageX;
    mouseY = event.pageY;
}

function newGameButtonClick(){

}