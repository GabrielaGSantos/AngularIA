import { SquareType } from './enum'

export class Square {
    x: number
    y: number
    width: number
    height: number
    type: SquareType

    constructor(x: number, y: number, width: number, height: number, type: SquareType) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.type = type
    }
}