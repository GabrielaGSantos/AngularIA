import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlgoritmosComponent } from '../algoritmos/algoritmos.component';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.component.html',
  styleUrls: ['./opcoes.component.css']
})

export class OpcoesComponent implements OnInit {
  @Output() event = new EventEmitter()

  algs: Algoritmo[] = [
    { nome: 'bfs', viewNome: 'Busca em Largura' },
    { nome: 'dfs', viewNome: 'Busca em Profundidade' },
    { nome: 'ucs', viewNome: 'Busca de Custo Uniforme' }
  ];

  selectedAlgorithm = ''
  disableExecucao: boolean = true;
  disablePlay: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  limpar() {
    this.event.emit({evento: 'limpar'})
  }

  iniciar() {
    this.disablePlay = true
    this.event.emit({evento: 'iniciar', algoritmo: this.selectedAlgorithm})
  }

  pausar() {
    this.event.emit({evento: 'pausar'})
  }

  cancelar() {
    console.log("cancelar")
    this.event.emit({evento: 'cancelar'})
  }

  toggleExecucao() {
    if (this.selectedAlgorithm != '')
      this.disableExecucao = false;         
    else
      this.disableExecucao = true;
  }


}

export interface Algoritmo {
  nome: string;
  viewNome: string;
}
