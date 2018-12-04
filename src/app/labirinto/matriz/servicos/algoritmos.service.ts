import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { TipoCelula } from '../classes/tipoCelula';
import { Labirinto, PropriedadesLabirinto } from '../classes/labirinto';
import { Celula } from '../classes/celula';
import { PainelControle } from './painelControle.service';
import { Explorador } from '../classes/explorador';
import { No } from '../classes/no';

let self: AlgoritmosService

@Injectable({
  providedIn: 'root'
})
export class AlgoritmosService {
  propriedadesLabirinto: PropriedadesLabirinto = {
    altura: 500,
    largura: 800,
    numColunas: 40,
    numLinhas: 25
  }

  // Propriedades para Drag
  ultimaCelulaAvaliada: Celula;
  tipoAvaliado: TipoCelula;

  // Algoritmo a Ser Executado
  algoritmoSelecionado: string;

  // Algoritmo a Ser Executado
  heuristicaSelecionada: string;
  erro: string;

  borda: Array<No> = new Array<No>()

  explorador: Explorador;

  pausado: boolean = true

  // Observável de Mundança no Labirinto
  private mudancaLabirintoAnnounceSource = new Subject<Labirinto>()
  mudancaLabirintoAnnounced$ = this.mudancaLabirintoAnnounceSource.asObservable()
  labirinto = new Labirinto(this.propriedadesLabirinto)

  private erroAnnounceSource = new Subject<string>()
  erroAnnounced$ = this.erroAnnounceSource.asObservable()

  private statusAlgoritmo = 'parado'

  constructor(public painelControleService: PainelControle) {
    self = this
    this.mudancaLabirintoAnnounceSource.next(this.labirinto)
    this.iniciarListeners()
  }

  iniciarListeners() {
    this.painelControleService.limparAnnounced$.subscribe(this.limparLabirinto)
    this.painelControleService.algoritmoAnnounced$.subscribe(this.mudarAlgoritmo)
    this.painelControleService.heristicaAnnounced$.subscribe(this.mudarHeuristica)
    this.painelControleService.iniciarAnnounced$.subscribe(this.iniciarAlgoritmo)
    this.painelControleService.pausarAnnounced$.subscribe(this.pausarAlgoritmo)
    this.painelControleService.pararAnnounced$.subscribe(this.pararAlgoritmo)
  }

  algoritmos() {

    if (this.algoritmoSelecionado === 'bfs')
      this.bfs()

    if (this.algoritmoSelecionado === 'dfs')
      this.dfs()

    if (this.algoritmoSelecionado === 'ucs')
      this.ucs()

    if (this.algoritmoSelecionado === 'a*')
      this.aestrela()
  }

  dragStarted(celulaAtual) {
    if (self.statusAlgoritmo === 'parado') {
      this.labirinto.click(celulaAtual)
      this.ultimaCelulaAvaliada = celulaAtual
      this.tipoAvaliado = this.labirinto.vetorCelulas[celulaAtual.y][celulaAtual.x].tipo
      this.mudancaLabirintoAnnounceSource.next(this.labirinto)
    }
  }

  dragged(celulaAtual) {
    if (self.statusAlgoritmo === 'parado' && !celulaAtual.igual(this.ultimaCelulaAvaliada)
      && (this.tipoAvaliado === TipoCelula.caminho || this.tipoAvaliado === TipoCelula.parede)) {
      this.ultimaCelulaAvaliada = celulaAtual;

      if (this.ultimaCelulaAvaliada.tipo === TipoCelula.inicio) {
        this.labirinto.setPosicaoInicial(null)
      }
      if (this.ultimaCelulaAvaliada.tipo === TipoCelula.fim) {
        this.labirinto.setPosicaoFinal(null)
      }

      this.labirinto.vetorCelulas[celulaAtual.y][celulaAtual.x].tipo = this.tipoAvaliado
    }

    this.mudancaLabirintoAnnounceSource.next(this.labirinto)
  }

  dragEnded(curSquare) {
    this.ultimaCelulaAvaliada = null
    this.tipoAvaliado = null
  }

  limparLabirinto(sujo: boolean) {
    if (sujo) {
      self.labirinto = new Labirinto(self.propriedadesLabirinto)
      self.mudancaLabirintoAnnounceSource.next(self.labirinto)
    }
  }

  mudarAlgoritmo(algoritmoNovo: string) {
    self.algoritmoSelecionado = algoritmoNovo
    self.pararAlgoritmo(true)
    self.painelControleService.habilitarBotao('iniciar')
    self.painelControleService.habilitarBotao('limpar')
    self.painelControleService.desabilitarBotao('parar')
    self.painelControleService.desabilitarBotao('pausar')
  }

  mudarHeuristica(heuristicaNova: string) {
    self.heuristicaSelecionada = heuristicaNova
    self.pararAlgoritmo(true)
    self.painelControleService.habilitarBotao('iniciar')
    self.painelControleService.habilitarBotao('limpar')
    self.painelControleService.desabilitarBotao('parar')
    self.painelControleService.desabilitarBotao('pausar')
  }

  iniciarAlgoritmo(podeIniciar: boolean) {
    if (podeIniciar) {
      console.log('iniciar')
      self.pausado = false

      if (self.labirinto.getPosicaoInicial()) {
        if (self.labirinto.getPosicaoFinal()) {
          self.painelControleService.desabilitarBotao('iniciar')
          self.painelControleService.desabilitarBotao('limpar')
          self.painelControleService.habilitarBotao('parar')
          self.painelControleService.habilitarBotao('pausar')
          self.statusAlgoritmo = 'rodando'
          self.algoritmos()
        } else {
          self.erroAnnounceSource.next('Fim do Labirinto Não Definido')
        }
      } else {
        self.erroAnnounceSource.next('Início do Labirinto Não Definido')
      }
    }

  }

  pausarAlgoritmo(podePausar: boolean) {
    if (podePausar) {
      console.log('pausar')
      self.pausado = true
      self.statusAlgoritmo = 'pausado'
      self.painelControleService.habilitarBotao('iniciar')
      self.painelControleService.desabilitarBotao('limpar')
      self.painelControleService.habilitarBotao('parar')
      self.painelControleService.desabilitarBotao('pausar')

      self.bfs_iter()
    }
  }

  pararAlgoritmo(podeParar: boolean) {
    if (podeParar) {
      console.log('parar')
      self.statusAlgoritmo = 'parado'
      self.painelControleService.habilitarBotao('iniciar')
      self.painelControleService.habilitarBotao('limpar')
      self.painelControleService.desabilitarBotao('parar')
      self.painelControleService.desabilitarBotao('pausar')
      self.explorador = null
      self.borda = new Array<No>()

      self.labirinto.vetorCelulas.forEach((linha, i) => {
        linha.forEach((celula, j) => {
          if (celula.tipo == TipoCelula.explorador || celula.tipo == TipoCelula.solucao)
            celula.tipo = TipoCelula.caminho
        })
      })

      self.labirinto.getPosicaoInicial().tipo = TipoCelula.inicio
      self.labirinto.getPosicaoFinal().tipo = TipoCelula.fim

      self.mudancaLabirintoAnnounceSource.next(self.labirinto)
    }
  }

  bfs() {
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, null)

    self.borda.push(no)

    self.bfs_iter()
  }

  bfs_iter() {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()
    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      return
    }

    else {
      let possibilidades = self.explorador.checarAcoes(self.labirinto)

      possibilidades.forEach(possibilidade => {
        let filho = no.criarNoFilho(possibilidade, 1, null)

        if (self.borda.filter(item => filho.estado == item.estado).length == 0)
          self.borda.push(filho)
      })
    }

    if (!self.pausado) {
      setTimeout(() => {
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        self.bfs_iter()
      }, 10)
    }
  }

  dfs() {
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    console.log("dfs")
    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, null)

    self.borda.unshift(no)

    self.dfs_iter()

  }

  dfs_iter() {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()
    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      return
    }

    else {
      let possibilidades = self.explorador.checarAcoes(self.labirinto)

      possibilidades.forEach(possibilidade => {
        let filho = no.criarNoFilho(possibilidade, 1, null)

        if (self.borda.filter(item => filho.estado == item.estado).length == 0)
          self.borda.unshift(filho)
      })
    }

    if (!self.pausado) {
      setTimeout(() => {
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        self.dfs_iter()
      }, 10)
    }
  }

  ucs(){
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    console.log("ucs")
    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, null)

    self.borda.unshift(no)

    self.ucs_iter()
  }

  ucs_iter(){
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()

    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      return
    }

    else {
      let possibilidades = self.explorador.checarAcoes(self.labirinto)

      possibilidades.forEach(possibilidade => {
        let filho = no.criarNoFilho(possibilidade, self.gerarCusto(no), null)

        if (self.borda.length == 0)
          self.borda.push(filho)

        else if (self.borda.filter(item => filho.estado == item.estado).length == 0) {
          this.adicionarOrdenado(self.borda, filho, false)
        }

        else {
          this.adicionarOrdenado(self.borda, filho, true)
        }
      })
    }

    if (!self.pausado) {
      setTimeout(() => {
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        self.ucs_iter()
      }, 10)
    }

  }

  aestrela() {
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    console.log("a*")
    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, 0)

    self.borda.unshift(no)

    self.aestrela_iter()
  }

  aestrela_iter() {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()

    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      return
    }

    else {
      let possibilidades = self.explorador.checarAcoes(self.labirinto)

      possibilidades.forEach(possibilidade => {
        let filho = no.criarNoFilho(possibilidade, self.gerarCusto(no), self.gerarF(no, self.explorador))

        if (self.borda.length == 0)
          self.borda.push(filho)

        else if (self.borda.filter(item => filho.estado == item.estado).length == 0) {
          this.adicionarOrdenado(self.borda, filho, false)
        }

        else {
          this.adicionarOrdenado(self.borda, filho, true)
        }
      })
    }

    if (!self.pausado) {
      setTimeout(() => {
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        self.aestrela_iter()
      }, 10)
    }
  }

  adicionarOrdenado(borda: Array<No>, no: No, replace: boolean) {
    let pos = 0;

    if(self.algoritmoSelecionado == 'a*'){
      borda.forEach((item, i) => {
        if (no.funcao > item.funcao)
          pos = i;
      })
  
      if(replace)
        borda.splice(pos, 1, no)
      else
        borda.splice(pos+1, 0, no)
    }

    else if(self.algoritmoSelecionado == 'ucs'){
      borda.forEach((item, i) => {
        if (no.custo > item.custo)
          pos = i;
      })
  
      if(replace)
        borda.splice(pos, 1, no)
      else
        borda.splice(pos+1, 0, no)
    }
        
  }

  gerarCusto(no: No) {
    return no.custo + 1
  }

  gerarManhattan(no: No, explorador: Explorador) {
    let x = no.estado.x - explorador.posicaoFinal.x
    let y = no.estado.y - explorador.posicaoFinal.y

    let manhattan = Math.abs(x + y)

    return manhattan
  }

  gerarEuclidiana(no: No, explorador: Explorador) {
    let x = Math.pow(no.estado.x - explorador.posicaoFinal.x, 2)
    let y = Math.pow(no.estado.y - explorador.posicaoFinal.y, 2)

    let euclidiana = Math.pow((x + y), 1 / 2)
    return euclidiana

  }

  gerarF(no: No, explorador: Explorador) {
    let F = 0

    if (self.heuristicaSelecionada == 'mtt') {
      F = self.gerarCusto(no) + self.gerarManhattan(no, explorador)
    }

    if (self.heuristicaSelecionada == 'euc') {
      F = self.gerarCusto(no) + self.gerarEuclidiana(no, explorador)
    }
    return F
  }

  pintarSolucao(no: No) {
    let noAtual = no

    while (noAtual) {
      noAtual.estado.mudarTipo(TipoCelula.solucao)
      self.mudancaLabirintoAnnounceSource.next(self.labirinto)
      noAtual = noAtual.pai
    }
  }

}

