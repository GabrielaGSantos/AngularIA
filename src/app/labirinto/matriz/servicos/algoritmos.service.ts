import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { TipoCelula } from '../classes/tipoCelula';
import { Labirinto, PropriedadesLabirinto } from '../classes/labirinto';
import { Celula } from '../classes/celula';
import { PainelControle } from './painelControle.service';
import { Explorador } from '../classes/explorador';
import { No } from '../classes/no';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  constructor(public painelControleService: PainelControle, private sanitizer: DomSanitizer) {
    self = this
    this.mudancaLabirintoAnnounceSource.next(this.labirinto)
    this.iniciarListeners()
  }

  iniciarListeners() {
    this.painelControleService.limparAnnounced$.subscribe(this.limparLabirinto)
    this.painelControleService.salvarAnnounced$.subscribe(this.salvarLabirinto)
    this.painelControleService.abrirAnnounced$.subscribe(this.abrirLabirinto)
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

  salvarLabirinto(salvar: boolean) {
    if (salvar) {
      var text = JSON.stringify(self.labirinto)
      var uri = self.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(text))

      self.painelControleService.announcelinkDownloadLabirinto(uri)
    }
  }

  abrirLabirinto(labirinto: Labirinto) {
    let novoLabirinto = new Labirinto(labirinto.propriedades)
    novoLabirinto.vetorCelulas = new Array<Array<Celula>>()

    labirinto.vetorCelulas.forEach((linha, i) => {
      novoLabirinto.vetorCelulas.push(new Array<Celula>())
      linha.forEach((celula, j) => {
        let novaCelula = new Celula(celula.x, celula.y, celula.largura, celula.altura, celula.tipo)
        novoLabirinto.vetorCelulas[i].push(novaCelula)
      })
    })

    let posicaoInicial = novoLabirinto.vetorCelulas[labirinto.posicaoInicial.y][labirinto.posicaoInicial.x]
    let posicaoFinal = novoLabirinto.vetorCelulas[labirinto.posicaoFinal.y][labirinto.posicaoFinal.x]

    novoLabirinto.vetorCelulas[posicaoInicial.y][posicaoInicial.x] = posicaoInicial
    novoLabirinto.vetorCelulas[posicaoFinal.y][posicaoFinal.x] = posicaoFinal

    novoLabirinto.setPosicaoFinal(posicaoFinal)
    novoLabirinto.setPosicaoInicial(posicaoInicial)

    self.labirinto = novoLabirinto;

    self.mudancaLabirintoAnnounceSource.next(self.labirinto)
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
    let iteracoes = 0
    self.bfs_iter(iteracoes)
  }

  bfs_iter(iteracoes: any) {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()
    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      console.log(iteracoes)
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
        self.bfs_iter(iteracoes+1)
      }, 10)
    }
  }

  dfs() {
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    console.log("dfs")
    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, null)

    self.borda.unshift(no)
    let iteracoes = 0

    self.dfs_iter(iteracoes)

  }

  dfs_iter(iteracoes: number) {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()
    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      console.log(iteracoes)
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
        self.dfs_iter(iteracoes+1)
      }, 10)
    }
  }

  ucs() {
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    console.log("ucs")
    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, null)

    self.borda.unshift(no)
    let iteracoes = 0

    self.ucs_iter(iteracoes)
  }

  ucs_iter(iteracoes: number) {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()

    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      console.log(iteracoes)
      return
    }

    else {
      let possibilidades = self.explorador.checarAcoes(self.labirinto)

      possibilidades.forEach(possibilidade => {
        let filho = no.criarNoFilho(possibilidade, self.gerarCusto(no), null)

        if (self.borda.length == 0)
          self.borda.push(filho)

        else if (self.borda.filter(item => filho.estado == item.estado).length == 0) {
          this.adicionarOrdenado(self.borda, filho)
        }

        else {
          self.borda.forEach((item, i) => {
            if (no.estado == item.estado && no.custo < item.custo)
              self.borda.splice(i, 1, filho)
          })
        }
      })
    }

    if (!self.pausado) {
      setTimeout(() => {
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        self.ucs_iter(iteracoes+1)
      }, 10)
    }

  }

  aestrela() {
    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    console.log("a*")
    let no: No = new No(self.explorador.getPosicaoAtual(), null, 1, 0)

    self.borda.unshift(no)
    let iteracoes = 0

    self.aestrela_iter(iteracoes)
  }

  aestrela_iter(iteracoes: number) {
    if (self.borda.length == 0)
      return

    let no = self.borda.shift()

    let posicaoAtual = no.estado

    self.explorador.mudarPosicao(posicaoAtual)
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    if (self.explorador.checarObjetivo()) {
      self.pintarSolucao(no)
      console.log(iteracoes)
      return
    }

    else {
      let possibilidades = self.explorador.checarAcoes(self.labirinto)

      possibilidades.forEach(possibilidade => {
        let filho = no.criarNoFilho(possibilidade, self.gerarCusto(no), self.gerarF(no, self.explorador))

        if (self.borda.length == 0)
          self.borda.push(filho)

        else if (self.borda.filter(item => filho.estado == item.estado).length == 0) {
          this.adicionarOrdenado(self.borda, filho)
        }

        else {
          self.borda.forEach((item, i) => {
            if (no.estado == item.estado && no.funcao < item.funcao)
              self.borda.splice(i, 1, filho)
          })
        }
      })
    }

    if (!self.pausado) {
      setTimeout(() => {
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        self.aestrela_iter(iteracoes+1)
      }, 10)
    }
  }

  adicionarOrdenado(borda: Array<No>, no: No) {
    let pos = 0;

    if(self.algoritmoSelecionado === 'ucs'){
      borda.forEach((item, i) => {
        if (no.custo > item.custo)
          pos = i;
      })  
      borda.splice(pos + 1, 0, no)
    }
    else{
      borda.forEach((item, i) => {
        if (no.funcao > item.funcao)
          pos = i;
      })  
      borda.splice(pos + 1, 0, no)
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

    let quantidadeNos = 0

    while (noAtual) {
      noAtual.estado.mudarTipo(TipoCelula.solucao)
      self.mudancaLabirintoAnnounceSource.next(self.labirinto)
      noAtual = noAtual.pai
      quantidadeNos = quantidadeNos + 1
    }

    console.log("nós solucao: "+ quantidadeNos)
  }

}

