import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as d3 from 'd3-selection'

import { SquareType } from './classes/enum'
import { Maze } from './classes/maze'
import { Explorador } from './classes/explorador'

import { Service } from './servicos/servico.service'
import { AlgoritmosService } from './servicos/algoritmos.service';

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})

export class MatrizComponent implements OnInit {
  htmlElement: HTMLElement
  host: d3.Selection<any, any, any, any>

  width = 800
  height = 500
  border_width = 0.5

  lines = 25
  columns = 40

  maze: Maze

  algoritmoSelecionado: string

  constructor(private element: ElementRef, public snackBar: MatSnackBar, public service: Service, public servicoAlgoritmos: AlgoritmosService) {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement)

    this.maze = new Maze(this.lines, this.columns, this.width, this.height)

    this.iniciarListeners()
  }

  iniciarListeners() {
    this.service.limparAnnounced$.subscribe((deveLimpar) => {
      if (deveLimpar) {
        this.limpar()
      }
    })

    this.service.algoritmoAnnounced$.subscribe((algoritmoSelecionado) => {
      this.algoritmoSelecionado = algoritmoSelecionado
    })

    this.service.iniciarAnnounced$.subscribe((deveIniciar) => {
      if (deveIniciar) {
        this.iniciar()
      }
    })
  }

  ngOnInit() {
    this.drawMaze()
    this.modificarMatriz()
  }

  limpar() {
    this.maze.defineStartSquare(null)
    this.maze.defineEndSquare(null)

    d3.select('svg').selectAll('*').remove()

    this.desenharBordas()
    this.drawMaze()

    this.service.announceLimpar(false)
  }

  desenharBordas() {
    this.maze.square_array.forEach((line, i) => {
      this.host.select('svg')
        .append('g')
        .attr('class', 'row')
        .attr('id', `row${i}`)

      line.forEach((square, j) => {
        if (i === 0 || i === this.lines - 1 || j === 0 || j === this.columns - 1) {
          square.type = SquareType.wall
        } else {
          square.type = SquareType.path
        }
      })
    })
  }

  drawMaze() {
    const self = this

    this.servicoAlgoritmos.matriz(this.host, this.maze)

    this.host.select('svg')
      .style('margin', '10px')
      .style('box-shadow', '0px 0px 3px 2px rgba(0, 0, 0, .1)')
      .attr('width', this.width)
      .attr('height', this.height)

    this.maze.square_array.forEach((line, i) => {
      this.host.select('svg')
        .append('g')
        .attr('class', 'row')
        .attr('id', `row${i}`)

      line.forEach(column => {
        this.host
          .select(`#row${i}`)
          .datum(column)
          .append('rect')
          .attr('class', 'square')
          .attr('id', `square${pad(column.x, 4)}${pad(column.y, 4)}`)
          .attr('x', column.x * column.height)
          .attr('y', column.y * column.width)
          .attr('width', column.height)
          .attr('height', column.width)
          .style('fill', () => {
            return column.type
          })
          .style('stroke', '#BDBDBD')
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

  modificarMatriz() {
    this.servicoAlgoritmos.mudancaMatrizAnnounced$.subscribe((id) => {
      d3.select(`#${id}`).style('fill', id.type)
    })
  }

  iniciar() {
    this.service.announceIniciar(false)

    let explorador: Explorador;

    if (this.maze.getStartSquare()) {
      if (!this.maze.getEndSquare()) {
        this.showError('Fim do Labirinto Não Definido')
      } else {
        explorador = new Explorador(this.maze.getStartSquare(), this.maze.getEndSquare())
        this.executarAlgoritmo(explorador, this.algoritmoSelecionado)
      }
    } else {
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

  executarAlgoritmo(explorador: Explorador, algoritmo: string) {
    this.servicoAlgoritmos.algoritmos(this.algoritmoSelecionado)
  }
}

function pad(num, size) {
  const s = '000000000' + num;
  return s.substr(s.length - size);
}

