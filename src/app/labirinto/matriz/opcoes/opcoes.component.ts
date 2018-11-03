import { Component, OnInit } from '@angular/core';
import { AlgoritmosComponent } from '../algoritmos/algoritmos.component';
import { Service } from '../servico.service'

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.component.html',
  styleUrls: ['./opcoes.component.css']
})

export class OpcoesComponent implements OnInit {

  algs: Algoritmo[] = [
    { nome: 'bfs', viewNome: 'Busca em Largura' },
    { nome: 'dfs', viewNome: 'Busca em Profundidade' },
    { nome: 'ucs', viewNome: 'Busca de Custo Uniforme' }
  ];

  selectedAlgorithm = ''
  disableExecucao: boolean = true;
  disablePlay: boolean = false;

  constructor(public service: Service) { }

  ngOnInit() {
  }

  limpar() {
    this.service.eventoEmitido('limpar')
  }

  iniciar() {
    this.disablePlay = true
    this.service.eventoEmitido('iniciar')
    this.service.setAlgoritmo(this.selectedAlgorithm)
  }

  pausar() {
    this.service.eventoEmitido('pausar')
  }

  cancelar() {
    this.service.eventoEmitido('cancelar')
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
