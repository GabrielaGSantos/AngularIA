import { Celula } from './celula';
import { TipoCelula } from './tipoCelula';
import { Labirinto } from './labirinto';

let self: Explorador
  
export class Explorador {
  tipoAnterior: TipoCelula
  posicaoAtual: Celula

  constructor(public posicaoInicial: Celula, public posicaoFinal: Celula) {
    self = this
    this.tipoAnterior = posicaoInicial.tipo
    this.posicaoAtual = posicaoInicial
    posicaoInicial.mudarTipo(TipoCelula.explorador)
  }

  checarObjetivo(){
    if(self.posicaoAtual == self.posicaoFinal)
      return true
    else
      return false
  }

  //baixo cima direita esquerda
  checarAcoes(labirinto: Labirinto){

    let possibilidades: Array<Celula> = new Array<Celula>()

    if(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x+1]){
      if(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x+1].tipo == TipoCelula.caminho || 
        labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x+1].tipo ==TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x+1])
    }
    
    if(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x-1]){
      if(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x-1].tipo == TipoCelula.caminho || 
        labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x-1].tipo ==TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y][self.posicaoAtual.x-1])
    }
    
    if(labirinto.vetorCelulas[self.posicaoAtual.y+1][self.posicaoAtual.x]){
      if(labirinto.vetorCelulas[self.posicaoAtual.y+1][self.posicaoAtual.x].tipo == TipoCelula.caminho || 
        labirinto.vetorCelulas[self.posicaoAtual.y+1][self.posicaoAtual.x].tipo ==TipoCelula.fim)
        possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y+1][self.posicaoAtual.x])
    }

   if(labirinto.vetorCelulas[self.posicaoAtual.y-1][self.posicaoAtual.x]){
    if(labirinto.vetorCelulas[self.posicaoAtual.y-1][self.posicaoAtual.x].tipo == TipoCelula.caminho || 
      labirinto.vetorCelulas[self.posicaoAtual.y-1][self.posicaoAtual.x].tipo ==TipoCelula.fim)
      possibilidades.push(labirinto.vetorCelulas[self.posicaoAtual.y-1][self.posicaoAtual.x])
   }
    
   
    
    console.log(possibilidades)
    return possibilidades
  }
}

