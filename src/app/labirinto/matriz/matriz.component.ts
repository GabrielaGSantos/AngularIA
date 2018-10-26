import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3-selection'

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})

export class MatrizComponent implements OnInit {
  htmlElement: HTMLElement;
  host: d3.Selection<any, any, any, any>;

  side = 500;
  border_width = 0.5;

  lines: number = 10;
  columns: number = 10

  maze: Maze

  constructor(private element: ElementRef) {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement)

    this.maze = new Maze(this.lines, this.columns, this.side)

  }

  ngOnInit() {
    this.drawMaze()
  }


  drawMaze() {
    let self = this

    this.host.select('svg')
      .style('margin', '10px')
      .style('box-shadow', '0px 0px 3px 2px rgba(0, 0, 0, .1)')
      .attr('width', this.side)
      .attr('height', this.side)
      .attr("transform", "translate(" + 375 + "," + 0 + ")scale(" + 1 + ")")

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
          .attr("id", `square${square.x}`)
          .attr("x", square.x * square.height)
          .attr("y", square.y * square.width)
          .attr("width", square.height)
          .attr("height", square.width)
          .style("fill", "#fff")
          .style("stroke", "#BDBDBD")
          .on('click', function (d) {
            self.maze.click(d)
            if (d.type == SquareType.path)
              d3.select(this).style('fill', 'white')
            if (d.type == SquareType.wall)
              d3.select(this).style('fill', '#9E9E9E')
            if (d.type == SquareType.start)
              d3.select(this).style('fill', '#8BC34A')
            if (d.type == SquareType.end)
              d3.select(this).style('fill', '#E53935')
          })
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

}

enum SquareType {
  path = 0,
  wall = 1,
  start = 2,
  end = 3
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

  constructor(lines: number, columns: number, side: number) {
    this.square_array = new Array()

    for (var i = 0; i < lines; i++) {
      var new_line = new Array()

      for (var j = 0; j < columns; j++) {
        var new_square = new Square(j, i, side / columns, side / lines, SquareType.path)
        new_line.push(new_square)
      }

      this.square_array.push(new_line)

    }
  }

  click(element: Square) {
    console.log(element)

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
    if (!this.start_square)
      this.start_square = start
  }

  defineEndSquare(end: Square) {
    if (!this.end_square)
      this.end_square = end
  }

  getStartSquare() {
    return this.start_square
  }

  getEndSquare() {
    return this.end_square
  }
}