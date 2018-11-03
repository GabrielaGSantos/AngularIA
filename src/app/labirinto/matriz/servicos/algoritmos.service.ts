import { Injectable } from '@angular/core';

import * as d3 from 'd3-selection'
import * as drag from 'd3-drag'
import { Subject } from 'rxjs';
import { SquareType } from '../classes/enum';
import { Maze } from '../classes/maze';

@Injectable({
  providedIn: 'root'
})
export class AlgoritmosService {

  constructor() { }

  private mudancaMatrizAnnounced = new Subject<any>()
  mudancaMatrizAnnounced$ = this.mudancaMatrizAnnounced.asObservable()


  matriz(host: d3.Selection<any, any, any, any>, maze: Maze) {

    console.log(maze)

    let cur_sqr;
    let square: any;
    let type: SquareType;

    host.select('svg')
      .call(drag.drag()
        .on('start', () => {
          cur_sqr = d3.event.sourceEvent.srcElement.id;
          square = d3.select(`#${cur_sqr}`).datum()

          maze.click(square)

          this.mudancaMatrizAnnounced.next(cur_sqr)
          type = square.type
        })

        .on('drag', () => {
          if (d3.event.sourceEvent.srcElement.id != cur_sqr && (type == SquareType.path || type == SquareType.wall)) {
            cur_sqr = d3.event.sourceEvent.srcElement.id;
            square = d3.select(`#${cur_sqr}`).datum()

            if (square.type === SquareType.start) {
              maze.defineStartSquare(null)
            }
            if (square.type === SquareType.end) {
              maze.defineEndSquare(null)
            }

            square.type = type

            this.mudancaMatrizAnnounced.next(cur_sqr)
          }
        })
        .on('end', () => {
          cur_sqr = null
          square = null
          type = null
        })
      )
  }

  algoritmos(algoritmo: string) {
    if (algoritmo == "bfs")
      console.log("é bfs")
  }
}
