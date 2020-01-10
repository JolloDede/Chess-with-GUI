import { canvas } from "./click";

export var tileSize: number;

export default class Game{
    ctx: CanvasRenderingContext2D;
    
    constructor(){
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (canvas.height == canvas.width){
            tileSize = canvas.height / 8;
        }
    }

    public render(){
        console.log("Render");
    }
}