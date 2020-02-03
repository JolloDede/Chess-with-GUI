export interface IVector {
    x: number;
    y: number;
}

export function createVector(x: number, y: number) {
    return { x: x, y: y } as IVector
}

export interface IMove {
    from: IVector;
    to: IVector;
}

export interface IMoveAssosiation {
    move: IMove;
    nodeNr: number;
}