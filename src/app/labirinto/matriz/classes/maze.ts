import { Square } from "./square";
import { SquareType } from "./enum";

export class Maze {
    square_array: Array<Array<Square>>
  
    private start_square: Square
    private end_square: Square
  
    constructor(lines: number, columns: number, width: number, height: number) {
      this.square_array = new Array()
  
      for (let i = 0; i < lines; i++) {
        const new_line = new Array()
  
        for (let j = 0; j < columns; j++) {
          let new_square
  
          if (i === 0 || i === lines - 1 || j === 0 || j === columns - 1) {
            new_square = new Square(j, i, width / columns, height / lines, SquareType.wall)
          } else {
            new_square = new Square(j, i, width / columns, height / lines, SquareType.path)
          }
  
          new_line.push(new_square)
        }
  
        this.square_array.push(new_line)
      }
    }
  
    click(element: any) {
      if (element.type === SquareType.path) {
        element.type = SquareType.wall
      } else if (element.type === SquareType.wall) {
        if ((!this.start_square)) {
          element.type = SquareType.start
          this.start_square = element
        } else if ((!this.end_square)) {
          element.type = SquareType.end
          this.end_square = element
        } else {
          element.type = SquareType.path
        }
      } else if (element.type === SquareType.start) {
        this.start_square = null
  
        if ((!this.end_square)) {
          element.type = SquareType.end
          this.end_square = element
        } else {
          element.type = SquareType.path
        }
      } else if (element.type == SquareType.end) {
        this.end_square = null
        element.type = SquareType.path
      }
    }
  
    defineStartSquare(start: Square) {
      this.start_square = start
    }
  
    defineEndSquare(end: Square) {
      this.end_square = end
    }
  
    getStartSquare() {
      return this.start_square
    }
  
    getEndSquare() {
      return this.end_square
    }
  }