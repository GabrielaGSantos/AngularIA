import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Service } from './servico.service'

import * as d3 from 'd3-selection'
import * as drag from 'd3-drag'

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})

export class MatrizComponent implements OnInit {
  htmlElement: HTMLElement;
  host: d3.Selection<any, any, any, any>;

  width = 800;
  height = 500;
  border_width = 0.5;

  lines: number = 25;
  columns: number = 40

  teste: string

  maze: Maze

  constructor(private element: ElementRef, public snackBar: MatSnackBar, public service: Service) {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement)

    this.maze = new Maze(this.lines, this.columns, this.width, this.height)

  }

  ngOnInit() {
    this.drawMaze()
    this.service.emitirEvento.subscribe(
      teste => console.log(teste)
    );
  }

  limpar() {
    this.maze.defineStartSquare(null)
    this.maze.defineEndSquare(null)

    d3.select("svg").selectAll("*").remove()

    this.desenharBordas()
    this.drawMaze()
  }

  handleEvent(event) {
    if (event.evento == 'limpar')
      this.limpar()
    if (event.evento == 'iniciar')
      this.iniciar(event.algoritmo)
    if (event.evento == 'pausar')
      this.pausar()
    if (event.evento == 'cancelar')
      this.cancelar()
  }

  desenharBordas() {
    this.maze.square_array.forEach((line, i) => {
      this.host.select('svg')
        .append('g')
        .attr('class', 'row')
        .attr('id', `row${i}`)

      line.forEach((square, j) => {
        if (i == 0 || i == this.lines - 1 || j == 0 || j == this.columns - 1)
          square.type = SquareType.wall
        else
          square.type = SquareType.path
      })
    })
  }

  drawMaze() {
    let self = this

    let cur_sqr;
    let square: any;
    let type: SquareType;

    this.host.select('svg')
      .style('margin', '10px')
      .style('box-shadow', '0px 0px 3px 2px rgba(0, 0, 0, .1)')
      .attr('width', this.width)
      .attr('height', this.height)
      .call(drag.drag()
        .on('start', () => {
          cur_sqr = d3.event.sourceEvent.srcElement.id;
          square = d3.select(`#${cur_sqr}`).datum()

          self.maze.click(square)

          d3.select(`#${cur_sqr}`).style('fill', square.type)
          type = square.type
        })

        .on('drag', () => {
          if (d3.event.sourceEvent.srcElement.id != cur_sqr && (type == SquareType.path || type == SquareType.wall)) {
            cur_sqr = d3.event.sourceEvent.srcElement.id;
            square = d3.select(`#${cur_sqr}`).datum()

            if (square.type == SquareType.start)
              self.maze.defineStartSquare(null)
            if (square.type == SquareType.end)
              self.maze.defineEndSquare(null)

            square.type = type

            d3.select(`#${cur_sqr}`).style('fill', square.type)
          }
        })
        .on('end', () => {
          cur_sqr = null
          square = null
          type = null
        })
      )

    this.maze.square_array.forEach((line, i) => {
      this.host.select('svg')
        .append('g')
        .attr('class', 'row')
        .attr('id', `row${i}`)

      line.forEach(square => {
        this.host
          .select(`#row${i}`)
          .datum(square)
          .append('rect')
          .attr("class", "square")
          .attr("id", `square${pad(square.x, 4)}${pad(square.y, 4)}`)
          .attr("x", square.x * square.height)
          .attr("y", square.y * square.width)
          .attr("width", square.height)
          .attr("height", square.width)
          .style("fill", () => {
            return square.type
          })
          .style("stroke", "#BDBDBD")
          .on('mouseenter', function (d) {
            d3.select(this).style('stroke-offset', '5px')
            d3.select(this).style('stroke', 'white')
          })
          .on('mouseleave', function (d) {
            d3.select(this).style('stroke', '#BDBDBD')
          })
      })
    })
  }

  iniciar(algoritmo: string) {
    let explorador: Explorador;

    console.log(algoritmo)

    if (this.maze.getStartSquare()) {
      if (!this.maze.getEndSquare())
        this.showError('Fim do Labirinto Não Definido')
      else {
        explorador = new Explorador(this.maze.getStartSquare(), this.maze.getEndSquare())
        this.executarAlgoritmo(explorador)
      }
    }

    else {
      this.showError('Início do Labirinto Não Definido')
    }
  }

  pausar() { }

  cancelar() { }

  showError(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 2000
    });
  }

  executarAlgoritmo(explorador: Explorador) {

  }
}

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

enum SquareType {
  path = "#FFF",
  wall = "#BDBDBD",
  start = "#09af00",
  end = "#E53935",
  explorador = "#B3E5FC"
}

class Square {
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

class Maze {
  square_array: Array<Array<Square>>

  private start_square: Square
  private end_square: Square

  constructor(lines: number, columns: number, width: number, height: number) {
    this.square_array = new Array()

    for (var i = 0; i < lines; i++) {
      var new_line = new Array()

      for (var j = 0; j < columns; j++) {
        var new_square

        if (i == 0 || i == lines - 1 || j == 0 || j == columns - 1)
          new_square = new Square(j, i, width / columns, height / lines, SquareType.wall)

        else
          new_square = new Square(j, i, width / columns, height / lines, SquareType.path)

        new_line.push(new_square)
      }

      this.square_array.push(new_line)
    }
  }

  click(element: any) {
    if (element.type == SquareType.path)
      element.type = SquareType.wall

    else if (element.type == SquareType.wall) {
      if ((!this.start_square)) {
        element.type = SquareType.start
        this.start_square = element
      }

      else if ((!this.end_square)) {
        element.type = SquareType.end
        this.end_square = element
      }

      else
        element.type = SquareType.path
    }

    else if (element.type == SquareType.start) {
      this.start_square = null

      if ((!this.end_square)) {
        element.type = SquareType.end
        this.end_square = element
      }

      else
        element.type = SquareType.path
    }

    else if (element.type == SquareType.end) {
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

class Explorador {
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

