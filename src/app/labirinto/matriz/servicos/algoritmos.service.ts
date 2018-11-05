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
  erro: string;
  
  explorador: Explorador;

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
    this.painelControleService.iniciarAnnounced$.subscribe(this.iniciarAlgoritmo)
    this.painelControleService.pausarAnnounced$.subscribe(this.pausarAlgoritmo)
    this.painelControleService.pararAnnounced$.subscribe(this.pararAlgoritmo)
  }

  algoritmos() {    
    
    if (this.algoritmoSelecionado === 'bfs')
      this.bfs()
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

  iniciarAlgoritmo(podeIniciar: boolean) {
    if (podeIniciar) {
      console.log('iniciar')

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
      
      //self.limparLabirinto(true) tem q fazer com q tire a pintura da execução
    }
  }

  bfs(){

    self.explorador = new Explorador(self.labirinto.getPosicaoInicial(), self.labirinto.getPosicaoFinal())    
    self.mudancaLabirintoAnnounceSource.next(self.labirinto)

    let borda: Array<No> = new Array<No>()    
    let estado: Explorador = self.explorador

    let possibilidades

    let no: No = new No(estado, null, 1, null)
    let filho: No

    borda.push(no)
    console.log(no)
    while (borda.length > 0){
      
      estado = no.estado 
      
      if(estado.checarObjetivo()){
        self.mudancaLabirintoAnnounceSource.next(self.labirinto)
        break
      }
      
      else{
        no = borda.shift()
        estado = no.estado

        possibilidades = estado.checarAcoes(this.labirinto)

        for(let possibilidade in possibilidades){      
          filho = no.criarNoFilho(possibilidade, 1, null)
          self.mudancaLabirintoAnnounceSource.next(self.labirinto)

          if(filho.estado != (borda.filter(item => item.estado)))
            borda.push(filho)
        }

      }
    } 
  }
}

