import { Celula } from './celula';

let self: No

export class No {

    constructor(public estado, public pai, public custo, public heuristica) {
        self = this
        this.estado = estado
        this.pai = pai
        this.custo = custo
        this.heuristica = heuristica
    }

    criarNoFilho(estado, custo, heuristica) {
        return new No(estado, self, self.custo + custo, heuristica)
    }

}