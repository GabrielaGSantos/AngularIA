import { Square } from "./square";
import { SquareType } from "./enum";

export class Explorador {
    position_inicial: Square
    position_final: Square
    last_type: SquareType
  
    constructor(initial_square: Square, final_square: Square) {
      this.position_inicial = initial_square
      this.last_type = initial_square.type
      this.position_final = final_square
  
      initial_square.type = SquareType.explorador
    }
  }
  
  