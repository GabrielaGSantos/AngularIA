import { Celula } from './celula';
import { TipoCelula } from './tipoCelula';

export class Explorador {
  tipoAnterior: TipoCelula

  constructor(public posicaoInicial: Celula, public posicaoFinal: Celula) {
    this.tipoAnterior = posicaoInicial.tipo
    posicaoInicial.mudarTipo(TipoCelula.explorador)
  }
}
