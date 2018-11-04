import { TipoCelula } from './tipoCelula'

export class Celula {
    constructor(public x: number, public y: number,
        public largura: number, public altura: number, public tipo: TipoCelula) { }

    igual(outroQuadrado: Celula) {
        return outroQuadrado.x === this.x
            && outroQuadrado.y === this.y
            && outroQuadrado.tipo === this.tipo
    }

    mudarTipo(novoTipo: TipoCelula) {
        this.tipo = novoTipo
    }
}