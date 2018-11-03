import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Service {

  emitirEvento = new EventEmitter<string>();

  constructor() {}
  
  eventoEmitido(evento: string){
    console.log(evento)
    this.emitirEvento.emit(evento)
  }

  setAlgoritmo(algoritmo: string){
    console.log(algoritmo)
  }
}
