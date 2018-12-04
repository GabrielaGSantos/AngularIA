import { Celula } from './celula';
import { TipoCelula } from './tipoCelula';

export interface PropriedadesLabirinto {
  numLinhas: number
  numColunas: number
  largura: number
  altura: number
}

export class Labirinto {
  vetorCelulas: Array<Array<Celula>>

  private posicaoInicial: Celula
  private posicaoFinal: Celula

  constructor(public propriedades: PropriedadesLabirinto) {
    this.vetorCelulas = new Array() // inicializa vetor
    while (this.vetorCelulas.push(new Array()) < this.propriedades.numLinhas) { } // inicializa linhas

    this.vetorCelulas.forEach((linha, numLinha) => {
      while (linha.length < this.propriedades.numColunas) {
        linha.push(new Celula(linha.length,
          numLinha,
          this.propriedades.largura / this.propriedades.numColunas,
          this.propriedades.altura / this.propriedades.numLinhas,
          (this.eBorda(numLinha, linha.length) ? TipoCelula.parede : TipoCelula.parede)))
      } // inicializa celulas
    })
  }

  eBorda(linha: number, coluna: number) {
    return linha === 0 || linha === this.propriedades.numLinhas - 1 || coluna === 0 || coluna === this.propriedades.numColunas - 1
  }

  click(elemento: any) {
    const celula = this.vetorCelulas[elemento.y][elemento.x]

    const tiposPossiveis = [TipoCelula.caminho, TipoCelula.parede]
    if (!this.posicaoInicial) { tiposPossiveis.push(TipoCelula.inicio) }
    if (!this.posicaoFinal) { tiposPossiveis.push(TipoCelula.fim) }

    // Remove PosInicial/Final se necessário
    if (celula.tipo === TipoCelula.inicio) {
      this.setPosicaoInicial(undefined)
    } else if (celula.tipo === TipoCelula.fim) {
      this.setPosicaoFinal(undefined)
    }

    celula.tipo = tiposPossiveis[(tiposPossiveis.findIndex((tipo) => tipo === celula.tipo) + 1) % tiposPossiveis.length]

    // Atribui PosInicial/Final se necessário
    if (celula.tipo === TipoCelula.inicio) {
      this.posicaoInicial = celula
    } else if (celula.tipo === TipoCelula.fim) {
      this.posicaoFinal = celula
    }
  }

  setPosicaoInicial(posicao: Celula) {
    this.posicaoInicial = posicao
  }

  setPosicaoFinal(end: Celula) {
    this.posicaoFinal = end
  }

  getPosicaoInicial() {
    return this.posicaoInicial
  }

  getPosicaoFinal() {
    return this.posicaoFinal
  }

  // Retorna um vetor unidimensional que contem as celulas diferentes deste labirinto e outroLabirinto
  celulasDiferentes(outroLabirinto: Labirinto): Array<Celula> {
    const diferenca = new Array<Celula>()

    this.vetorCelulas.forEach((linha, posicaoLinha) => {
      linha.forEach((celula, posicaoColuna) => {
        if (!outroLabirinto.vetorCelulas[posicaoLinha][posicaoColuna]
          .igual(celula)) {
          diferenca.push(outroLabirinto.vetorCelulas[posicaoLinha][posicaoColuna])
        }
      })
    })

    return diferenca
  }
}
