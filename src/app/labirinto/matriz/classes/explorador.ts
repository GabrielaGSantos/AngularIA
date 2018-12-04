import { Celula } from './celula';
import { TipoCelula } from './tipoCelula';
import { Labirinto } from './labirinto';

let self: Explorador

export class Explorador {
  private posicaoAtual: Celula

  constructor(public posicaoInicial: Celula, public posicaoFinal: Celula) {
    self = this
    this.posicaoAtual = posicaoInicial
    posicaoInicial.mudarTipo(TipoCelula.explorador)
  }

  checarObjetivo() {
    if (self.posicaoAtual == self.posicaoFinal)
      return true
    else
      return false
  }

  //baixo cima direita esquerda
  checarAcoes(labirinto: Labirinto) {

    let possibilidades: Array<Celula> = new Array<Celula>()

    if (self.posicaoAtual.x + 1 < labirinto.propriedades.numColunas) {
      if (labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x + 1].tipo == TipoCelula.caminho ||
        labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x + 1].tipo == TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x + 1])
    }

    if (self.posicaoAtual.x - 1 >= 0) {
      if (labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x - 1].tipo == TipoCelula.caminho ||
        labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x - 1].tipo == TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x - 1])
    }

    if (self.posicaoAtual.y + 1 < labirinto.propriedades.numLinhas) {
      if (labirinto.vetorCelulas[self.posicaoAtual.y + 1][self.posicaoAtual.x].tipo == TipoCelula.caminho ||
        labirinto.vetorCelulas[self.posicaoAtual.y + 1][self.posicaoAtual.x].tipo == TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y + 1][self.posicaoAtual.x])
    }

    if (self.posicaoAtual.y - 1 >= 0) {
      if (labirinto.vetorCelulas[self.posicaoAtual.y - 1][self.posicaoAtual.x].tipo == TipoCelula.caminho ||
        labirinto.vetorCelulas[self.posicaoAtual.y - 1][self.posicaoAtual.x].tipo == TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y - 1][self.posicaoAtual.x])
    }

    return possibilidades
  }

  mudarPosicao(posicaoNova: Celula) {
    this.posicaoAtual = posicaoNova
    if (posicaoNova.tipo == TipoCelula.caminho)
      this.posicaoAtual.mudarTipo(TipoCelula.explorador)
    else if (posicaoNova.tipo == TipoCelula.fim)
      this.posicaoAtual.mudarTipo(TipoCelula.exploradorFim)
  }

  getPosicaoAtual() {
    return this.posicaoAtual
  }
}

