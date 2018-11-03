import { Component, OnInit } from '@angular/core';
import { AlgoritmosService } from './algoritmos.service';

@Component({
  selector: 'app-algoritmos',
  templateUrl: './algoritmos.component.html',
  styleUrls: ['./algoritmos.component.css']
})
export class AlgoritmosComponent implements OnInit {

  constructor(public servicoAlgoritmos: AlgoritmosService) {
    this.iniciarListeners()
   }

  ngOnInit() {
  }

  iniciarListeners() {
    this.servicoAlgoritmos.bfsAnnounced$.subscribe(() => {
      console.log("teste")
    })
  }

}
