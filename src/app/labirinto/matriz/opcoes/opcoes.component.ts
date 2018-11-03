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
  disableExecucao = true;
  disablePlay = false;

  constructor(public service: Service) { }

  ngOnInit() {
  }

  limpar() {
    this.service.announceLimpar(true)
  }

  iniciar() {
    this.disablePlay = true
    this.service.announceIniciar(true)
  }

  pausar() {
    this.service.announcePausar(true)
  }

  cancelar() {
    this.service.announceCancelar(true)
  }

  toggleExecucao() {
    if (this.selectedAlgorithm !== '') {
      this.disableExecucao = false;
    } else {
      this.disableExecucao = true;
    }

    this.service.announceAlgoritmo(this.selectedAlgorithm)
  }


}

export interface Algoritmo {
  nome: string;
  viewNome: string;
}
