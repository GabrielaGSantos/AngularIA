// Aqui ficam as funcionalidades de desenho na tela!

import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import * as d3 from 'd3-selection'
import * as drag from 'd3-drag'
import { TipoCelula } from './classes/tipoCelula'
import { Labirinto, PropriedadesLabirinto } from './classes/labirinto'
import { Explorador } from './classes/explorador'

import { PainelControle } from './servicos/painelControle.service'
import { AlgoritmosService } from './servicos/algoritmos.service';
import { Celula } from './classes/celula';

let self: MatrizComponent

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})

export class MatrizComponent {
  htmlElement: HTMLElement
  host: d3.Selection<any, any, any, any>

  larguraBordaQuadrado = 0.5

  labirinto: Labirinto

  algoritmoSelecionado: string

  constructor(private element: ElementRef,
    public snackBar: MatSnackBar,
    public service: PainelControle,
    public servicoAlgoritmos: AlgoritmosService) {

    self = this

    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement)
    this.labirinto = this.copiarLabirinto(this.servicoAlgoritmos.labirinto)
    this.servicoAlgoritmos.mudancaLabirintoAnnounced$.subscribe(this.atualizaLabirinto)
    this.servicoAlgoritmos.erroAnnounced$.subscribe(this.mostrarErro)

    this.desenhaLabirinto()
  }

  desenhaLabirinto() {
    this.host
      .append('svg')
      .attr('id', 'desenhoLabirinto')
      .attr('width', this.servicoAlgoritmos.propriedadesLabirinto.largura)
      .attr('height', this.servicoAlgoritmos.propriedadesLabirinto.altura)
      .style('margin', '10px')
      .style('box-shadow', '0px 0px 3px 2px rgba(0, 0, 0, .1)')
      .call(drag.drag()
        .on('start', () => {
          // Verifica se está com o mouse em cima de um quadrado (pois se está fora do labirinto, vai lançar erro)
          if (d3.event.sourceEvent.srcElement.className.baseVal === 'square') {
            this.servicoAlgoritmos.dragStarted(d3.select(`#${d3.event.sourceEvent.srcElement.id}`).datum())
          }
        })
        .on('drag', () => {
          // Verifica se está com o mouse em cima de um quadrado (pois se está fora do labirinto, vai lançar erro)
          if (d3.event.sourceEvent.srcElement.className.baseVal === 'square') {
            this.servicoAlgoritmos.dragged(d3.select(`#${d3.event.sourceEvent.srcElement.id}`).datum())
          }
        })
        .on('end', () => {
          this.servicoAlgoritmos.dragEnded(d3.select(`#${d3.event.sourceEvent.srcElement.id}`).datum())
        })
      )

    this.labirinto.vetorCelulas.forEach((linha, posicaoLinha) => {
      this.host.select('svg')
        .append('g')
        .attr('class', 'row')
        .attr('id', `row${posicaoLinha}`)

      linha.forEach(celula => {
        this.desenhaCelula(celula)
      })
    })
  }

  desenhaCelula(celula) {
    this.host
      .select(`#row${celula.y}`)
      .datum(celula)
      .append('rect')
      .attr('class', 'square')
      .attr('id', `square${zeroAEsquerda(celula.x, 4)}${zeroAEsquerda(celula.y, 4)}`)
      .attr('x', celula.x * celula.altura)
      .attr('y', celula.y * celula.largura)
      .attr('width', celula.altura)
      .attr('height', celula.largura)
      .style('fill', () => {
        return celula.tipo
      })
      .style('stroke', '#BDBDBD')
      .on('mouseenter', function (d) {
        d3.select(this).style('stroke-offset', '5px')
        d3.select(this).style('stroke', 'white')
      })
      .on('mouseleave', function (d) {
        d3.select(this).style('stroke', '#BDBDBD')
      })
  }

  atualizaLabirinto(novoLabirinto: Labirinto) {
    self.labirinto.celulasDiferentes(novoLabirinto).forEach((celulaDiferente) => {
      self.host
        .select(`#square${zeroAEsquerda(celulaDiferente.x, 4)}${zeroAEsquerda(celulaDiferente.y, 4)}`)
        .style('fill', celulaDiferente.tipo)
        .datum(celulaDiferente)
    })

    self.labirinto = self.copiarLabirinto(self.servicoAlgoritmos.labirinto)

    self.service.announceSalvar(true)
  }

  copiarLabirinto(novoLabirinto: Labirinto) {
    const labirinto = new Labirinto(novoLabirinto.propriedades)
    labirinto.vetorCelulas = new Array()

    novoLabirinto.vetorCelulas.forEach((linha) => {
      let novaLinha = new Array<Celula>()

      // É neceessário criar um novo quadrado, senão será feita referência ao de Algoritmo, e buga tudo!
      linha.forEach((celula) => {
        novaLinha.push(new Celula(celula.x, celula.y, celula.largura, celula.altura, celula.tipo))
      })

      labirinto.vetorCelulas.push(novaLinha)
    })

    return labirinto
  }

  mostrarErro(mensagem: string) {
    self.snackBar.open(mensagem, 'Fechar', {
      duration: 2000
    });
  }
}

function zeroAEsquerda(num, size) {
  const s = '000000000' + num;
  return s.substr(s.length - size);
}

