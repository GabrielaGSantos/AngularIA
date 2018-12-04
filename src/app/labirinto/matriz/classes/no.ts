import { Celula } from './celula';

export class No {

    constructor(public estado : Celula, public pai: No, public custo: number, public funcao: number) {
        
    }

    criarNoFilho(estado: Celula, custo: number, funcao: number) {
        return new No(estado, this, custo, funcao)
    }

}