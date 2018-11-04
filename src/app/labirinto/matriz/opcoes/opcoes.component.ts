import { Component, OnInit } from '@angular/core'
import { PainelControle } from '../servicos/painelControle.service'

let self: OpcoesComponent
@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.component.html',
  styleUrls: ['./opcoes.component.css']
})

export class OpcoesComponent implements OnInit {

  algs: Algoritmo[] = [
    { nome: 'bfs', viewNome: 'Busca em Largura' },
    { nome: 'dfs', viewNome: 'Busca em Profundidade' },
    { nome: 'ucs', viewNome: 'Busca de Custo Uniforme' }
  ];

  algoritmoSelecionado = ''
  private desabilitarParar = true;
  private desabilitarIniciar = true;
  private desabilitarPausar = true;
  private desabilitarLimpar = false;

  constructor(public painelControleService: PainelControle) {
    self = this

    this.painelControleService.botoesAnnounced$.subscribe((array) => {
      this.desabilitarBotoes()
      array.forEach(botao => this.habilitarBotao(botao))
    })
  }

  ngOnInit() {
  }

  limpar() {
    if (!this.desabilitarLimpar) {
      this.painelControleService.announceLimpar(true)
    }
  }

  iniciar() {
    if (!this.desabilitarIniciar) {
      this.painelControleService.announceIniciar(true)
    }
  }

  pausar() {
    if (!this.desabilitarPausar) {
      this.painelControleService.announcePausar(true)
    }
  }

  cancelar() {
    if (!this.desabilitarParar) {
      this.painelControleService.announceParar(true)
    }
  }

  mudarAlgoritmo() {
    self.painelControleService.announceAlgoritmo(self.algoritmoSelecionado)
  }

  desabilitarBotoes() {
    this.desabilitarParar = true
    this.desabilitarIniciar = true
    this.desabilitarPausar = true
    this.desabilitarLimpar = true
  }

  habilitarBotao(botao: string) {
    if (botao === 'parar') {
      this.desabilitarParar = false;
    } else if (botao === 'iniciar') {
      this.desabilitarIniciar = false
    } else if (botao === 'pausar') {
      this.desabilitarPausar = false
    } else if (botao === 'limpar') {
      this.desabilitarLimpar = false
    }
  }
}

export interface Algoritmo {
  nome: string;
  viewNome: string;
}
